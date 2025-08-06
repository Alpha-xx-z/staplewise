import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Search, X, Trash2 } from 'lucide-react';
import { mockQueries } from '../../data/mockData';

const SalesDashboard: React.FC = () => {
  const [queries, setQueries] = useState(mockQueries.filter(q => q.assignedTo === 'sales@staplewise.com'));
  const [selectedQuery, setSelectedQuery] = useState<any>(null);

  const stats = [
    { label: 'Total Assigned', value: queries.length, icon: Clock, color: 'text-blue-600' },
    { label: 'Completed', value: queries.filter(q => q.status === 'completed').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Rejected', value: queries.filter(q => q.status === 'rejected').length, icon: XCircle, color: 'text-red-600' }
  ];

  const handleUpdateStatus = (queryId: string, status: 'completed' | 'rejected') => {
    setQueries(prev => prev.map(query => 
      query.id === queryId ? { ...query, status } : query
    ));
  };

  const handleDeleteQuery = (queryId: string) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      setQueries(prev => prev.filter(query => query.id !== queryId));
      setSelectedQuery(null);
      alert('Query deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-playfair text-primary">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your assigned product queries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Queries Table */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">Assigned Queries</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search queries..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Company</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Contact</th>
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
                        <p className="text-sm text-gray-600">{query.pincode}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        query.type === 'buy' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {query.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{query.quantity} kg</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm">{query.email}</p>
                        <p className="text-sm text-gray-600">{query.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        query.status === 'completed' ? 'bg-green-100 text-green-800' :
                        query.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {query.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {query.status === 'completed' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Query already completed');
                            }}
                            className="text-green-600 font-medium text-sm cursor-default"
                          >
                            Completed
                          </button>
                        </div>
                      )}
                      {query.status === 'rejected' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('Query already rejected');
                            }}
                            className="text-red-600 font-medium text-sm cursor-default"
                          >
                            Rejected
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
    </div>
  );
};

export default SalesDashboard;