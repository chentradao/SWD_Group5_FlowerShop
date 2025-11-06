import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import flowerService from "../../services/flowerService";
import {
  PencilSquareIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

const ManageBookPage = ({ vendorMode = false }) => {
  const [flowers, setFlowers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [addQuantity, setAddQuantity] = useState(0);

  const navigate = useNavigate();

  const fetchFlowers = async () => {
    try {
      let data = [];
      if (vendorMode) {
        const cached = localStorage.getItem('user');
        const user = cached ? JSON.parse(cached) : null;
        if (!user?.shop?.id) {
          setFlowers([]);
          return;
        }
        const res = await flowerService.getByShopId(user.shop.id);
        data = res.data || [];
      } else {
        const res = await flowerService.getAll();
        data = res.data.flowers || [];
      }

      if (search.trim()) {
        data = data.filter((flower) =>
          flower.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setFlowers(data);
    } catch (err) {
      console.error("Error fetching flowers:", err);
      setFlowers([]);
    }
  };

  const handleDisable = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hoa này sẽ bị vô hiệu hóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Vâng, vô hiệu hóa!",
    });

    if (result.isConfirmed) {
      try {
        await flowerService.disable(id);
        fetchFlowers();
        Swal.fire("Đã vô hiệu hóa!", "Hoa đã được vô hiệu hóa.", "success");
      } catch (err) {
        Swal.fire("Lỗi", "Không thể vô hiệu hóa hoa.", "error");
      }
    }
  };

  const openAddStockModal = (flower) => {
    setSelectedFlower(flower);
    setAddQuantity(0);
    setIsModalOpen(true);
  };

  const handleAddStock = async () => {
    try {
      const newStock = selectedFlower.stock + addQuantity;
      await flowerService.updateStock(selectedFlower.id, newStock);
      Swal.fire("Thành công", "Cập nhật tồn kho thành công!", "success");
      fetchFlowers();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire("Lỗi", "Không thể cập nhật tồn kho", "error");
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">🌸 Quản lý hoa</h1>
        <button
          onClick={() => navigate(vendorMode ? "/vendor-dashboard/products/new" : "/admin-dashboard/flowers/new")}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          <PlusIcon className="w-5 h-5" /> Thêm hoa
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoa..."
          className="border px-4 py-2 w-full rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">Hình ảnh</th>
              <th className="px-4 py-2 text-left">Tên hoa</th>
              <th className="px-4 py-2">Giá</th>
              <th className="px-4 py-2">Tồn kho</th>
              <th className="px-4 py-2">Đã bán</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {flowers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Không tìm thấy hoa nào.
                </td>
              </tr>
            ) : (
              flowers.map((flower) => (
                <tr key={flower.id} className="border-t">
                  <td className="px-4 py-2">
                    {flower.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${flower.image}`}
                        alt={flower.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        Không có hình ảnh
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{flower.title}</td>
                  <td className="px-4 py-2">
                    {Number(flower.price).toLocaleString()} đ
                  </td>
                  <td className="px-4 py-2 text-center">{flower.stock || 0}</td>
                  <td className="px-4 py-2 text-center">{flower.sold || 0}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(vendorMode ? `/vendor-dashboard/products/edit/${flower.id}` : `/admin-dashboard/flowers/edit/${flower.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDisable(flower.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/flower/${flower.id}`)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openAddStockModal(flower)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h3 className="font-bold mb-2">Thêm tồn kho</h3>
            <input
              type="number"
              value={addQuantity}
              onChange={(e) => setAddQuantity(Number(e.target.value))}
              className="border rounded p-2 w-full mb-4"
              placeholder="Nhập số lượng cần thêm"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleAddStock}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookPage;
