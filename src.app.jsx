import React, { useState, useEffect } from 'react';
import { Package, Store, User, MapPin, Phone, Clock, CheckCircle, List, DollarSign } from 'lucide-react';

const App = () => {
  const [userType, setUserType] = useState('');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, revenue: 0 });

  // Load data from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);
      calculateStats(parsedOrders);
    }
  }, []);

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
    calculateStats(newOrders);
  };

  const calculateStats = (ordersList) => {
    const total = ordersList.length;
    const completed = ordersList.filter(o => o.status === 'delivered').length;
    const pending = ordersList.filter(o => o.status === 'pending').length;
    const revenue = ordersList
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.deliveryFee || 1200), 0);
    
    setStats({ total, completed, pending, revenue });
  };

  // Restaurant Panel
  const RestaurantPanel = () => {
    const [formData, setFormData] = useState({
      restaurantName: '',
      customerName: '',
      customerPhone: '',
      address: '',
      orderAmount: '',
      notes: ''
    });

    const handleSubmit = () => {
      if (!formData.restaurantName || !formData.customerName || !formData.customerPhone || 
          !formData.address || !formData.orderAmount) {
        alert('تکایە هەموو خانەکان پڕبکەرەوە');
        return;
      }

      const newOrder = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toLocaleString('en-US'),
        deliveryFee: 1200,
        commission: Math.round(parseFloat(formData.orderAmount) * 0.15)
      };
      
      saveOrders([...orders, newOrder]);
      setFormData({
        restaurantName: '',
        customerName: '',
        customerPhone: '',
        address: '',
        orderAmount: '',
        notes: ''
      });
      alert('ئۆردەر بە سەرکەوتوویی زیادکرا!');
    };

    const myOrders = orders.filter(o => o.restaurantName === formData.restaurantName);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-8 h-8 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-800">پانێڵی ڕەستوران</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-right mb-2 font-semibold">ناوی ڕەستوران</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg text-right"
                value={formData.restaurantName}
                onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                placeholder="بۆ نموونە: ڕەستورانی کورد"
              />
            </div>
            
            <div>
              <label className="block text-right mb-2 font-semibold">ناوی کڕیار</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg text-right"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-right mb-2 font-semibold">ژمارەی تەلەفۆن</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg text-right"
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                placeholder="07XX XXX XXXX"
              />
            </div>
            
            <div>
              <label className="block text-right mb-2 font-semibold">ناونیشان</label>
              <textarea
                className="w-full p-3 border rounded-lg text-right"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows="2"
              />
            </div>
            
            <div>
              <label className="block text-right mb-2 font-semibold">بڕی ئۆردەر (دینار)</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg text-right"
                value={formData.orderAmount}
                onChange={(e) => setFormData({...formData, orderAmount: e.target.value})}
                placeholder="10000"
              />
            </div>
            
            <div>
              <label className="block text-right mb-2 font-semibold">تێبینی</label>
              <textarea
                className="w-full p-3 border rounded-lg text-right"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="2"
                placeholder="هەر تێبینییەک..."
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
            >
              زیادکردنی ئۆردەر
            </button>
          </div>
          
          {myOrders.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-right">ئۆردەرەکانی من</h3>
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'picked' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'delivered' ? 'گەیشتووە' :
                         order.status === 'picked' ? 'لە ڕێگا' : 'چاوەڕوان'}
                      </span>
                      <div className="text-right">
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                    </div>
                    <p className="text-right mt-2 text-sm">{order.address}</p>
                    <p className="text-right mt-1 font-semibold">{order.orderAmount} دینار</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Driver Panel
  const DriverPanel = () => {
    const updateOrderStatus = (orderId, newStatus) => {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      saveOrders(updatedOrders);
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const pickedOrders = orders.filter(o => o.status === 'picked');

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">پانێڵی شۆفێر</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-right text-yellow-600">ئۆردەرە نوێیەکان</h3>
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <div key={order.id} className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-50">
                  <div className="text-right mb-3">
                    <p className="font-bold text-lg">{order.customerName}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                        {order.customerPhone}
                      </a>
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{order.restaurantName}</p>
                  </div>
                  
                  <div className="flex items-start gap-2 justify-end mb-3">
                    <p className="text-right">{order.address}</p>
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                  
                  {order.notes && (
                    <p className="text-right text-sm bg-white p-2 rounded mb-3">
                      <strong>تێبینی:</strong> {order.notes}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'picked')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      وەرگرتن
                    </button>
                    <div className="text-right">
                      <p className="font-bold text-lg">{order.orderAmount} دینار</p>
                      <p className="text-sm text-green-600">کرێ: {order.deliveryFee} دینار</p>
                    </div>
                  </div>
                </div>
              ))}
              {pendingOrders.length === 0 && (
                <p className="text-center text-gray-500 py-8">هیچ ئۆردەرێکی نوێ نییە</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-right text-blue-600">ئۆردەرە هەڵگیراوەکانم</h3>
            <div className="space-y-4">
              {pickedOrders.map(order => (
                <div key={order.id} className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50">
                  <div className="text-right mb-3">
                    <p className="font-bold text-lg">{order.customerName}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                        {order.customerPhone}
                      </a>
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 justify-end mb-3">
                    <p className="text-right">{order.address}</p>
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      تەواو کرا ✓
                    </button>
                    <p className="text-green-600 font-bold">+{order.deliveryFee} دینار</p>
                  </div>
                </div>
              ))}
              {pickedOrders.length === 0 && (
                <p className="text-center text-gray-500 py-8">هیچ ئۆردەرێکت هەڵنەگرتووە</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Admin Panel
  const AdminPanel = () => {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">پانێڵی ئەدمین</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <List className="w-8 h-8 text-blue-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-gray-600">کۆی گشتی</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-gray-600">چاوەڕوان</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-sm text-gray-600">تەواو بوو</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{stats.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">داهات (دینار)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-right">هەموو ئۆردەرەکان</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-right">دۆخ</th>
                    <th className="border p-3 text-right">کۆمیشن</th>
                    <th className="border p-3 text-right">کرێی گەیاندن</th>
                    <th className="border p-3 text-right">بڕی ئۆردەر</th>
                    <th className="border p-3 text-right">ناونیشان</th>
                    <th className="border p-3 text-right">تەلەفۆن</th>
                    <th className="border p-3 text-right">کڕیار</th>
                    <th className="border p-3 text-right">ڕەستوران</th>
                    <th className="border p-3 text-right">#</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="border p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'picked' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'delivered' ? 'گەیشتووە' :
                           order.status === 'picked' ? 'لە ڕێگا' : 'چاوەڕوان'}
                        </span>
                      </td>
                      <td className="border p-3 text-right">{order.commission}</td>
                      <td className="border p-3 text-right">{order.deliveryFee}</td>
                      <td className="border p-3 text-right font-semibold">{order.orderAmount}</td>
                      <td className="border p-3 text-right text-sm">{order.address}</td>
                      <td className="border p-3 text-right">{order.customerPhone}</td>
                      <td className="border p-3 text-right">{order.customerName}</td>
                      <td className="border p-3 text-right">{order.restaurantName}</td>
                      <td className="border p-3 text-center">{idx + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="text-center text-gray-500 py-8">هێشتا هیچ ئۆردەرێک نییە</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">سیستەمی گەیاندن</h1>
          <div className="space-y-4">
            <button
              onClick={() => setUserType('restaurant')}
              className="w-full bg-orange-600 text-white p-4 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-3"
            >
              <Store className="w-6 h-6" />
              <span>چوونە ژوورەوە وەک ڕەستوران</span>
            </button>
            
            <button
              onClick={() => setUserType('driver')}
              className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-3"
            >
              <Package className="w-6 h-6" />
              <span>چوونە ژوورەوە وەک شۆفێر</span>
            </button>
            
            <button
              onClick={() => setUserType('admin')}
              className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center gap-3"
            >
              <User className="w-6 h-6" />
              <span>چوونە ژوورەوە وەک ئەدمین</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setUserType('')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            گەڕانەوە
          </button>
          <h1 className="text-2xl font-bold">
            {userType === 'restaurant' ? 'پانێڵی ڕەستوران' :
             userType === 'driver' ? 'پانێڵی شۆفێر' : 'پانێڵی ئەدمین'}
          </h1>
        </div>
      </div>
      
      {userType === 'restaurant' && <RestaurantPanel />}
      {userType === 'driver' && <DriverPanel />}
      {userType === 'admin' && <AdminPanel />}
    </div>
  );
};

export default App;