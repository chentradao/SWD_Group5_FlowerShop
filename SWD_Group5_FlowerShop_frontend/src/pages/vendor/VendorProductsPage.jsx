import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import flowerService, { getProductImageUrl } from '../../services/flowerService';
import { useAuth } from '../../contexts/AuthContext';

const VendorProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
  // resolve shopId robustly: some user objects may have shop, shopId or shops[0]
  const shopId = user?.shop?.id || user?.shopId || (user?.shops && user.shops[0]?.id);
  if (!shopId) {
    console.debug('VendorProductsPage: no shopId on user', user);
    setProducts([]);
    return;
  }
  const response = await flowerService.getByShopId(shopId);
        setProducts(Array.isArray(response.data) ? response.data : response.data?.flowers || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sản phẩm của Vendor</h2>
        <Link
          to="/vendor-dashboard/products/new"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Thêm sản phẩm mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <img
              src={getProductImageUrl(product.image)}
              alt={product.title || product.name || 'product'}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
            <p className="text-gray-600 mb-2">{(product.price ?? product.amount ?? 0).toLocaleString('vi-VN')} VNĐ</p>
            <div className="flex justify-end space-x-2">
              <Link
                to={`/vendor-dashboard/products/edit/${product.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                Chỉnh sửa
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</p>
        </div>
      )}
    </div>
  );
};

export default VendorProductsPage;