import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react'
import { customerAPI } from '../services/api'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    emailId: '',
    primaryPhone: '',
    address: '',
    authPin: 'admin',
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll()
      setCustomers(response.data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        // Include all existing customer data plus the updated fields
        const [firstName, ...lastNameParts] = formData.name.split(' ')
        const lastName = lastNameParts.join(' ')
        
        const updatedCustomer = {
          ...editingCustomer,
          firstName: firstName || editingCustomer.firstName,
          lastName: lastName || editingCustomer.lastName,
          emailId: formData.emailId,
          primaryPhone: formData.primaryPhone,
          address: formData.address,
          status: formData.status
        }
        
        await customerAPI.update(editingCustomer.customerId, updatedCustomer)
      } else {
        await customerAPI.create(formData)
      }
      fetchCustomers()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Error saving customer. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id)
        fetchCustomers()
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Error deleting customer. Please try again.')
      }
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      emailId: customer.emailId || '',
      primaryPhone: customer.primaryPhone || '',
      address: customer.address || '',
      authPin: 'admin',
      status: customer.status || 'ACTIVE'
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
    setFormData({
      name: '',
      emailId: '',
      primaryPhone: '',
      address: '',
      authPin: 'admin',
      status: 'ACTIVE'
    })
  }

  const filteredCustomers = customers.filter(customer =>
    customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.primaryPhone?.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-milkman focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.customerId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.emailId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.primaryPhone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.address}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.customerId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.emailId}
                  onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                  className="input-field"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.primaryPhone}
                  onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                  className="input-field"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
