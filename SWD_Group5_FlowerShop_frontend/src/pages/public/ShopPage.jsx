// ShopPage.jsx
import React, { useEffect, useState } from "react";
import flowerService from "../../services/flowerService";
import categoryServices from "../../services/categoryService";
import { useNavigate, useLocation } from "react-router-dom";

const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initCategoryId = queryParams.get("categoryId") || "";
  const initPage = parseInt(queryParams.get("page")) || 1;

  const [categories, setCategories] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [catSearch, setCatSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categoryId: initCategoryId,
    limit: 6,
    page: initPage,
  });
  const [totalPages, setTotalPages] = useState(1);

  // Load categories
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const catRes = await categoryServices.getCategories();
        setCategories(catRes);
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Load flowers khi filters thay đổi
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        // Only send categoryId, limit and page to the API — keep filtering by category only
        const res = await flowerService.getAll({
          categoryId: filters.categoryId,
          limit: filters.limit,
          page: filters.page,
        });

        console.log("API Response:", res); // Debugging API response

        const mappedFlowers = (res.data.flowers || []).map((flower) => ({
          ...flower,
          categoryName: flower.categories?.map((c) => c.name).join(", ") || "Không rõ danh mục",
        }));

        setFlowers(mappedFlowers);
        setTotalPages(res.data.totalPages || 1); // Use totalPages from API response
        setFilters((prevFilters) => ({ ...prevFilters, page: res.data.currentPage || 1 }));
      } catch (err) {
        console.error("Error loading flowers:", err);
      }
    };

    // Fetch flowers ngay lập tức, không cần đợi categories
    fetchFlowers();
  }, [filters]);

  // Update the handleFilterChange function to avoid unnecessary navigation calls
  // Only allow changing categoryId via the filter UI. Other keys are not part of the filter.
  const handleFilterChange = (key, value) => {
    if (key !== 'categoryId') return;
    const newFilters = { ...filters, categoryId: value, page: 1 };
    if (newFilters.categoryId !== filters.categoryId || newFilters.page !== filters.page) {
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
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
  const filteredFlowers = flowers.filter((flower) =>
    flower.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the pagination button click handler to avoid unnecessary state updates
  const handlePageChange = (page) => {
    if (page !== filters.page) {
      const updatedFilters = { ...filters, page };
      setFilters(updatedFilters);
      const params = new URLSearchParams();
      if (updatedFilters.categoryId) params.set("categoryId", updatedFilters.categoryId);
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

      </div>

      {/* Flower List */}
      <div className="w-full lg:w-3/4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm hoa..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {filteredFlowers.length === 0 ? (
          <p className="text-gray-500">Không có hoa nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlowers.map((flower) => (
              <div
                key={flower.id}
                onClick={() => navigate(`/flower/${flower.id}`)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border border-yellow-200 flex flex-col cursor-pointer"
              >
                {flower.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${flower.image}`}
                    alt={flower.title}
                    className="h-64 w-full object-cover object-center rounded-lg mb-4"
                  />
                ) : (
                  <div className="h-64 w-full bg-gray-100 flex items-center justify-center text-sm text-gray-400 rounded-lg mb-4">
                    No image
                  </div>
                )}

                <h4 className="font-semibold text-lg text-yellow-700 truncate">
                  {flower.title}
                </h4>

                {/* Shop name */}
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">🏪 Shop: </span>
                  <span className="text-blue-600">{flower.shop?.name || "Shop không xác định"}</span>
                </div>

                {/* Danh mục */}
                <div className="mt-1 text-gray-700 text-sm flex flex-wrap gap-2">
                  <span className="font-medium">📂 Danh mục:</span>
                  {flower.categories && flower.categories.length > 0
                    ? flower.categories.map((cat) => (
                        <span
                          key={cat.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/shop?categoryId=${cat.id}`);
                          }}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {cat.name}
                        </span>
                      ))
                    : "Không rõ danh mục"}
                </div>

                <p
                  className={`text-sm font-medium mt-1 ${
                    flower.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {flower.stock > 0 ? `Còn ${flower.stock} bó` : "Hết hàng"}
                </p>
                <p className="text-lg font-bold text-yellow-600 mt-2">
                  {flower.price?.toLocaleString("vi-VN")}₫
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
