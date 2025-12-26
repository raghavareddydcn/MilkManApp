import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { customerAPI } from '../services/api'

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCustomerDetails()
  }, [])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('👤 Fetching profile for customer:', user?.customerId)
      
      // Use customerAPI.getById which includes proper auth headers
      const response = await customerAPI.getById(user?.customerId)
      console.log('✅ API response:', response)
      
      // Handle different response formats
      let currentCustomer = null
      if (response.data) {
        if (response.data.data) {
          currentCustomer = response.data.data
        } else {
          currentCustomer = response.data
        }
      }
      
      console.log('✅ Customer data:', currentCustomer)
      console.log('📋 Field check:', {
        firstName: currentCustomer?.firstName,
        lastName: currentCustomer?.lastName,
        primaryPhone: currentCustomer?.primaryPhone,
        secondaryPhone: currentCustomer?.secondaryPhone,
        emailId: currentCustomer?.emailId,
        pinCode: currentCustomer?.pinCode
      })
      
      if (currentCustomer) {
        setCustomerDetails(currentCustomer)
        console.log('✅ Set customerDetails to:', currentCustomer)
        
        const formDataToSet = {
          firstname: currentCustomer.firstName || '',
          lastname: currentCustomer.lastName || '',
          sphone: currentCustomer.secondaryPhone || '',
          emailid: currentCustomer.emailId || '',
          address: currentCustomer.address || '',
          pincode: currentCustomer.pinCode || '',
          landmark: currentCustomer.landmark || '',
          dob: currentCustomer.dob ? currentCustomer.dob.split('T')[0] : ''
        }
        console.log('✅ Setting formData to:', formDataToSet)
        setFormData(formDataToSet)
      } else {
        console.error('❌ No customer data received')
        setError('Profile not found. Please contact support.')
      }
    } catch (error) {
      console.error('❌ Error fetching customer details:', error)
      console.error('Error response:', error.response)
      console.error('Error config:', error.config)
      const errorMsg = error.response?.status === 403 
        ? 'Access denied. Please log in again.' 
        : (error.response?.data?.message || error.message || 'Unknown error')
      setError('Failed to load profile details: ' + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setEditing(false)
    setError('')
    setSuccess('')
    // Reset form data to original values
    setFormData({
      firstname: customerDetails.firstName || '',
      lastname: customerDetails.lastName || '',
      sphone: customerDetails.secondaryPhone || '',
      emailid: customerDetails.emailId || '',
      address: customerDetails.address || '',
      pincode: customerDetails.pinCode || '',
      landmark: customerDetails.landmark || '',
      dob: customerDetails.dob ? customerDetails.dob.split('T')[0] : ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    console.log('🔴🔴🔴 NEW CODE VERSION 2.0 - IF YOU SEE THIS, CACHE IS CLEARED! 🔴🔴🔴')
    try {
      console.log('\n========== PROFILE SAVE STARTED ==========')
      console.log('🔵 Step 1: handleSave() called')
      console.log('🔵 Customer ID:', user.customerId)
      console.log('🔵 Form Data:', formData)
      console.log('🔵 Current Customer Details:', customerDetails)
      
      setSaving(true)
      setError('')
      setSuccess('')

      console.log('💾 Saving profile for customer:', user.customerId)

      // Validate email format
      if (formData.emailid && !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.emailid)) {
        console.log('❌ Validation failed: Invalid email format')
        setError('Invalid email format')
        setSaving(false)
        return
      }

      // Validate pincode (if provided)
      if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
        console.log('❌ Validation failed: Invalid pincode')
        setError('Pincode must be 6 digits')
        setSaving(false)
        return
      }

      console.log('✅ Validation passed')

      // Prepare update payload with correct field names for backend
      const updateData = {
        id: customerDetails.id,
        customerId: customerDetails.customerId,
        firstName: formData.firstname,
        lastName: formData.lastname,
        primaryPhone: customerDetails.primaryPhone,
        secondaryPhone: formData.sphone,
        emailId: formData.emailid,
        dob: formData.dob,
        authPin: customerDetails.authPin,
        address: formData.address,
        pinCode: formData.pincode,
        landmark: formData.landmark,
        createdBy: customerDetails.createdBy,
        createdTime: customerDetails.createdTime,
        updatedBy: user.customerId,
        updatedTime: new Date().toISOString(),
        status: customerDetails.status,
        role: customerDetails.role
      }

      console.log('🔵 Step 2: Update data prepared')
      console.log('📤 UPDATE DATA TO SEND:', JSON.stringify(updateData, null, 2))
      console.log('🔵 UPDATE DATA OBJECT TYPE:', typeof updateData)
      console.log('🔵 UPDATE DATA KEYS:', Object.keys(updateData))
      console.log('🔵 Step 3: About to call customerAPI.update()')
      console.log('🔵 customerAPI object:', customerAPI)
      console.log('🔵 customerAPI.update function exists?', typeof customerAPI.update)

      // Call update API
      console.log('🔵 CALLING: customerAPI.update(' + customerDetails.id + ', updateData)')
      const response = await customerAPI.update(customerDetails.id, updateData)
      console.log('🔵 RESPONSE RECEIVED:', response)
      
      console.log('🔵 Step 4: API call completed')
      console.log('✅ RESPONSE STATUS:', response.status)
      console.log('✅ RESPONSE DATA:', JSON.stringify(response.data, null, 2))

      setSuccess('Profile updated successfully!')
      setEditing(false)

      console.log('🔵 Step 5: Refreshing customer details from database...')
      // Refresh customer details immediately
      await fetchCustomerDetails()
      console.log('🔵 Step 6: Customer details refreshed from server')
      console.log('========== PROFILE SAVE COMPLETED ==========')

    } catch (error) {
      console.log('\n========== PROFILE SAVE FAILED ==========')
      console.error('❌ ERROR CAUGHT IN handleSave():', error)
      console.error('❌ Error Response:', error.response)
      console.error('❌ Error Status:', error.response?.status)
      console.error('❌ Error Data:', error.response?.data)
      console.error('❌ Error Message:', error.message)
      console.log('========================================\n')
      setError('Failed to update profile: ' + (error.response?.data?.message || error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-milkman"></div>
      </div>
    )
  }

  if (error && !customerDetails) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-milkman to-milkman-dark text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-4">
                <User className="w-12 h-12 text-milkman" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {customerDetails?.firstName} {customerDetails?.lastName}
                </h1>
                <p className="text-milkman-light">Customer ID: {customerDetails?.customerId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {customerDetails?.status && (
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  customerDetails.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {customerDetails.status}
                </span>
              )}
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-white text-milkman px-4 py-2 rounded-lg hover:bg-milkman-light transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-milkman" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">Primary Phone</label>
                <p className="text-gray-800 font-medium mt-1">
                  {customerDetails?.primaryPhone || 'Not provided'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">Secondary Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    name="sphone"
                    value={formData.sphone}
                    onChange={handleChange}
                    placeholder="Enter secondary phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                    maxLength="10"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.secondaryPhone || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <label className="text-sm text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="emailid"
                    value={formData.emailid}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.emailId || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-milkman" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">First Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.firstName || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.lastName || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <label className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Date of Birth
                </label>
                {editing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.dob 
                      ? new Date(customerDetails.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-milkman" />
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <label className="text-sm text-gray-600">Address</label>
                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.address || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">Pincode</label>
                {editing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.pinCode || 'Not provided'}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">Landmark</label>
                {editing ? (
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Enter nearby landmark"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-milkman focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium mt-1">
                    {customerDetails?.landmark || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-milkman" />
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerDetails?.role && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">Account Role</label>
                  <p className="text-gray-800 font-medium mt-1 capitalize">
                    {customerDetails.role.toLowerCase()}
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm text-gray-600">Customer ID</label>
                <p className="text-gray-800 font-medium mt-1">
                  {customerDetails?.customerId}
                </p>
              </div>
            </div>
          </div>

          {/* Account Dates */}
          {(customerDetails?.createdTime || customerDetails?.updatedTime) && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {customerDetails?.createdTime && (
                  <div>
                    <span className="font-medium">Account Created:</span>{' '}
                    {new Date(customerDetails.createdTime).toLocaleString()}
                  </div>
                )}
                {customerDetails?.updatedTime && (
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date(customerDetails.updatedTime).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
