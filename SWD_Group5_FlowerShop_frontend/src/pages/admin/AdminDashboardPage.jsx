import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import userService from '../../services/userService';
import orderService from '../../services/orderService';

const AdminDashboardPage = () => {
  // Demo data cho biểu đồ
  const monthlySalesData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8'],
    datasets: [
      {
        label: 'Doanh số',
        data: [120, 150, 180, 90, 200, 170, 220, 140],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const statisticData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [100, 130, 160, 80, 180, 150, 200, 120],
        fill: false,
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Lợi nhuận',
        data: [60, 90, 110, 50, 120, 100, 140, 80],
        fill: false,
        borderColor: 'rgba(34,197,94,1)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        tension: 0.4,
      },
      {
        label: 'Chi phí',
        data: [40, 40, 50, 30, 60, 50, 60, 40],
        fill: false,
        borderColor: 'rgba(239,68,68,1)',
        backgroundColor: 'rgba(239,68,68,0.2)',
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    let barChartInstance = null;
    let lineChartInstance = null;
    // Monthly Sales Bar Chart
    const barCtx = document.getElementById('monthly-sales-bar-chart');
    if (barCtx) {
      barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: monthlySalesData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
        },
      });
    }
    // Statistic Line Chart
    const lineCtx = document.getElementById('statistics-line-chart');
    if (lineCtx) {
      lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: statisticData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: false },
          },
        },
      });
    }
    // Cleanup chart instances if needed
    return () => {
      if (barChartInstance) barChartInstance.destroy();
      if (lineChartInstance) lineChartInstance.destroy();
    };
  }, []);
  // Lấy 5 đơn hàng mới nhất từ orderList

  const [customerList, setCustomerList] = useState([])
  const [orderList, setOrderList] = useState([])
  const recentOrders = orderList.slice(0, 5);

  const getCustomerList = async () => {
    const res = await userService.getUsers()
    setCustomerList(Array.isArray(res) ? res : []);
  }
  const getOrderList = async () => {
    const res = await orderService.getOrders()
    setOrderList(Array.isArray(res) ? res : []);
  }
  useEffect(() => {
    getCustomerList()
    getOrderList()
  }, [])
  return (
    <div>
      <div className="grid grid-cols-2 gap-5">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Customers & Orders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customers */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <div className="flex flex-col items-center justify-center flex-1 ">
                <div className="bg-violet-100 p-3 rounded-xl mb-2">
                  <svg className="w-8 h-8 text-violet-600 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5" /></svg>
                </div>
                <div className="text-gray-500 text-base font-medium mb-1">Customers</div>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{customerList.length}</div>
                <div className="text-green-600 text-sm font-semibold flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  11.01%
                </div>
              </div>
            </div>
            {/* Orders */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="bg-violet-100 p-3 rounded-xl mb-2">
                  <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" /></svg>
                </div>
                <div className="text-gray-500 text-base font-medium mb-1">Orders</div>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{orderList.length}</div>
                <div className="text-green-600 text-sm font-semibold flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  9.05%
                </div>
              </div>
            </div>
          </div>
          {/* Monthly Sales Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="mb-3 font-bold text-lg text-gray-900">Monthly Sales</div>
            <div className="w-full">
              <canvas id="monthly-sales-bar-chart" className="w-full h-full"></canvas>
            </div>
          </div>
        </div>
        {/* RIGHT COLUMN: Recent Orders */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col min-h-[220px] h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-lg text-gray-900">Recent Orders</div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase">
                  <th className="py-2 px-2 text-left font-semibold">Order ID</th>
                  <th className="py-2 px-2 text-left font-semibold">User ID</th>
                  <th className="py-2 px-2 text-left font-semibold">Date</th>
                  <th className="py-2 px-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id || order.code} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-2 font-medium text-gray-900">{order.id || order.code}</td>
                    <td className="py-2 px-2 text-gray-700">{order.userId || (order.user && order.user.id) || 'N/A'}</td>
                    <td className="py-2 px-2 text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : (order.created_date ? new Date(order.created_date).toLocaleString('vi-VN') : 'N/A')}</td>
                    <td className="py-2 px-2 text-right font-bold text-violet-700">{typeof order.totalAmount === 'number' ? order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : (typeof order.total === 'number' ? order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow p-4 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
          <div>
            <div className="font-bold text-lg text-gray-900">Statistics</div>
            <div className="text-gray-500 text-sm">Target you’ve set for each month</div>
          </div>
        </div>
        {/* Line Chart nằm trong cụm Statistic */}
        <div className="w-full">
          <canvas id="statistics-line-chart" className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;