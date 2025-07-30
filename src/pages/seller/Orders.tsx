import React, { useState } from 'react';
import { Package, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Order } from '../../types';

const Orders: React.FC = () => {
  // Mock orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderName: 'W320 Cashew Kernels - Premium Grade',
      quantity: 25,
      price: 2125,
      status: 'Delivered'
    },
    {
      id: '2',
      orderName: 'LWP Cashew Kernels - Large White Pieces',
      quantity: 50,
      price: 3750,
      status: 'In Transit'
    },
    {
      id: '3',
      orderName: 'W180 Cashew Kernels - Super Premium',
      quantity: 10,
      price: 950,
      status: 'Delivered'
    }
  ]);

  // Listen for new orders from admin (in a real app, this would be via API/WebSocket)
  React.useEffect(() => {
    const handleStorageChange = () => {
      const adminOrders = localStorage.getItem('adminOrders');
      if (adminOrders) {
        const parsedOrders = JSON.parse(adminOrders);
        setOrders(prev => [...prev, ...parsedOrders.filter((newOrder: any) => 
          !prev.some(existingOrder => existingOrder.id === newOrder.id)
        )]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const completedOrders = orders.filter(order => order.status === 'Delivered');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.price, 0);
  const totalQuantity = completedOrders.reduce((sum, order) => sum + order.quantity, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-playfair text-primary">Orders</h1>
        <p className="text-gray-600 mt-2">View your completed orders and track performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Package className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuantity} tonnes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold font-playfair text-primary">Order History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderName}</p>
                      <p className="text-sm text-gray-500">Order #{order.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{order.quantity} tonnes</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">₹{order.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">₹{(order.price / order.quantity).toLocaleString()} per tonne</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No orders yet</p>
            <p className="text-gray-400">Your completed orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;