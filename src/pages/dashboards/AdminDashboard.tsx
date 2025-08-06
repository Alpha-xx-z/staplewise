import React, { useState, useEffect, useMemo } from 'react';
import { Users, Package, MessageSquare, TrendingUp, Plus, Search, Filter, Download, Eye, Trash2, X } from 'lucide-react';
import { mockQueries, cashewGrades } from '../../data/mockData';
import { AdminService } from '../../lib/api';
import { ApiClient } from '../../lib/apiClient';
import * as XLSX from 'xlsx';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [queries, setQueries] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalVisitors: 0,
    totalProducts: 0,
    totalQueries: 0,
    totalUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    queries: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'Sales Employee',
      email: 'sales@staplewise.com',
      phone: '+91 98765 43210',
      companyName: '',
      role: 'sales',
      status: 'Active',
      joinedDate: '2024-01-15',
      assignedQueries: 5
    }
  ]);
  const [orderForm, setOrderForm] = useState({
    sellerId: '',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    productName: '',
    category: '',
    grade: '',
    quantity: '',
    pricePerKg: '',
    deliveryAddress: '',
    notes: ''
  });

  // Comprehensive grade options (same as seller dashboard)
  const categoryGrades = {
    CASHEWS: ['W180', 'W210', 'W240', 'W320', 'W400', 'A180', 'A210', 'A240', 'A320', 'A400', 'JK0', 'K00', 'LWP', 'S00 (JH)', 'SK0', 'SSW(WW320)', 'SSW1(W300)', 'SWP', 'BB0', 'BB1', 'BB2', 'DP0', 'DP1', 'DP2'],
    CLOVES: ['Whole Cloves', 'Ground Cloves', 'Clove Buds', 'Premium Grade', 'Standard Grade', 'Commercial Grade'],
    CHILLIES: ['Kashmiri Red', 'Guntur Red', 'Byadgi Red', 'Teja Red', 'Green Chilli', 'Dried Red', 'Powder Grade', 'Whole Dried'],
    STAR_ANISE: ['Whole Star', 'Broken Star', 'Ground Star', 'Premium Grade', 'Standard Grade', 'Commercial Grade'],
    PEPPER: ['Black Pepper Whole', 'White Pepper Whole', 'Black Pepper Powder', 'White Pepper Powder', 'Green Pepper', 'Pink Pepper'],
    CINNAMON: ['Ceylon Cinnamon', 'Cassia Cinnamon', 'Cinnamon Sticks', 'Cinnamon Powder', 'Broken Cinnamon', 'Quillings'],
    OTHER_SPICES: ['Cardamom', 'Nutmeg', 'Mace', 'Turmeric', 'Ginger', 'Cumin', 'Coriander', 'Fennel']
  };

  // Mock sellers data (fallback)
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
    phone: '',
    companyName: ''
  });

  // Order management states
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderSortBy, setOrderSortBy] = useState('createdAt');
  const [orderSortOrder, setOrderSortOrder] = useState('desc');

  // Query management states
  const [querySearchTerm, setQuerySearchTerm] = useState('');
  const [queryStatusFilter, setQueryStatusFilter] = useState('');
  const [queryTypeFilter, setQueryTypeFilter] = useState('');
  const [queryAssignedFilter, setQueryAssignedFilter] = useState('');
  const [showQueryFilters, setShowQueryFilters] = useState(false);

  // Filtered queries based on search and filters
  const filteredQueries = useMemo(() => {
    return queries.filter(query => {
      // Search filter
      const searchMatch = !querySearchTerm || 
        query.companyName?.toLowerCase().includes(querySearchTerm.toLowerCase()) ||
        query.email?.toLowerCase().includes(querySearchTerm.toLowerCase()) ||
        query.contactName?.toLowerCase().includes(querySearchTerm.toLowerCase());

      // Status filter
      const statusMatch = !queryStatusFilter || query.status === queryStatusFilter;

      // Type filter
      const typeMatch = !queryTypeFilter || query.type === queryTypeFilter;

      // Assigned filter
      const assignedMatch = !queryAssignedFilter || 
        (queryAssignedFilter === 'unassigned' && !query.assignedToId) ||
        (queryAssignedFilter !== 'unassigned' && query.assignedToId === queryAssignedFilter);

      return searchMatch && statusMatch && typeMatch && assignedMatch;
    });
  }, [queries, querySearchTerm, queryStatusFilter, queryTypeFilter, queryAssignedFilter]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, queriesData, ordersData, usersData, sellersData] = await Promise.all([
          AdminService.getDashboardStats(),
          AdminService.getQueries(),
          AdminService.getOrders(),
          AdminService.getUsers(),
          AdminService.getSellers()
        ]);

        setDashboardStats(statsData.stats);
        setRecentActivity(statsData.recentActivity);
        setQueries(queriesData);
        setOrders(ordersData);
        setUsers(usersData);
        setSellers(sellersData);
        
        // Filter sales employees from users data
        const salesEmployees = usersData.filter((user: any) => user.role === 'SALES').map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          companyName: user.companyName || '',
          role: user.role,
          status: 'Active',
          joinedDate: new Date(user.createdAt).toISOString().split('T')[0],
          assignedQueries: 0
        }));
        setEmployees(salesEmployees);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data if API fails
        setDashboardStats({
          totalVisitors: 12345,
          totalProducts: 25,
          totalQueries: 89,
          totalUsers: 456
        });
        setQueries(mockQueries);
        setSellers(mockSellers); // Fallback for sellers
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Total Visitors', value: dashboardStats.totalVisitors.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: 'Products Listed', value: dashboardStats.totalProducts.toString(), icon: Package, color: 'text-green-600' },
    { label: 'Product Queries', value: dashboardStats.totalQueries.toString(), icon: MessageSquare, color: 'text-orange-600' },
    { label: 'Total Users', value: dashboardStats.totalUsers.toString(), icon: Users, color: 'text-purple-600' }
  ];

  const handleAssignQuery = async (queryId: string, assignedToId: string) => {
    try {
      const response = await AdminService.assignQuery(queryId, assignedToId);
      
      // Update the query in the local state
    setQueries(prev => prev.map(query => 
      query.id === queryId 
          ? { 
              ...query, 
              status: response.query.status, 
              assignedToId: response.query.assignedToId,
              assignedTo: employees.find(emp => emp.id === assignedToId)?.name || 'Unknown'
            }
        : query
    ));
      
      alert('Query assigned successfully!');
    } catch (error) {
      console.error('Error assigning query:', error);
      alert(error instanceof Error ? error.message : 'Failed to assign query');
    }
  };

  const handleDeleteQuery = async (queryId: string) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await AdminService.deleteQuery(queryId);
      setQueries(prev => prev.filter(query => query.id !== queryId));
      setSelectedQuery(null);
      alert('Query deleted successfully!');
      } catch (error) {
        console.error('Error deleting query:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete query');
      }
    }
  };

  const handleUpdateQueryStatus = async (queryId: string, newStatus: string) => {
    try {
      const response = await AdminService.updateQueryStatus(queryId, newStatus);
      
      // Update the query in the local state
      setQueries(prev => prev.map(query => 
        query.id === queryId 
          ? { ...query, status: response.query.status }
          : query
      ));
      
      alert('Query status updated successfully!');
    } catch (error) {
      console.error('Error updating query status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update query status');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await AdminService.deleteUser(employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      setSelectedEmployee(null);
      alert('Employee deleted successfully!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete employee');
      }
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await AdminService.createSalesEmployee(employeeForm);
      
      // Add the new employee to the list
    const newEmployee = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        companyName: response.user.companyName || '',
        role: response.user.role,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedQueries: 0
    };
      
    setEmployees(prev => [...prev, newEmployee]);
    alert('Sales employee added successfully!');
      setEmployeeForm({ name: '', email: '', password: '', phone: '', companyName: '' });
    setShowAddEmployee(false);
    } catch (error) {
      console.error('Error adding sales employee:', error);
      alert(error instanceof Error ? error.message : 'Failed to add sales employee');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOrder) {
        // Update existing order
        const orderData = {
          productName: orderForm.productName,
          category: orderForm.category,
          grade: orderForm.grade,
      quantity: parseInt(orderForm.quantity),
          pricePerKg: parseFloat(orderForm.pricePerKg),
          deliveryAddress: orderForm.deliveryAddress,
          notes: orderForm.notes,
          status: editingOrder.status
        };
        
        const updatedOrder = await ApiClient.updateOrder(editingOrder.id, orderData);
        
        setOrders(prev => prev.map(order => 
          order.id === editingOrder.id ? updatedOrder : order
        ));
        
        alert('Order updated successfully!');
        setEditingOrder(null);
      } else {
        // Create new order
        const orderData = {
      sellerId: orderForm.sellerId,
      sellerName: orderForm.sellerName,
          sellerEmail: orderForm.sellerEmail,
          sellerPhone: orderForm.sellerPhone,
          productName: orderForm.productName,
          category: orderForm.category,
          grade: orderForm.grade,
          quantity: parseInt(orderForm.quantity),
          pricePerKg: parseFloat(orderForm.pricePerKg),
      deliveryAddress: orderForm.deliveryAddress,
      notes: orderForm.notes,
          buyerId: JSON.parse(localStorage.getItem('stapleWiseUser') || '{}').id
    };
    
        const newOrder = await AdminService.createOrder(orderData);
    
        setOrders(prev => [...prev, newOrder]);
    alert('Order placed successfully!');
      }
      
      // Reset form
    setOrderForm({
      sellerId: '',
      sellerName: '',
        sellerEmail: '',
        sellerPhone: '',
      productName: '',
        category: '',
      grade: '',
      quantity: '',
      pricePerKg: '',
      deliveryAddress: '',
      notes: ''
    });
    setShowOrderForm(false);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    
    // Extract product name and grade from orderName
    const orderNameParts = order.orderName?.split(' - ') || [];
    const productName = orderNameParts[0] || '';
    const grade = orderNameParts[1] || '';
    
    setOrderForm({
      sellerId: order.sellerId || '',
      sellerName: order.sellerName || '',
      sellerEmail: order.sellerEmail || '',
      sellerPhone: order.sellerPhone || '',
      productName: productName,
      category: order.category || '',
      grade: grade,
      quantity: order.quantity?.toString() || order.totalQuantity?.toString() || '',
      pricePerKg: order.pricePerKg?.toString() || '',
      deliveryAddress: order.deliveryAddress || '',
      notes: order.notes || ''
    });
    setShowOrderForm(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ApiClient.deleteOrder(orderId);
        setOrders(prev => prev.filter(order => order.id !== orderId));
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Order deletion error:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const orderData = {
        productName: order.items?.[0]?.product?.name || '',
        category: order.items?.[0]?.product?.category || '',
        grade: order.items?.[0]?.product?.grade || '',
        quantity: order.totalQuantity,
        pricePerKg: order.items?.[0]?.pricePerKg || 0,
        deliveryAddress: order.shippingAddress || '',
        notes: order.notes || '',
        status: newStatus
      };

      const updatedOrder = await ApiClient.updateOrder(orderId, orderData);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Order status update error:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleViewOrderDetails = async (order: any) => {
    try {
      // Use the order data that's already available in the admin dashboard
      // This includes seller information from the admin orders endpoint
      setSelectedOrder(order);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details. Please try again.');
    }
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = order.orderName?.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                           order.sellerName?.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                           order.orderNumber?.toLowerCase().includes(orderSearchTerm.toLowerCase());
      const matchesStatus = !orderStatusFilter || order.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[orderSortBy as keyof typeof a];
      let bValue = b[orderSortBy as keyof typeof b];
      
      if (orderSortBy === 'createdAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (orderSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-fill seller name when seller is selected
    if (name === 'sellerId') {
      const selectedSeller = sellers.find(seller => seller.id === value);
      if (selectedSeller) {
        setOrderForm(prev => ({
          ...prev,
          sellerName: selectedSeller.name,
          sellerEmail: selectedSeller.email,
          sellerPhone: selectedSeller.phone
        }));
      }
    }
    
    // Reset grade when category changes
    if (name === 'category') {
      setOrderForm(prev => ({
        ...prev,
        grade: ''
      }));
    }
  };

  // Excel Export Functions
  const exportToExcel = (data: any[], filename: string, sheetName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleExportQueries = () => {
    const exportData = queries.map(query => ({
      'Query ID': query.id,
      'Type': query.type,
      'Company Name': query.companyName,
      'Contact Name': query.contactName || '-',
      'Email': query.email,
      'Phone': query.phone,
      'Pincode': query.pincode,
              'Quantity (kg)': query.quantity,
      'Product ID': query.productId,
      'GST Number': query.gst || '-',
      'Status': query.status,
      'Assigned To': query.assignedToId ? employees.find(emp => emp.id === query.assignedToId)?.name || 'Unknown' : 'Not Assigned',
      'Created Date': new Date(query.createdAt).toLocaleDateString(),
      'Notes': query.notes || '-'
    }));
    exportToExcel(exportData, 'Product_Queries_Report', 'Queries');
  };

  const handleExportUsers = () => {
    const exportData = users.map(user => ({
      'User ID': user.id,
      'Name': user.name,
      'Email': user.email,
      'Phone': user.phone,
      'Role': user.role,
      'Company Name': user.companyName || '-',
      'GST Number': user.gstin || '-',
      'Status': user.isActive ? 'Active' : 'Inactive',
      'Created Date': new Date(user.createdAt).toLocaleDateString(),
      'Last Login': user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '-'
    }));
    exportToExcel(exportData, 'Users_Directory_Report', 'Users');
  };

  const handleExportOrders = () => {
    const exportData = orders.map(order => ({
      'Order ID': order.id,
      'Order Number': order.orderNumber || order.id,
      'Product Name': order.orderName || order.productName || '-',
      'Category': order.category || '-',
      'Grade': order.grade || '-',
              'Quantity (kg)': order.quantity || order.totalQuantity || 0,
      'Price per KG (₹)': order.pricePerKg || 0,
      'Total Amount (₹)': order.totalAmount || 0,
      'Seller': order.sellerName || '-',
      'Seller Email': order.sellerEmail || '-',
      'Seller Phone': order.sellerPhone || '-',
      'Delivery Address': order.deliveryAddress || '-',
      'Status': order.status,
      'Notes': order.notes || '-',
      'Created Date': new Date(order.createdAt).toLocaleDateString()
    }));
    exportToExcel(exportData, 'Orders_Report', 'Orders');
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading recent activity...</p>
                </div>
              ) : (
              <div className="space-y-4">
                  {/* Recent Queries */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Recent Queries</h4>
                    {recentActivity.queries.length > 0 ? (
                      recentActivity.queries.slice(0, 3).map((query: any) => (
                  <div key={query.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">{query.companyName}</p>
                            <p className="text-sm text-gray-600">
                              {query.type} query - {query.quantity} kg
                              {query.product && ` - ${query.product.name} (${query.product.grade})`}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(query.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            query.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            query.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            query.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                    }`}>
                      {query.status}
                    </span>
                  </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent queries</p>
                    )}
              </div>

                  {/* Recent Orders */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Recent Orders</h4>
                    {recentActivity.orders.length > 0 ? (
                      recentActivity.orders.slice(0, 3).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">
                              ₹{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}
                              {order.items && order.items.length > 0 && (
                                <span> - {order.items[0].product?.name}</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent orders</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Place Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Place Order Form */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-primary">
                  {editingOrder ? 'Edit Order' : 'Place New Order'}
                </h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          disabled={loading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        >
                          <option value="">
                            {loading ? 'Loading sellers...' : 'Choose Seller...'}
                          </option>
                          {sellers.map(seller => (
                            <option key={seller.id} value={seller.id}>
                              {seller.companyName || seller.name} - {seller.city || 'Location not specified'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Seller Information (Auto-filled) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Name {orderForm.sellerName && <span className="text-green-600">✓</span>}
                        </label>
                        <input
                          type="text"
                          value={orderForm.sellerName}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Select seller above to auto-fill"
                        />
                      </div>

                      {/* Seller Email (Auto-filled) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Email {orderForm.sellerEmail && <span className="text-green-600">✓</span>}
                        </label>
                        <input
                          type="email"
                          value={orderForm.sellerEmail}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Select seller above to auto-fill"
                        />
                      </div>

                      {/* Seller Phone (Auto-filled) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Phone {orderForm.sellerPhone && <span className="text-green-600">✓</span>}
                        </label>
                        <input
                          type="tel"
                          value={orderForm.sellerPhone}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Select seller above to auto-fill"
                        />
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

                                              {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={orderForm.category}
                            onChange={handleOrderInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select Category</option>
                            <option value="CASHEWS">Cashews</option>
                            <option value="CLOVES">Cloves</option>
                            <option value="CHILLIES">Chillies</option>
                            <option value="STAR_ANISE">Star Anise</option>
                            <option value="PEPPER">Pepper</option>
                            <option value="CINNAMON">Cinnamon</option>
                            <option value="OTHER_SPICES">Other Spices</option>
                          </select>
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
                            disabled={!orderForm.category}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                          >
                            <option value="">
                              {!orderForm.category ? 'Select category first' : 'Select Grade'}
                            </option>
                            {orderForm.category && categoryGrades[orderForm.category as keyof typeof categoryGrades]?.map((grade: string) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity (kg) *
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
                        {editingOrder ? 'Update Order' : 'Place Order'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOrderForm(false);
                          setEditingOrder(null);
                          setOrderForm({
                            sellerId: '',
                            sellerName: '',
                            sellerEmail: '',
                            sellerPhone: '',
                            productName: '',
                            category: '',
                            grade: '',
                            quantity: '',
                            pricePerKg: '',
                            deliveryAddress: '',
                            notes: ''
                          });
                        }}
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
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewOrderDetails(order)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary">Order #{order.orderNumber || order.id}</h4>
                          <p className="text-sm text-gray-600">
                            Product: {order.items?.[0]?.product?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {order.totalQuantity} kg
                          </p>
                          <p className="text-sm text-gray-600">
                            Price per KG: ₹{order.items?.[0]?.pricePerKg ? order.items[0].pricePerKg.toLocaleString() : '0'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: ₹{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleUpdateOrderStatus(order.id, e.target.value);
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                            >
                              <option value="PENDING">Order Placed</option>
                              <option value="PROCESSING">In Process</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOrder(order);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                              }}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Delete
                            </button>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No orders found</p>
              )}
              
              {/* View All Orders Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllOrders(true)}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Orders Modal */}
        {showAllOrders && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-primary">All Orders</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExportOrders}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center"
                      title="Export to Excel"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </button>
                    <button
                      onClick={() => setShowAllOrders(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search, Filter, and Sort Controls */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Order Placed</option>
                      <option value="PROCESSING">In Process</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={orderSortBy}
                      onChange={(e) => setOrderSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="orderName">Product Name</option>
                      <option value="sellerName">Seller</option>
                      <option value="quantity">Quantity</option>
                      <option value="price">Total Amount</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <select
                      value={orderSortOrder}
                      onChange={(e) => setOrderSortOrder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price & Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          #{order.orderNumber || order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.orderName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.sellerName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.quantity || order.totalQuantity} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>₹{order.pricePerKg ? order.pricePerKg.toLocaleString() : '0'}/kg</div>
                            <div className="text-xs text-gray-500">Total: ₹{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                          >
                            <option value="PENDING">Order Placed</option>
                            <option value="PROCESSING">In Process</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                              className="text-green-600 hover:text-green-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditOrder(order)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredAndSortedOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found matching your criteria.</p>
                  </div>
                )}
              </div>
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
                  <input
                    type="text"
                    placeholder="Company Name (Optional)"
                    value={employeeForm.companyName}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, companyName: e.target.value }))}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
                    <p className="text-sm text-gray-600">{employee.phone}</p>
                    {employee.companyName && (
                      <p className="text-xs text-gray-500">Company: {employee.companyName}</p>
                    )}
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
                    value={querySearchTerm}
                    onChange={(e) => setQuerySearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <button 
                  className="p-2 border rounded-lg hover:bg-gray-50"
                  onClick={() => setShowQueryFilters(!showQueryFilters)}
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 border rounded-lg hover:bg-gray-50"
                  onClick={handleExportQueries}
                  title="Export to Excel"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {showQueryFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={queryStatusFilter}
                      onChange={(e) => setQueryStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={queryTypeFilter}
                      onChange={(e) => setQueryTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Types</option>
                      <option value="BUY">Buy</option>
                      <option value="SELL">Sell</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <select
                      value={queryAssignedFilter}
                      onChange={(e) => setQueryAssignedFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">All Employees</option>
                      <option value="unassigned">Unassigned</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setQuerySearchTerm('');
                        setQueryStatusFilter('');
                        setQueryTypeFilter('');
                        setQueryAssignedFilter('');
                      }}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Quantity</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Assigned To</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading queries...</p>
                      </td>
                    </tr>
                  ) : filteredQueries.length > 0 ? (
                    filteredQueries.map(query => (
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
                            query.type === 'BUY' ? 'bg-blue-100 text-blue-800' : 
                            query.type === 'SELL' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                          {query.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{query.quantity} kg</td>
                      <td className="py-3 px-4">{query.pincode}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            query.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            query.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            query.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                          {query.assignedToId ? (
                            <span className="text-sm text-gray-700">
                              {employees.find(emp => emp.id === query.assignedToId)?.name || 'Unknown'}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500 italic">Not assigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col space-y-2">
                            {/* Assignment Dropdown */}
                            <select
                              value={query.assignedToId || ''}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (e.target.value) {
                                  handleAssignQuery(query.id, e.target.value);
                                }
                              }}
                              className="text-sm border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:border-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="">Assign to...</option>
                              {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                  {employee.name}
                                </option>
                              ))}
                            </select>
                            
                            {/* Status Dropdown */}
                            <select
                              value={query.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleUpdateQueryStatus(query.id, e.target.value);
                              }}
                              className="text-sm border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:border-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="ASSIGNED">Assigned</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="REJECTED">Rejected</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                            
                            {/* Delete Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                                handleDeleteQuery(query.id);
                            }}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete query"
                          >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                          </button>
                          </div>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No queries found
                      </td>
                    </tr>
                  )}
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
                <button 
                  className="p-2 border rounded-lg hover:bg-gray-50"
                  onClick={handleExportUsers}
                  title="Export to Excel"
                >
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
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading users...</p>
                    </td>
                  </tr>
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4">
                        <div>
                            <p className="font-medium">{user.name}</p>
                        </div>
                      </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'SALES' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'BUYER' ? 'bg-green-100 text-green-800' :
                            user.role === 'SELLER' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                        </span>
                      </td>
                        <td className="py-3 px-4">{user.companyName || '-'}</td>
                        <td className="py-3 px-4">{user.gstin || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No users found
                    </td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Total Admins</p>
                <p className="text-2xl font-bold text-purple-800">
                  {users.filter(user => user.role === 'ADMIN').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Sales Staff</p>
                <p className="text-2xl font-bold text-blue-800">
                  {users.filter(user => user.role === 'SALES').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Buyers</p>
                <p className="text-2xl font-bold text-green-800">
                  {users.filter(user => user.role === 'BUYER').length}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Total Sellers</p>
                <p className="text-2xl font-bold text-orange-800">
                  {users.filter(user => user.role === 'SELLER').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-primary mb-6">Reports & Export</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Query Reports</h4>
                <p className="text-gray-600 text-sm mb-4">Export all product queries with detailed information</p>
                <button 
                  onClick={handleExportQueries}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">User Directory</h4>
                <p className="text-gray-600 text-sm mb-4">Export user information and contact details</p>
                <button 
                  onClick={handleExportUsers}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Orders Report</h4>
                <p className="text-gray-600 text-sm mb-4">Export all orders with complete details</p>
                <button 
                  onClick={handleExportOrders}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center"
                >
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
                    <p className="mt-1 text-sm text-gray-900">{selectedQuery.quantity} kg</p>
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary font-playfair">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Number</label>
                      <p className="mt-1 text-lg font-semibold text-primary">#{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Order Date</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        selectedOrder.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Product Name</label>
                          <p className="mt-1 text-sm text-gray-900">{item.product?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <p className="mt-1 text-sm text-gray-900">{item.product?.category || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Grade</label>
                          <p className="mt-1 text-sm text-gray-900">{item.product?.grade || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Quantity</label>
                          <p className="mt-1 text-sm text-gray-900">{item.quantity} kg</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price per kg</label>
                          <p className="mt-1 text-sm text-gray-900">₹{item.pricePerKg?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Total Price</label>
                          <p className="mt-1 text-sm text-gray-900">₹{item.totalPrice?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.totalQuantity} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="mt-1 text-lg font-semibold text-primary">₹{selectedOrder.totalAmount?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <span className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                        selectedOrder.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Currency</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.currency || 'INR'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.shippingAddress || 'Not specified'}</p>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}
                </div>

                {/* Seller Information */}
                {selectedOrder.items?.[0]?.product?.seller && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seller Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.items[0].product.seller.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.items[0].product.seller.companyName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buyer Information */}
                {selectedOrder.buyer && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.buyer.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.buyer.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.buyer.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{selectedOrder.buyer.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end items-center mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowOrderDetails(false)}
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