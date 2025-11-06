import React, { useEffect, useState } from "react";
import cartService from "../../services/cartService";
import { getProduct, getProductId, getProductImageUrl, getProductPrice } from "../../services/flowerService";
const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    if (storedUser)
      setForm((f) => ({
        ...f,
        name: storedUser.fullName || "",
        phone: storedUser.phone || "",
      }));

    const storedItems = JSON.parse(
      localStorage.getItem("checkout_items") || "[]"
    );
    setCheckoutItems(storedItems);

    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  const handleProvinceChange = (e) => {
    const provinceCode = Number(e.target.value);
    setForm((f) => ({ ...f, province: provinceCode, district: "", ward: "" }));
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts || []);
        setWards([]);
      })
      .catch(console.error);
  };

  const handleDistrictChange = (e) => {
    const districtCode = Number(e.target.value);
    setForm((f) => ({ ...f, district: districtCode, ward: "" }));
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch(console.error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const total = checkoutItems.reduce(
    (sum, item) => sum + getProductPrice(item) * (item.quantity || 0),
    0
  );

  const handlePayment = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập trước khi thanh toán");
      return;
    }

    if (
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.address ||
      !form.phone
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ và số điện thoại");
      return;
    }

    try {
        // Ensure all checkout items are from the same shop
        const shopSet = new Set(checkoutItems.map(item => getProduct(item)?.shopId || getProduct(item)?.shop?.id || null));
        if (shopSet.size > 1) {
          alert('Không thể thanh toán các sản phẩm từ nhiều shop khác nhau trong cùng một đơn. Vui lòng tách đơn.');
          return;
        }
      const payload = {
        userId: user.id,
        items: checkoutItems.map((item) => ({
            flowerId: getProductId(item),
            quantity: item.quantity,
            price: getProductPrice(item),
            shopId: getProduct(item)?.shopId || getProduct(item)?.shop?.id || null,
          })),
        payment: form.paymentMethod,
        userAddress: {
          fullName: form.name,
          phone: form.phone,
          province:
            provinces.find((p) => p.code === Number(form.province))?.name || "",
          district:
            districts.find((d) => d.code === Number(form.district))?.name || "",
          ward: wards.find((w) => w.code === Number(form.ward))?.name || "",
          addressDetail: form.address,
        },
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Thanh toán thất bại");
      }

      const data = await res.json();

      // ✅ Xóa trong localStorage
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const updatedCart = cartItems.filter((cartItem) =>
        !checkoutItems.some(
          (checkoutItem) => getProductId(checkoutItem) === getProductId(cartItem)
        )
      );
      localStorage.setItem("cart_items", JSON.stringify(updatedCart));
      localStorage.removeItem("checkout_items");

      // ✅ Xóa trong DB
      for (let item of checkoutItems) {
        await cartService.removeItem(item.id, user.id);
        // item.id ở đây là id của cartItem trong DB, không phải book.id
      }

      alert("Đặt hàng thành công!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi thanh toán");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cột trái: Sản phẩm */}
      <div className="md:col-span-2">
        <div className="bg-white shadow p-6 rounded mb-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          <ul className="divide-y">
              {checkoutItems.map((item) => {
              const product = getProduct(item);
              const tempPrice = (product?.price || 0) * (item.quantity || 0);
              return (
                <li key={item.id} className="py-4 flex items-center gap-4">
                  <img
                    src={getProductImageUrl(product?.image)}
                    alt={product?.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product?.title}</p>
                    <p className="text-sm text-gray-500">
                      Giá: {product?.price?.toLocaleString()}₫
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 border rounded"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded"
                        disabled={item.quantity >= product?.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold min-w-[100px] text-right">
                    {tempPrice.toLocaleString()}₫
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Cột phải: Thông tin & Thanh toán */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold mb-4">Thông tin người mua</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Họ và tên"
              className="border p-2 rounded w-full"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className="border p-2 rounded w-full"
            />
            <select
              value={form.province}
              onChange={handleProvinceChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Chọn tỉnh / thành phố</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={form.district}
              onChange={handleDistrictChange}
              className="border p-2 rounded w-full"
              disabled={!districts.length}
            >
              <option value="">Chọn quận / huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={form.ward}
              onChange={(e) =>
                setForm((f) => ({ ...f, ward: Number(e.target.value) }))
              }
              className="border p-2 rounded w-full"
              disabled={!wards.length}
            >
              <option value="">Chọn phường / xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ chi tiết"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <p className="flex justify-between text-lg font-bold mb-4">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()}₫</span>
          </p>
          <div className="mb-4">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={form.paymentMethod === "COD"}
                onChange={handleInputChange}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Wallet"
                checked={form.paymentMethod === "Wallet"}
                onChange={handleInputChange}
              />
              Thanh toán bằng ví
            </label>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
