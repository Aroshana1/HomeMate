// components/InventoryTable.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddEditItemModal from "./AddEditItemModal";
import Pagination from "./Pagination";
import SearchSortBar from "./SearchSortBar";
import { getDaysUntilExpiry, isLowStock } from "../utils/helpers";
import {
  groceryInventory as initialInventoryData,
  productCategories,
  productQuantityUnits,
} from "../data/groceryInventoryData";

const InventoryTable = ({
  addToShoppingList,
  categories,
  units,
  initialInventory,
}) => {
  //const [inventory, setInventory] = useState(initialInventory || []);
  const [inventory, setInventory] = useState(initialInventoryData);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  // Memoize filtered and sorted inventory
  useEffect(() => {
    let result = [...inventory];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(term) ||
          item.productCategory.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      const category = categories[filterCategory];
      result = result.filter((item) => item.productCategory === category);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Prioritize items that are about to expire or low stock
    result.sort((a, b) => {
      const aExpiringSoon = getDaysUntilExpiry(a.productExpireDate) <= 5;
      const bExpiringSoon = getDaysUntilExpiry(b.productExpireDate) <= 5;
      const aLowStock = isLowStock(a);
      const bLowStock = isLowStock(b);

      if (aExpiringSoon !== bExpiringSoon) return aExpiringSoon ? -1 : 1;
      if (aLowStock !== bLowStock) return aLowStock ? -1 : 1;
      return 0;
    });

    setFilteredInventory(result);
    setCurrentPage(1);
  }, [inventory, searchTerm, sortConfig, filterCategory, categories]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleAddToShoppingList = useCallback(
    (item) => {
      const neededQuantity = Math.max(
        0,
        item.productMinStockAmount - item.productQuantity
      );
      addToShoppingList({
        ...item,
        neededQuantity,
      });
      toast.success(`${item.productName} added to shopping list`);
    },
    [addToShoppingList]
  );

  const handleEdit = useCallback((item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setInventory((prev) => prev.filter((item) => item.inventoryItemId !== id));
    toast.success("Item deleted successfully");
  }, []);

  const handleAddNew = useCallback(() => {
    setCurrentItem(null);
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback((item) => {
    const updatedItem = {
      ...item,
      lastUpdated: new Date().toISOString(),
      isLowStock: item.productQuantity <= item.productMinStockAmount,
    };

    setInventory((prev) => {
      if (item.inventoryItemId) {
        // Update existing item
        return prev.map((i) =>
          i.inventoryItemId === item.inventoryItemId ? updatedItem : i
        );
      } else {
        // Add new item
        const newId = `INV${Math.floor(1000 + Math.random() * 9000)}`;
        return [...prev, { ...updatedItem, inventoryItemId: newId }];
      }
    });

    toast.success(
      `Item ${item.inventoryItemId ? "updated" : "added"} successfully`
    );
    setIsModalOpen(false);
  }, []);

  // Memoize pagination data
  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: filteredInventory.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.ceil(filteredInventory.length / itemsPerPage),
    };
  }, [currentPage, filteredInventory, itemsPerPage]);

  // Column configuration for better maintainability
  const columns = [
    { key: "productName", label: "Product Name", sortable: true },
    { key: "image", label: "Image", sortable: false },
    { key: "productCategory", label: "Category", sortable: true },
    { key: "productQuantity", label: "Quantity", sortable: true },
    { key: "minStock", label: "Min Stock", sortable: false },
    { key: "productExpireDate", label: "Expiry Date", sortable: true },
    { key: "status", label: "Status", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Inventory Management
        </h2>
        <button
          onClick={handleAddNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          aria-label="Add new item"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Item
        </button>
      </div>

      <SearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={
                    column.sortable ? () => handleSort(column.key) : undefined
                  }
                  style={{ cursor: column.sortable ? "pointer" : "default" }}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => {
                const daysUntilExpiry = getDaysUntilExpiry(
                  item.productExpireDate
                );
                const isExpiringSoon = daysUntilExpiry <= 5;
                const isItemLowStock = isLowStock(item);

                return (
                  <tr
                    key={item.inventoryItemId}
                    className={`
                      ${isExpiringSoon ? "bg-red-50" : ""}
                      ${isItemLowStock ? "bg-orange-50" : ""}
                      hover:bg-gray-50
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/40";
                          e.target.onerror = null;
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {item.productCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {item.productQuantity} {item.productQuantityUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {item.productMinStockAmount} {item.productQuantityUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <span
                        className={
                          isExpiringSoon ? "text-red-600 font-semibold" : ""
                        }
                      >
                        <div>{item.productExpireDate}</div>
                        {isExpiringSoon && <div>({daysUntilExpiry} days)</div>}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {isExpiringSoon ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Expiring Soon
                        </span>
                      ) : isItemLowStock ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-1">
                        {/* First row: Edit & Delete */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                            aria-label={`Edit ${item.productName}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.inventoryItemId)}
                            className="px-2 py-1 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                            aria-label={`Delete ${item.productName}`}
                          >
                            Delete
                          </button>
                        </div>

                        {/* Second row: Add to List */}
                        {isItemLowStock && (
                          <button
                            onClick={() => handleAddToShoppingList(item)}
                            className="px-2 py-1 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
                            aria-label={`Add ${item.productName} to shopping list`}
                          >
                            Add to List
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddEditItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={currentItem}
        onSave={handleSave}
        categories={categories}
        units={units}
      />
    </div>
  );
};

InventoryTable.propTypes = {
  addToShoppingList: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
  initialInventory: PropTypes.array,
};

export default InventoryTable;
