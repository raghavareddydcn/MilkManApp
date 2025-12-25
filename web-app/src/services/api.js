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
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token, logout
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/customer/refresh-token`, {
          refreshToken: refreshToken
        })

        const { authToken, refreshToken: newRefreshToken } = response.data

        localStorage.setItem('token', authToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        api.defaults.headers.common['Authorization'] = 'Bearer ' + authToken
        originalRequest.headers['Authorization'] = 'Bearer ' + authToken

        processQueue(null, authToken)

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        
        // Refresh failed, logout
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
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
  getById: (id) => api.get(`/customer/${id}`),
  create: (customer) => api.post('/customer/register', customer),
  update: (id, customer) => api.put(`/customer/update`, customer),
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
  update: (id, order) => api.put(`/order/${id}`, order),
  delete: (id) => api.delete(`/order/${id}`)
}

// Subscription APIs
export const subscriptionAPI = {
  getAll: () => api.get('/subscribe/getAllSubscriptions'),
  getById: (id) => api.get(`/subscribe/${id}`),
  create: (subscription) => api.post('/subscribe/create', subscription),
  update: (id, subscription) => api.put(`/subscribe/${id}`, subscription),
  delete: (id) => api.delete(`/subscribe/${id}`)
}

// Auth APIs
export const authAPI = {
  authenticate: (credentials) => api.post('/customer/authenticate', credentials),
  register: (customerData) => api.post('/customer/register', customerData)
}

export default api
