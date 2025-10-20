import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import bookService from "../services/bookService";
import authorService from "../services/authorServices";
import categoryService from "../services/categoryService";

export default function BookForm({ isEdit = false }) {
  const { id } = useParams(); // <-- lấy id từ URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch authors, categories, and book (if edit)
  useEffect(() => {
    authorService
      .getAuthors()
      .then((res) => setAuthors(res ?? []))
      .catch((err) => console.error("Error fetching authors:", err));

    categoryService
      .getCategories()
      .then((res) => setCategories(res ?? []))
      .catch((err) => console.error("Error fetching categories:", err));

    if (isEdit && id) {
      bookService
        .getById(id)
        .then((res) => {
          const book = res.data;
          setTitle(book.title);
          setDescription(book.description);
          setPrice(book.price);
          setPublishedAt(book.publishedAt?.split("T")[0] || "");
          setImagePreview(book.image); // URL ảnh đã có sẵn

          // Chuyển dữ liệu về dạng react-select
          setSelectedAuthors(
            book.authors.map((a) => ({ value: a.id, label: a.name }))
          );
          setSelectedCategories(
            book.categories.map((c) => ({ value: c.id, label: c.name }))
          );
        })
        .catch((err) => {
          console.error("Error fetching book:", err);
          alert("Không tìm thấy sách.");
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
    formData.append("publishedAt", publishedAt);
    if (imageFile) formData.append("image", imageFile);

    selectedAuthors.forEach((author) =>
      formData.append("authorIds", author.value)
    );
    selectedCategories.forEach((cat) =>
      formData.append("categoryIds", cat.value)
    );

    try {
      if (isEdit) {
        await bookService.update(id, formData); // cần có hàm update
      } else {
        await bookService.create(formData);
      }
      navigate("/admin-dashboard/books");
    } catch (err) {
      console.error("Error submitting book:", err);
      alert(`${isEdit ? "Cập nhật" : "Tạo"} sách thất bại!`);
    }
  };

  const authorOptions = authors.map((a) => ({ value: a.id, label: a.name }));
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md my-10 py-10">
      <h2 className="text-xl font-bold mb-4 text-yellow-600">
        {isEdit ? "Chỉnh sửa sách" : "Tạo sách mới"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Các trường giống như trước */}
        <div>
          <label className="font-medium">Tiêu đề</label>
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
          <label className="font-medium">Ngày xuất bản</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Tác giả</label>
          <Select
            isMulti
            options={authorOptions}
            value={selectedAuthors}
            onChange={setSelectedAuthors}
          />
        </div>

        <div>
          <label className="font-medium">Thể loại</label>
          <Select
            isMulti
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        <div>
          <label className="font-medium">Ảnh bìa</label>
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
          {isEdit ? "Cập nhật sách" : "Tạo sách"}
        </button>
      </form>
    </div>
  );
}
