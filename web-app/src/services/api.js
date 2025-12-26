import axios from 'axios'

const API_BASE_URL = '/milkman'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log(`🔑 Token attached: ${token.substring(0, 20)}...`)
  } else {
    console.warn('⚠️ No token found in sessionStorage')
  }
  return config
})

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config?.method?.toUpperCase()} ${response.config?.url} - Status: ${response.status}`)
    return response
  },
  async (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`, error.response?.data)
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = sessionStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token, logout
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/customer/refresh-token`, {
          refreshToken: refreshToken
        })

        const { authToken, refreshToken: newRefreshToken, role, customerId, customerName } = response.data

        sessionStorage.setItem('token', authToken)
        sessionStorage.setItem('refreshToken', newRefreshToken)
        
        // Update user data with refreshed info
        if (customerId && customerName) {
          const user = { customerId, customerName, role }
          sessionStorage.setItem('user', JSON.stringify(user))
        }

        api.defaults.headers.common['Authorization'] = 'Bearer ' + authToken
        originalRequest.headers['Authorization'] = 'Bearer ' + authToken

        processQueue(null, authToken)

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        
        // Refresh failed, logout
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('user')
        window.location.href = '/login'
        
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Customer APIs
export const customerAPI = {
  getAll: () => api.get('/customer/getAll'),
  getById: (id) => {
    console.log(`🔍 customerAPI.getById(${id})`)
    return api.get(`/customer/${id}`)
  },
  create: (customer) => api.post('/customer/register', customer),
  update: (id, customer) => {
    console.log(`\n🚀 customerAPI.update() called`)
    console.log(`🚀 ID parameter:`, id)
    console.log(`🚀 Customer data:`, JSON.stringify(customer, null, 2))
    console.log(`🚀 Making PUT request to: /customer/update`)
    return api.put(`/customer/update`, customer)
  },
  delete: (id) => api.delete(`/customer/${id}`)
}

// Product APIs
export const productAPI = {
  getAll: () => api.get('/product/getProducts'),
  getById: (id) => api.get(`/product/${id}`),
  create: (product) => api.post('/product/register', product),
  update: (id, product) => api.put(`/product/update`, product),
  delete: (id) => api.delete(`/product/${id}`)
}

// Order APIs
export const orderAPI = {
  getAll: () => api.get('/order/getAllOrders'),
  getById: (id) => api.get(`/order/${id}`),
  create: (order) => api.post('/order/create', order),
  update: (order) => api.put('/order/update', order),
  delete: (id) => api.delete(`/order/delete/${id}`)
}

// Subscription APIs
export const subscriptionAPI = {
  getAll: () => api.get('/subscribe/getAllSubscriptions'),
  getById: (id) => api.get(`/subscribe/${id}`),
  create: (subscription) => api.post('/subscribe/create', subscription),
  update: (subscription) => api.put('/subscribe/update', subscription),
  delete: (id) => api.delete(`/subscribe/delete/${id}`)
}

// Auth APIs
export const authAPI = {
  authenticate: (credentials) => api.post('/customer/authenticate', credentials),
  register: (customerData) => api.post('/customer/register', customerData)
}

export default api
