import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import flowerService from "../../services/flowerService";
import cartService from "../../services/cartService";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const res = await flowerService.getById(id);
        if (res?.data?.id) {
          setFlower(res.data);
        } else {
          setFlower(null);
        }
      } catch (err) {
        console.error("Error fetching flower:", err);
        setFlower(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
  }, [id]);

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => (prev < flower.stock ? prev + 1 : prev));
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    if (!flower) return;

    try {
      await cartService.addToCart(user.id, flower.id, quantity);
      refreshCartCount();
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      const msg = err?.response?.data?.message || err?.message || 'Thêm vào giỏ thất bại!';
      alert(msg);
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!flower) return <p className="text-center mt-10">Không tìm thấy hoa!</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg mb-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Hình ảnh */}
        <div className="w-full md:w-1/3">
          <img
            src={
              flower.image
                ? `${import.meta.env.VITE_API_URL}${flower.image}`
                : "/placeholder-flower.png"
            }
            alt={flower.title || "Không có tiêu đề"}
            className="w-full h-auto rounded-lg shadow border"
          />
        </div>

        {/* Thông tin */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-yellow-700">
            {flower.title || "Không có tiêu đề"}
          </h1>

{/* Thể loại */}
<div className="mt-1 text-gray-700 text-sm flex flex-wrap gap-2">
  <span className="font-medium">📂 Danh mục:</span>
  {flower.categories && flower.categories.length > 0
    ? flower.categories.map((cat) => (
        <span
          key={cat.id}
          onClick={() => navigate(`/shop?categoryId=${cat.id}`)}
          className="cursor-pointer bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow-200 transition"
        >
          {cat.name}
        </span>
      ))
    : "Không rõ danh mục"}
</div>

          {/* Mô tả */}
          <p className="mt-5 text-gray-600 leading-relaxed">
            {flower.description || "Không có mô tả"}
          </p>

          {/* Giá */}
          <p className="mt-6 text-2xl font-semibold text-red-600">
            {flower?.price != null
              ? `${flower.price.toLocaleString()} ₫`
              : "Chưa có giá"}
          </p>

          {/* Tồn kho */}
          <p className="mt-1 text-sm font-medium">
            {flower.stock > 0 ? (
              <span className="text-green-600">Còn {flower.stock} sản phẩm</span>
            ) : (
              <span className="text-red-500">Hết hàng</span>
            )}
          </p>

          {/* Nút chọn số lượng và thêm vào giỏ */}
          {flower.stock > 0 ? (
            <>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={flower.stock}
                  value={quantity}
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 1;
                    if (val < 1) val = 1;
                    if (val > flower.stock) val = flower.stock;
                    setQuantity(val);
                  }}
                  className="w-16 text-center border rounded"
                />
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              {user && (
                <button
                  onClick={handleAddToCart}
                  className="mt-6 px-8 py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition text-lg shadow"
                >
                  🛒 Thêm vào giỏ
                </button>
              )}
              {!user && (
                <Link to="/login">
                  <button className="mt-6 px-8 py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition text-lg shadow">
                    Đăng nhập để mua
                  </button>
                </Link>
              )}
            </>
          ) : (
            <button
              disabled
              className="mt-6 px-8 py-3 rounded-lg bg-red-600 text-white cursor-not-allowed text-lg shadow"
            >
              Hết hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
