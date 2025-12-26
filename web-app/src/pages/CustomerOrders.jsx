import { useState, useEffect } from 'react'
import { Package, Calendar, Clock, CheckCircle, XCircle, Loader, Edit2, Save, X, Trash2, ShoppingBag, Plus } from 'lucide-react'
import { orderAPI, productAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CustomerOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [editingOrder, setEditingOrder] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('MORNING')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll()
      console.log('🔵 RAW API RESPONSE:', response.data)
      console.log('🔵 First order sample:', response.data?.[0])
      
      // Map backend field names to frontend field names
      const userOrders = (response.data || [])
        .map(order => {
          const mapped = {
            ...order,
            orderDate: order.orderDateTime || order.orderDate,
            totalAmount: order.orderTotal || order.totalAmount,
            products: order.orderProductDetails || order.products || []
          }
          console.log('📦 Order mapping:', {
            original: { orderDateTime: order.orderDateTime, orderTotal: order.orderTotal, products: order.orderProductDetails?.length },
            mapped: { orderDate: mapped.orderDate, totalAmount: mapped.totalAmount, products: mapped.products?.length }
          })
          return mapped
        })
        .filter(order => order.customerId === user?.customerId)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      
      console.log('🟢 FINAL USER ORDERS:', userOrders)
      setOrders(userOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const formatOrderId = (orderId) => {
    return orderId ? `ORD-${orderId.slice(-8).toUpperCase()}` : 'N/A'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setSelectedProducts(order.products.map(p => ({
      productId: p.productId,
      quantity: p.quantity || 1
    })))
    setDeliveryDate(order.deliveryDate || '')
    setDeliveryTimeSlot(order.deliveryTimeSlot || 'MORNING')
    setShowEditModal(true)
  }

  const handleCancelEdit = () => {
    setEditingOrder(null)
    setShowEditModal(false)
    setSelectedProducts([])
    setDeliveryDate('')
    setDeliveryTimeSlot('MORNING')
  }

  const handleSaveEdit = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product')
      return
    }

    if (!deliveryDate) {
      alert('Please select a delivery date')
      return
    }

    try {
      setSaving(true)

      const orderData = {
        orderId: editingOrder.orderId,
        customerId: user.customerId,
        productOrderReqs: selectedProducts.map(p => ({
          productId: p.productId,
          quantity: p.quantity
        })),
        deliveryDate: deliveryDate,
        deliveryTimeSlot: deliveryTimeSlot,
        deliveryFrequency: editingOrder.deliveryFrequency || 'ONETIME',
        orderStatus: editingOrder.orderStatus || 'PENDING',
        deliveryCharge: 0.0
      }

      await orderAPI.update(orderData)
      alert('Order updated successfully!')
      handleCancelEdit()
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }
    try {
      await orderAPI.delete(orderId)
      await fetchOrders()
      alert('Order deleted successfully')
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order: ' + (error.response?.data?.message || error.message))
    }
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === productId)
      if (existing) {
        return prev.filter(p => p.productId !== productId)
      } else {
        return [...prev, { productId, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(prev =>
      prev.map(p => p.productId === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p)
    )
  }

  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product')
      return
    }

    if (!deliveryDate) {
      alert('Please select a delivery date')
      return
    }

    try {
      setCreating(true)

      const orderData = {
        customerId: user.customerId,
        productOrderReqs: selectedProducts.map(p => ({
          productId: p.productId,
          quantity: p.quantity
        })),
        deliveryDate: deliveryDate,
        deliveryTimeSlot: deliveryTimeSlot,
        deliveryFrequency: 'ONETIME',
        orderStatus: 'PENDING',
        deliveryCharge: 0.0
      }

      await orderAPI.create(orderData)
      alert('Order created successfully!')
      setShowCreateModal(false)
      setSelectedProducts([])
      setDeliveryDate('')
      setDeliveryTimeSlot('MORNING')
      await fetchOrders()
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order: ' + (error.response?.data?.message || error.message))
    } finally {
      setCreating(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  const filteredOrders = orders.filter(order => 
    filter === 'ALL' || order.orderStatus?.toUpperCase() === filter
  )

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus?.toUpperCase() === 'PENDING').length,
    delivered: orders.filter(o => o.orderStatus?.toUpperCase() === 'DELIVERED').length,
    inProgress: orders.filter(o => ['IN_PROGRESS', 'IN PROGRESS'].includes(o.orderStatus?.toUpperCase())).length
  }

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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-purple-100">Track and manage your orders</p>
          </div>
          <button
            onClick={() => {
              console.log('✅ CREATE ORDER BUTTON CLICKED!')
              setShowCreateModal(true)
            }}
            className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Create Order</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-milkman text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{formatOrderId(order.orderId)}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.orderDate)}
                    </div>
                    {order.deliveryDate && (
                      <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-1">
                        <Clock className="w-4 h-4" />
                        Delivery: {formatDate(order.deliveryDate)} • {order.deliveryTimeSlot || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-milkman">
                      ₹{order.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="font-semibold">
                        {order.orderStatus?.replace('_', ' ')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEdit(order)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      title="Edit Order"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.orderId)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      title="Delete Order"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {order.products && order.products.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Order Items
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{product.productName}</p>
                          <p className="text-xs text-gray-500">Price per unit: ₹{product.productPrice?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-bold text-gray-800">{product.quantity || 1}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="font-bold text-milkman">
                            ₹{((product.productPrice || 0) * (product.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Order Total:</span>
                      <span className="text-xl font-bold text-milkman">
                        ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No orders found</p>
          <p className="text-gray-400">
            {filter === 'ALL' 
              ? "You haven't placed any orders yet" 
              : `No ${filter.replace('_', ' ').toLowerCase()} orders`}
          </p>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700">Select Products</h3>
                  <p className="text-sm text-gray-500">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {products.map((product) => {
                    const selected = selectedProducts.find(p => p.productId === product.productId)
                    return (
                      <div
                        key={product.productId}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selected 
                            ? 'bg-purple-50 border-purple-400 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                        }`}
                        onClick={() => toggleProductSelection(product.productId)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                            selected ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
                          }`}>
                            {selected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${selected ? 'text-purple-800' : 'text-gray-800'}`}>
                              {product.productName}
                            </p>
                            <p className="text-sm text-gray-500">₹{product.productPrice?.toFixed(2)} per unit</p>
                          </div>
                        </div>
                        {selected && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-600">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={selected.quantity}
                              onChange={(e) => {
                                e.stopPropagation()
                                updateQuantity(product.productId, e.target.value)
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleProductSelection(product.productId)
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove product"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Click on products to add/remove them. Adjust quantities using the input field.
                </p>
              </div>

              {/* Delivery Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time Slot
                  </label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="MORNING">Morning (6 AM - 10 AM)</option>
                    <option value="AFTERNOON">Afternoon (12 PM - 4 PM)</option>
                    <option value="EVENING">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              {selectedProducts.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                  <div className="space-y-1">
                    {selectedProducts.map(sp => {
                      const product = products.find(p => p.productId === sp.productId)
                      return (
                        <div key={sp.productId} className="flex justify-between text-sm">
                          <span>{product?.productName} x {sp.quantity}</span>
                          <span className="font-medium">₹{((product?.productPrice || 0) * sp.quantity).toFixed(2)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">
                        ₹{selectedProducts.reduce((total, sp) => {
                          const product = products.find(p => p.productId === sp.productId)
                          return total + ((product?.productPrice || 0) * sp.quantity)
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={creating || selectedProducts.length === 0}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Edit Order</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={saving}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Order ID */}
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Editing Order</p>
                <p className="text-lg font-bold text-purple-600">{formatOrderId(editingOrder.orderId)}</p>
              </div>

              {/* Products Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Select Products</h3>
                  <p className="text-sm text-gray-500">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {products.map(product => {
                    const selected = selectedProducts.find(p => p.productId === product.productId)
                    return (
                      <div
                        key={product.productId}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selected 
                            ? 'bg-purple-50 border-purple-400 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                        }`}
                        onClick={() => toggleProductSelection(product.productId)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                            selected ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
                          }`}>
                            {selected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${selected ? 'text-purple-800' : 'text-gray-800'}`}>
                              {product.productName}
                            </p>
                            <p className="text-sm text-gray-500">₹{product.productPrice?.toFixed(2)} per unit</p>
                          </div>
                        </div>
                        {selected && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-600">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={selected.quantity}
                              onChange={(e) => {
                                e.stopPropagation()
                                updateQuantity(product.productId, e.target.value)
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleProductSelection(product.productId)
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove product"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Click on products to add/remove them. Adjust quantities using the input field.
                </p>
              </div>

              {/* Delivery Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time Slot
                  </label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="MORNING">Morning (6 AM - 10 AM)</option>
                    <option value="AFTERNOON">Afternoon (12 PM - 4 PM)</option>
                    <option value="EVENING">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              {selectedProducts.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                  <div className="space-y-1">
                    {selectedProducts.map(sp => {
                      const product = products.find(p => p.productId === sp.productId)
                      return (
                        <div key={sp.productId} className="flex justify-between text-sm">
                          <span>{product?.productName} x {sp.quantity}</span>
                          <span className="font-medium">₹{((product?.productPrice || 0) * sp.quantity).toFixed(2)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">
                        ₹{selectedProducts.reduce((total, sp) => {
                          const product = products.find(p => p.productId === sp.productId)
                          return total + ((product?.productPrice || 0) * sp.quantity)
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || selectedProducts.length === 0}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerOrders
