import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Plus, Minus, Check } from 'lucide-react'
import { productAPI, orderAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CustomerProducts = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      const activeProducts = (response.data || []).filter(p => p.status === 'ACTIVE')
      setProducts(activeProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (productId, change) => {
    setCart(prev => {
      const current = prev[productId] || 0
      const newQuantity = Math.max(0, current + change)
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQuantity }
    })
  }

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, quantity]) => {
      const product = products.find(p => p.productId === productId)
      return sum + (product?.productPrice || 0) * quantity
    }, 0)
  }

  const handlePlaceOrder = async () => {
    if (getTotalItems() === 0) {
      alert('Please add items to your cart')
      return
    }

    try {
      console.log('🛒 Placing order for customer:', user.customerId)
      
      // Backend expects productOrderReqs array with productId and quantity
      const productOrderReqs = Object.entries(cart)
        .filter(([_, qty]) => qty > 0)
        .map(([productId, quantity]) => ({
          productId: productId,
          quantity: quantity
        }))

      const orderData = {
        customerId: user.customerId,
        productOrderReqs: productOrderReqs,
        deliveryDate: new Date().toISOString().split('T')[0],
        deliveryTimeSlot: 'MORNING',
        orderStatus: 'PENDING',
        deliveryCharge: 0
      }

      console.log('📦 Order data:', orderData)
      await orderAPI.create(orderData)
      setOrderSuccess(true)
      setCart({})
      
      setTimeout(() => {
        setOrderSuccess(false)
        navigate('/orders')
      }, 2000)
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-milkman"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-milkman to-milkman-dark text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Order Products</h1>
        <p className="text-milkman-light">Fresh milk delivered to your doorstep</p>
      </div>

      {/* Success Message */}
      {orderSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <Check className="w-6 h-6 mr-3" />
            <div>
              <p className="font-bold">Order Placed Successfully!</p>
              <p className="text-sm">Redirecting to your orders...</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Cart Summary */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent"
          />
        </div>

        {getTotalItems() > 0 && (
          <div className="bg-milkman text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-90">Cart Total</p>
              <p className="text-2xl font-bold">₹{getTotalPrice().toFixed(2)}</p>
              <p className="text-xs opacity-75">{getTotalItems()} items</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-white text-milkman px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const inCart = cart[product.productId] || 0
          return (
            <div
              key={product.productId}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image Placeholder */}
              <div className="bg-gradient-to-br from-milkman-light to-milkman h-40 flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-white opacity-50" />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{product.productName}</h3>
                    <p className="text-sm text-gray-500">{product.productType}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    {product.status}
                  </span>
                </div>

                {product.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-milkman">₹{product.productPrice || 0}</p>
                    <p className="text-xs text-gray-500">per unit</p>
                  </div>
                </div>

                {/* Add to Cart Controls */}
                {inCart === 0 ? (
                  <button
                    onClick={() => updateQuantity(product.productId, 1)}
                    className="w-full bg-milkman text-white py-3 rounded-lg font-semibold hover:bg-milkman-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(product.productId, -1)}
                      className="bg-white p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-milkman" />
                    </button>
                    <span className="text-xl font-bold text-milkman px-4">{inCart}</span>
                    <button
                      onClick={() => updateQuantity(product.productId, 1)}
                      className="bg-white p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-milkman" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  )
}

export default CustomerProducts
