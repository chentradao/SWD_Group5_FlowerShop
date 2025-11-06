import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, NavLink  } from "react-router-dom";
import cartService from "../services/cartService";
import { getProduct, getProductId, getProductImageUrl, getProductPrice } from "../services/flowerService";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchCart(parsedUser.id);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    cart.forEach((item) => {
      const product = getProduct(item);
      if (product && product.stock === 0 && item.quantity !== 1) {
        updateQuantity(item.id, 1);
      }
    });
  }, [cart]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".cart-icon")
      ) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      const res = await cartService.getCart(userId);
      setCart(Array.isArray(res.data) ? res.data : []);
      setSelectedItems([]);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
      setSelectedItems([]);
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId, user.id);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cart.find((i) => i.id === itemId);
  if (!item) return;
  const product = getProduct(item);
  if (product && product.stock !== 0 && newQuantity > product.stock) return;

    try {
      await cartService.updateQuantity(itemId, user.id, newQuantity);
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const cartCount = cart.length;
  const cartTotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + getProductPrice(item) * (item?.quantity || 0), 0);

  const navigateLogin = () => navigate(`/login`);
  const navigateRegister = () => navigate(`/register`);

  const handleToggleCart = () => {
    setShowCartDropdown((prev) => {
      const newState = !prev;
      if (newState && user?.id) {
        fetchCart(user.id);
      }
      return newState;
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const goToCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );
    // Ensure all selected products are from the same shop
    const shopSet = new Set(selectedProducts.map(item => getProduct(item)?.shopId || getProduct(item)?.shop?.id || null));
    if (shopSet.size > 1) {
      alert('Vui lòng chỉ chọn sản phẩm từ cùng 1 shop cho mỗi đơn hàng');
      return;
    }
    localStorage.setItem("checkout_items", JSON.stringify(selectedProducts));
    navigate(`/checkout`);
  };

  const getImageUrl = (path) => getProductImageUrl(path);

  return (
    <header className="bg-[#FFE4B5] shadow-sm text-[#2F2F2F] relative">
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 font-bold text-2xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/images/book-logo1.png" alt="Logo" className="w-9 h-9" />
          <span>FUHUSU</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#B84D36] font-semibold border-b-2 border-[#B84D36]"
                : "hover:text-[#B84D36]"
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "text-[#B84D36] font-semibold border-b-2 border-[#B84D36]"
                : "hover:text-[#B84D36]"
            }
          >
            Cửa hàng
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-[#B84D36] font-semibold border-b-2 border-[#B84D36]"
                : "hover:text-[#B84D36]"
            }
          >
            Giới thiệu
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-[#B84D36] font-semibold border-b-2 border-[#B84D36]"
                : "hover:text-[#B84D36]"
            }
          >
            Liên hệ
          </NavLink>
        </nav>

        {/* Right section */}
        <div className="flex items-center space-x-4 relative mr-10">
          {user ? (
            <>
              {/* Cart Icon */}
              <div
                className="relative cursor-pointer cart-icon"
                onClick={handleToggleCart}
              >
                <FaShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Cart dropdown */}
              {showCartDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-12 w-[90vw] md:w-[28rem] bg-white border border-gray-200 shadow-xl rounded-xl p-6 z-50 flex flex-col max-h-[85vh] overflow-auto"
                >
                  <h4 className="font-bold text-lg mb-4 border-b pb-2">Giỏ hàng</h4>
                  {cart.length > 0 ? (
                    <>
                      <ul className="space-y-4">
                        {cart.map((item) => {
                            const product = getProduct(item);
                            const outOfStock = product?.stock === 0;
                            const tempPrice = item.quantity * (product?.price || 0);
                            return (
                              <li
                                key={item.id}
                                className="grid grid-cols-[auto,80px,1fr,auto] gap-4 p-3 bg-gray-50 rounded-lg"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(item.id)}
                                  onChange={() => handleCheckboxChange(item.id)}
                                  disabled={outOfStock}
                                />
                                <img
                                  src={getImageUrl(product?.image)}
                                  alt={product?.title}
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                                <div>
                                  <p className={`${outOfStock ? "line-through opacity-60" : ""}`}>
                                    {product?.title}
                                  </p>
                                  {outOfStock ? (
                                    <p className="text-xs text-red-500">Hết hàng</p>
                                  ) : (
                                    <>
                                      <p>Số lượng: {item.quantity}</p>
                                      <p>Tạm tính: {tempPrice.toLocaleString()}₫</p>
                                    </>
                                  )}
                                </div>
                                <div className="flex flex-col items-end">
                                  <span>{(product?.price || 0).toLocaleString()}₫</span>
                                  <button
                                    onClick={() => deleteCartItem(item.id)}
                                    className="text-red-500 text-sm"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                      <div className="mt-4 border-t pt-4">
                        <p className="flex justify-between font-bold text-lg">
                          <span>Tổng cộng:</span>
                          <span>{cartTotal.toLocaleString()}₫</span>
                        </p>
                        <button
                          disabled={selectedItems.length === 0}
                          onClick={goToCheckout}
                          className={`w-full py-2 mt-2 rounded-lg ${selectedItems.length > 0
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200 text-gray-400"
                            }`}
                        >
                          Thanh toán
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500">Bạn chưa thêm sản phẩm nào</p>
                  )}
                </div>
              )}

              {/* User Name */}
              <span className="hidden md:inline text-sm font-semibold">
                Xin chào, {user?.fullName || user?.name || user?.email}
              </span>
            </>
          ) : (
            <>
              <button
                className="text-sm hover:text-[#B84D36]"
                onClick={navigateLogin}
              >
                Đăng nhập
              </button>
              <button
                onClick={navigateRegister}
                className="text-sm px-3 py-1 border border-[#B84D36] text-[#B84D36] hover:bg-[#B84D36] hover:text-white rounded"
              >
                Đăng ký
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col items-center bg-[#FFE4B5] py-4 space-y-4 border-t border-gray-200">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Cửa hàng</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Giới thiệu</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Liên hệ</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
