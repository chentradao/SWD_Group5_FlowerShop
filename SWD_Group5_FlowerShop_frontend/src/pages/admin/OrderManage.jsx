import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đã gửi' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'canceled', label: 'Đã hủy' },
];

const OrderManage = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders();
      setOrderList(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleOpenModal = (order) => {
    setEditingOrder(order);
    setNewStatus(order?.status || 'pending');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrder(null);
    setNewStatus('pending');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await orderService.updateOrder(editingOrder.id, { status: newStatus });
      await fetchOrders();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Huỷ đơn hàng
  const handleCancelOrder = async (order) => {
    if (!order || ['delivered','canceled','Đã giao','Đã hủy'].includes((order.status||'').toLowerCase())) return;
    if (window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) {
      try {
        await orderService.updateOrder(order.id, { status: 'canceled' });
        fetchOrders();
      } catch (error) {
        console.error('Error canceling order:', error);
      }
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value || 'N/A';
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const displayCustomerName = (order) => {
    return (
      order?.customerName ||
      order?.userName ||
      order?.user?.name ||
      'N/A'
    );
  };

  const displayCreatedAt = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString('vi-VN');
    } catch {
      return String(date);
    }
  };

  const renderStatusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Chờ xử lý</span>;
      case 'confirmed':
        return <span className={`${base} bg-blue-100 text-blue-800`}>Đã xác nhận</span>;
      case 'shipping':
        return <span className={`${base} bg-indigo-100 text-indigo-800`}>Đang giao</span>;
      case 'delivered':
        return <span className={`${base} bg-green-100 text-green-800`}>Đã giao</span>;
      case 'canceled':
        return <span className={`${base} bg-red-100 text-red-800`}>Đã hủy</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status || 'Không rõ'}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h2>
            <p className="text-gray-500 text-sm mt-1">Danh sách tất cả đơn hàng trong hệ thống</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                      <span className="ml-2 text-gray-500">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : orderList && orderList.length > 0 ? (
                orderList.map((order, idx) => {
                  const isDisabled = ['delivered','canceled','Đã giao','Đã hủy'].includes((order.status||'').toLowerCase());
                  return (
                    <tr key={order.id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.code || order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{displayCustomerName(order)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.totalAmount || order.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{renderStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{displayCreatedAt(order.createdAt || order.created_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className={`text-violet-600 hover:text-violet-900 mr-4 transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleOpenModal(order)}
                          disabled={isDisabled}
                        >
                          Xác nhận đơn
                        </button>
                        <button
                          className={`text-red-600 hover:text-red-900 transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleCancelOrder(order)}
                          disabled={isDisabled}
                        >
                          Huỷ đơn
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đơn hàng</h3>
                      <p className="mt-1 text-sm text-gray-500">Hiện chưa có dữ liệu đơn hàng.</p>
                    </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingOrder) return;
              try {
                await orderService.updateOrder(editingOrder.id, { status: 'delivered' });
                await fetchOrders();
                handleCloseModal();
              } catch (error) {
                console.error('Error updating order status:', error);
              }
            }} className="space-y-4">
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
                  disabled={['delivered','canceled','Đã giao','Đã hủy'].includes((editingOrder?.status||'').toLowerCase())}
                >
                  Xác nhận đơn
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
    </div >
  );
};

export default OrderManage;
