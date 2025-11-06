import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import flowerService from "../services/flowerService";
import categoryService from "../services/categoryService";
import { useAuth } from "../contexts/AuthContext";

export default function FlowerForm({ isEdit = false }) {
  const { id } = useParams(); // <-- lấy id từ URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch categories, and flower (if edit)
  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res ?? []))
      .catch((err) => console.error("Error fetching categories:", err));

    if (isEdit && id) {
      flowerService
        .getById(id)
        .then((res) => {
          const flower = res.data;
          // Kiểm tra quyền chỉnh sửa (case-insensitive role)
          if (role !== 'admin' && flower.shopId !== user.shop?.id) {
            alert('Bạn không có quyền chỉnh sửa sản phẩm này!');
            navigate(role === 'vendor' ? '/vendor-dashboard/products' : '/');
            return;
          }
          setTitle(flower.title);
          setDescription(flower.description);
          setPrice(flower.price);
          setImagePreview(flower.image); // URL ảnh đã có sẵn

          // Chuyển dữ liệu về dạng react-select
          setSelectedCategories(
            flower.categories.map((c) => ({ value: c.id, label: c.name }))
          );
        })
        .catch((err) => {
          console.error("Error fetching flower:", err);
          alert("Không tìm thấy hoa.");
        });
    }
  }, [isEdit, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);

    // Thêm shopId nếu là vendor (case-insensitive role)
    if (role === 'vendor') {
      formData.append("shopId", user.shop.id);
    }

    selectedCategories.forEach((cat) =>
      formData.append("categoryIds", cat.value)
    );

    try {
      if (isEdit) {
        await flowerService.update(id, formData);
      } else {
        await flowerService.create(formData);
      }
  // Chuyển hướng dựa vào role (case-insensitive)
  const redirectPath = role === 'vendor' ? '/vendor-dashboard/products' : '/admin-dashboard/flowers';
      navigate(redirectPath);
    } catch (err) {
      console.error("Error submitting flower:", err);
      alert(`${isEdit ? "Cập nhật" : "Tạo"} hoa thất bại!`);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md my-10 py-10">
      <h2 className="text-xl font-bold mb-4 text-yellow-600">
        {isEdit ? "Chỉnh sửa hoa" : "Tạo hoa mới"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Các trường giống như trước */}
        <div>
          <label className="font-medium">Tên hoa</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-medium">Mô tả</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="font-medium">Giá</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-medium">Danh mục</label>
          <Select
            isMulti
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        <div>
          <label className="font-medium">Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-auto"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          {isEdit ? "Cập nhật hoa" : "Tạo hoa"}
        </button>
      </form>
    </div>
  );
}
