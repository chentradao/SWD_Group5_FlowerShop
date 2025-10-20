// ShopPage.jsx
import React, { useEffect, useState } from "react";
import bookService from "../../services/bookService";
import categoryServices from "../../services/categoryService";
import authorServices from "../../services/authorServices";
import { useNavigate, useLocation } from "react-router-dom";

const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initCategoryId = queryParams.get("categoryId") || "";
  const initAuthorId = queryParams.get("authorId") || "";
  const initPage = parseInt(queryParams.get("page")) || 1;

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [catSearch, setCatSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "AVAILABLE",
    categoryId: initCategoryId,
    authorId: initAuthorId,
    limit: 6,
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

  // Load categories & authors
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, authRes] = await Promise.all([
          categoryServices.getCategories(),
          authorServices.getAuthors(),
        ]);
        setCategories(catRes);
        setAuthors(authRes);
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Load books khi filters hoặc danh sách authors/categories thay đổi
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await bookService.getAll({
          ...filters,
          limit: filters.limit,
          page: filters.page,
        });

        console.log("API Response:", res); // Debugging API response

        const mappedBooks = (res.data.books || []).map((book) => ({
          ...book,
          authorName: book.authors?.map((a) => a.name).join(", ") || "Không rõ tác giả",
          categoryName: book.categories?.map((c) => c.name).join(", ") || "Không rõ thể loại",
        }));

        setBooks(mappedBooks);
        setTotalPages(res.data.totalPages || 1); // Use totalPages from API response
        setFilters((prevFilters) => ({ ...prevFilters, page: res.data.currentPage || 1 }));
      } catch (err) {
        console.error("Error loading books:", err);
      }
    };

    // Chỉ fetch khi authors và categories đã load
    if (authors.length > 0 && categories.length > 0) {
      fetchBooks();
    }
  }, [filters, authors, categories]);

  // Update the handleFilterChange function to avoid unnecessary navigation calls
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
      if (newFilters.authorId) params.set("authorId", newFilters.authorId);
      params.set("page", newFilters.page);
      navigate(`/shop?${params.toString()}`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredAuthors = authors.filter((auth) =>
    auth.name.toLowerCase().includes(authorSearch.toLowerCase())
  );
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the pagination button click handler to avoid unnecessary state updates
  const handlePageChange = (page) => {
    if (page !== filters.page) {
      const updatedFilters = { ...filters, page };
      setFilters(updatedFilters);
      const params = new URLSearchParams();
      if (updatedFilters.categoryId) params.set("categoryId", updatedFilters.categoryId);
      if (updatedFilters.authorId) params.set("authorId", updatedFilters.authorId);
      params.set("page", updatedFilters.page);
      navigate(`/shop?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 space-y-6 bg-white p-4 rounded-xl shadow border border-yellow-300">
        {/* Category */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-yellow-700">
            📂 Danh mục
          </h3>
          <input
            type="text"
            placeholder="Tìm danh mục..."
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            className="w-full p-2 mb-3 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={() => handleFilterChange("categoryId", "")}
            className={`block w-full text-left p-2 rounded-lg mb-1 transition ${
              filters.categoryId === ""
                ? "bg-yellow-500 text-white"
                : "hover:bg-yellow-100"
            }`}
          >
            Tất cả
          </button>
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange("categoryId", cat.id)}
              className={`block w-full text-left p-2 rounded-lg mb-1 transition ${
                filters.categoryId === cat.id
                  ? "bg-yellow-500 text-white"
                  : "hover:bg-yellow-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Author */}
        <div>
          <h3 className="font-semibold text-lg mb-2 text-yellow-700">
            ✍ Tác giả
          </h3>
          <input
            type="text"
            placeholder="Tìm tác giả..."
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
            className="w-full p-2 mb-3 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={() => handleFilterChange("authorId", "")}
            className={`block w-full text-left p-2 rounded-lg mb-1 transition ${
              filters.authorId === ""
                ? "bg-yellow-500 text-white"
                : "hover:bg-yellow-100"
            }`}
          >
            Tất cả
          </button>
          {filteredAuthors.map((auth) => (
            <button
              key={auth.id}
              onClick={() => handleFilterChange("authorId", auth.id)}
              className={`block w-full text-left p-2 rounded-lg mb-1 transition ${
                filters.authorId === auth.id
                  ? "bg-yellow-500 text-white"
                  : "hover:bg-yellow-100"
              }`}
            >
              {auth.name}
            </button>
          ))}
        </div>
      </div>

      {/* Book List */}
      <div className="w-full lg:w-3/4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {filteredBooks.length === 0 ? (
          <p className="text-gray-500">Không có sách nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border border-yellow-200 flex flex-col cursor-pointer"
              >
                {book.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${book.image}`}
                    alt={book.title}
                    className="h-64 w-full object-cover object-center rounded-lg mb-4"
                  />
                ) : (
                  <div className="h-64 w-full bg-gray-100 flex items-center justify-center text-sm text-gray-400 rounded-lg mb-4">
                    No image
                  </div>
                )}

                <h4 className="font-semibold text-lg text-yellow-700 truncate">
                  {book.title}
                </h4>
                <div className="mt-3 text-gray-700 text-sm flex flex-wrap gap-2">
                  <span className="font-medium">✍ Tác giả:</span>
                  {book.authors?.length
                    ? book.authors.map((a, idx) => (
                        <span
                          key={idx}
                          onClick={() => navigate(`/shop?authorId=${a.id}`)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {a.name}
                        </span>
                      ))
                    : "Không rõ tác giả"}
                </div>

                {/* Thể loại */}
                <div className="mt-1 text-gray-700 text-sm flex flex-wrap gap-2">
                  <span className="font-medium">📂 Thể loại:</span>
                  {book.categories && book.categories.length > 0
                    ? book.categories.map((cat) => (
                        <span
                          key={cat.id}
                          onClick={() => navigate(`/shop?categoryId=${cat.id}`)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {cat.name}
                        </span>
                      ))
                    : "Không rõ thể loại"}
                </div>

                <p
                  className={`text-sm font-medium mt-1 ${
                    book.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {book.stock > 0 ? `Còn ${book.stock} bó` : "Hết hàng"}
                </p>
                <p className="text-lg font-bold text-yellow-600 mt-2">
                  {book.price?.toLocaleString("vi-VN")}₫
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {totalPages > 0 ? (
            Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded transition ${
                  filters.page === i + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 hover:bg-yellow-200"
                }`}
              >
                {i + 1}
              </button>
            ))
          ) : (
            <p className="text-gray-500">Không có trang nào để hiển thị.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
