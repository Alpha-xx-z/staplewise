import React, { useState } from 'react';
import { Users, Package, MessageSquare, TrendingUp, Plus, Search, Filter, Download, Eye, Trash2, X } from 'lucide-react';
import { mockQueries, cashewGrades } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [queries, setQueries] = useState(mockQueries);
  const [orders, setOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'Sales Employee',
      email: 'sales@staplewise.com',
      phone: '+91 98765 43210',
      role: 'sales',
      status: 'Active',
      joinedDate: '2024-01-15',
      assignedQueries: 5
    }
  ]);
  const [orderForm, setOrderForm] = useState({
    sellerId: '',
    sellerName: '',
    productName: '',
    grade: '',
    quantity: '',
    pricePerKg: '',
    buyerCompany: '',
    buyerEmail: '',
    buyerPhone: '',
    deliveryAddress: '',
    notes: ''
  });

  // Mock sellers data
  const mockSellers = [
    { id: '1', name: 'Premium Cashews Ltd', location: 'Mangalore', email: 'contact@premiumcashews.com' },
    { id: '2', name: 'Golden Kernel Exports', location: 'Kochi', email: 'sales@goldenkernel.com' },
    { id: '3', name: 'Coastal Cashew Co', location: 'Goa', email: 'info@coastalcashew.com' },
    { id: '4', name: 'South India Cashews', location: 'Kollam', email: 'orders@southindiacashews.com' }
  ];
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const stats = [
    { label: 'Total Visitors', value: '12,345', icon: Users, color: 'text-blue-600' },
    { label: 'Products Listed', value: '25', icon: Package, color: 'text-green-600' },
    { label: 'Product Queries', value: '89', icon: MessageSquare, color: 'text-orange-600' },
    { label: 'Total Users', value: '456', icon: Users, color: 'text-purple-600' }
  ];

  const handleAssignQuery = (queryId: string, assignedTo: string) => {
    setQueries(prev => prev.map(query => 
      query.id === queryId 
        ? { ...query, status: 'completed' as const, assignedTo }
        : query
    ));
  };

  const handleDeleteQuery = (queryId: string) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      setQueries(prev => prev.filter(query => query.id !== queryId));
      setSelectedQuery(null);
      alert('Query deleted successfully!');
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      setSelectedEmployee(null);
      alert('Employee deleted successfully!');
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee = {
      id: Date.now().toString(),
      ...employeeForm,
      role: 'sales',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedQueries: 0
    };
    setEmployees(prev => [...prev, newEmployee]);
    alert('Sales employee added successfully!');
    setEmployeeForm({ name: '', email: '', password: '', phone: '' });
    setShowAddEmployee(false);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now().toString(),
      orderName: `${orderForm.productName} - ${orderForm.grade}`,
      quantity: parseInt(orderForm.quantity),
      price: parseInt(orderForm.quantity) * parseFloat(orderForm.pricePerKg),
      status: 'Processing',
      sellerId: orderForm.sellerId,
      sellerName: orderForm.sellerName,
      buyerCompany: orderForm.buyerCompany,
      buyerEmail: orderForm.buyerEmail,
      buyerPhone: orderForm.buyerPhone,
      deliveryAddress: orderForm.deliveryAddress,
      notes: orderForm.notes,
      createdAt: new Date()
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Store in localStorage to simulate real-time updates (in production, use API)
    localStorage.setItem('adminOrders', JSON.stringify([newOrder]));
    
    alert('Order placed successfully!');
    setOrderForm({
      sellerId: '',
      sellerName: '',
      productName: '',
      grade: '',
      quantity: '',
      pricePerKg: '',
      buyerCompany: '',
      buyerEmail: '',
      buyerPhone: '',
      deliveryAddress: '',
      notes: ''
    });
    setShowOrderForm(false);
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-fill seller name when seller is selected
    if (name === 'sellerId') {
      const selectedSeller = mockSellers.find(seller => seller.id === value);
      if (selectedSeller) {
        setOrderForm(prev => ({
          ...prev,
          sellerName: selectedSeller.name
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-playfair text-primary">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your StapleWise B2B platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-soft mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Dashboard Overview' },
             { id: 'orders', label: 'Place Orders' },
              { id: 'employees', label: 'Sales Employees' },
              { id: 'queries', label: 'Product Queries' },
              { id: 'users', label: 'Master Data' },
              { id: 'reports', label: 'Reports' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-soft p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {queries.slice(0, 5).map(query => (
                  <div key={query.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">{query.companyName}</p>
                      <p className="text-sm text-gray-600">{query.type} query - {query.quantity} tonnes</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      query.status === 'completed' ? 'bg-green-100 text-green-800' :
                      query.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {query.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Place Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Place Order Form */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-primary">Place New Order</h3>
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </button>
              </div>

              {showOrderForm && (
                <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-4 text-primary">Create New Order</h4>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seller Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Seller *
                        </label>
                        <select
                          name="sellerId"
                          value={orderForm.sellerId}
                          onChange={handleOrderInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Choose Seller...</option>
                          {mockSellers.map(seller => (
                            <option key={seller.id} value={seller.id}>
                              {seller.name} - {seller.location}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={orderForm.productName}
                          onChange={handleOrderInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., Premium Cashew Kernels"
                        />
                      </div>

                      {/* Grade */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grade *
                        </label>
                        <select
                          name="grade"
                          value={orderForm.grade}
                          onChange={handleOrderInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select Grade</option>
                          {cashewGrades.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity (Tonnes) *
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={orderForm.quantity}
                          onChange={handleOrderInputChange}
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., 25"
                        />
                      </div>

                      {/* Price per KG */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per KG (₹) *
                        </label>
                        <input
                          type="number"
                          name="pricePerKg"
                          value={orderForm.pricePerKg}
                          onChange={handleOrderInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., 85"
                        />
                      </div>

                      {/* Buyer Company */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Buyer Company *
                        </label>
                        <input
                          type="text"
                          name="buyerCompany"
                          value={orderForm.buyerCompany}
                          onChange={handleOrderInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., ABC Foods Ltd"
                        />
                      </div>

                      {/* Buyer Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Buyer Email *
                        </label>
                        <input
                          type="email"
                          name="buyerEmail"
                          value={orderForm.buyerEmail}
                          onChange={handleOrderInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="buyer@company.com"
                        />
                      </div>

                      {/* Buyer Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Buyer Phone *
                        </label>
                        <input
                          type="tel"
                          name="buyerPhone"
                          value={orderForm.buyerPhone}
                          onChange={handleOrderInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      {/* Delivery Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address *
                        </label>
                        <textarea
                          name="deliveryAddress"
                          value={orderForm.deliveryAddress}
                          onChange={handleOrderInputChange}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Complete delivery address with pincode"
                        />
                      </div>

                      {/* Notes */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          name="notes"
                          value={orderForm.notes}
                          onChange={handleOrderInputChange}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Any special instructions or notes"
                        />
                      </div>
                    </div>

                    {/* Total Calculation */}
                    {orderForm.quantity && orderForm.pricePerKg && (
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-primary">
                          Total Amount: ₹{(parseInt(orderForm.quantity || '0') * parseFloat(orderForm.pricePerKg || '0')).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        Place Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOrderForm(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Recent Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-primary">{order.orderName}</h4>
                          <p className="text-sm text-gray-600">Seller: {order.sellerName}</p>
                          <p className="text-sm text-gray-600">Buyer: {order.buyerCompany}</p>
                          <p className="text-sm text-gray-600">Quantity: {order.quantity} tonnes</p>
                          <p className="text-sm text-gray-600">Total: ₹{order.price.toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No orders placed yet</p>
              )}
            </div>
          </div>
        )}

        {/* Sales Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-primary">Sales Employees</h3>
              <button
                onClick={() => setShowAddEmployee(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </button>
            </div>

            {showAddEmployee && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium mb-4">Add New Sales Employee</h4>
                <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, password: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      Add Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddEmployee(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {employees.map(employee => (
                <div 
                  key={employee.id} 
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                    <p className="text-xs text-gray-500">Joined: {employee.joinedDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-green-600">{employee.status}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEmployee(employee.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Queries Tab */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-primary">Product Queries</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search queries..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Quantity</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map(query => (
                    <tr 
                      key={query.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedQuery(query)}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{query.companyName}</p>
                          <p className="text-sm text-gray-600">{query.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          query.type === 'buy' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {query.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{query.quantity} tonnes</td>
                      <td className="py-3 px-4">{query.pincode}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          query.status === 'completed' ? 'bg-green-100 text-green-800' :
                          query.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {query.status === 'completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Query already completed');
                            }}
                            className="text-green-600 font-medium text-sm cursor-default"
                          >
                            Completed
                          </button>
                        )}
                        {query.status === 'rejected' && (
                          <span className="text-red-600 font-medium text-sm">Rejected</span>
                        )}
                        {query.assignedTo && (
                          <p className="text-sm text-gray-600">Assigned to: {query.assignedTo}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Master Data Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-primary">All Users Data</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-left py-3 px-4">GST</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Admin Users */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">ADM001</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">Admin User</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">admin@staplewise.com</td>
                    <td className="py-3 px-4">+919876543210</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    </td>
                    <td className="py-3 px-4">StapleWise</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Sales Users */}
                  {employees.map((employee, index) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">SAL{String(index + 1).padStart(3, '0')}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{employee.email}</td>
                      <td className="py-3 px-4">{employee.phone}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Sales
                        </span>
                      </td>
                      <td className="py-3 px-4">StapleWise</td>
                      <td className="py-3 px-4">-</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Sample Buyers */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">BUY001</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">John Buyer</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">buyer@example.com</td>
                    <td className="py-3 px-4">+919876543212</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Buyer
                      </span>
                    </td>
                    <td className="py-3 px-4">ABC Foods</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">BUY002</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">Rajesh Kumar</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">rajesh@foodcorp.com</td>
                    <td className="py-3 px-4">+919876543220</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Buyer
                      </span>
                    </td>
                    <td className="py-3 px-4">Food Corp Ltd</td>
                    <td className="py-3 px-4">GST987654321</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Sample Sellers */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">SEL001</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">Jane Seller</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">seller@example.com</td>
                    <td className="py-3 px-4">+919876543213</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Seller
                      </span>
                    </td>
                    <td className="py-3 px-4">XYZ Cashews</td>
                    <td className="py-3 px-4">GST123456789</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">SEL002</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">Arjun Nair</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">arjun@premiumcashews.com</td>
                    <td className="py-3 px-4">+919876543221</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Seller
                      </span>
                    </td>
                    <td className="py-3 px-4">Premium Cashews Ltd</td>
                    <td className="py-3 px-4">GST456789123</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">SEL003</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">Priya Sharma</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">priya@goldenkernel.com</td>
                    <td className="py-3 px-4">+919876543222</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Seller
                      </span>
                    </td>
                    <td className="py-3 px-4">Golden Kernel Exports</td>
                    <td className="py-3 px-4">GST789123456</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">SEL004</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">Kavitha Reddy</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">kavitha@coastalcashew.com</td>
                    <td className="py-3 px-4">+919876543223</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Seller
                      </span>
                    </td>
                    <td className="py-3 px-4">Coastal Cashew Co</td>
                    <td className="py-3 px-4">GST321654987</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Total Admins</p>
                <p className="text-2xl font-bold text-purple-800">1</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Sales Staff</p>
                <p className="text-2xl font-bold text-blue-800">{employees.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Buyers</p>
                <p className="text-2xl font-bold text-green-800">2</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Total Sellers</p>
                <p className="text-2xl font-bold text-orange-800">4</p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-primary mb-6">Reports & Export</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Query Reports</h4>
                <p className="text-gray-600 text-sm mb-4">Export all product queries with detailed information</p>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">User Directory</h4>
                <p className="text-gray-600 text-sm mb-4">Export user information and contact details</p>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary font-playfair">Query Details</h2>
                <button
                  onClick={() => setSelectedQuery(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Query ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <span className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      selectedQuery.type === 'buy' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedQuery.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.pincode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.quantity} tonnes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.productId}</p>
                  </div>
                  {selectedQuery.gst && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GST Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedQuery.gst}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      selectedQuery.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedQuery.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedQuery.status}
                    </span>
                  </div>
                  {selectedQuery.assignedTo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedQuery.assignedTo}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={() => handleDeleteQuery(selectedQuery.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Query
                </button>
                <button
                  onClick={() => setSelectedQuery(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary font-playfair">Employee Details</h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedEmployee.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEmployee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Joined</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.joinedDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned Queries</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.assignedQueries}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Employee
                </button>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;