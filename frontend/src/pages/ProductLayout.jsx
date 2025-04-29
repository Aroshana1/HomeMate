import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  products,
  productCategories,
  productQuantityUnits,
} from "../data/productData";

// Define Zod schema for product validation
const productSchema = z.object({
  productName: z.string().min(1, "Product name is required").max(100),
  productImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  productCategory: z.string().min(1, "Category is required"),
  productQuantityUnit: z.string().min(1, "Quantity unit is required"),
  productMinStockAmount: z.number().min(1, "Minimum stock must be at least 1"),
});

const ProductLayout = () => {
  // Current logged-in user (mock)
  const currentUser = "user001";

  // State for products
  const [allProducts, setAllProducts] = useState(products);
  const [displayedProducts, setDisplayedProducts] = useState(
    products.filter((p) => p.createdBy === currentUser)
  );

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("name-asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // Apply filters and sorting
  useEffect(() => {
    let filtered = allProducts.filter((p) => p.createdBy === currentUser);

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.productCategory === selectedCategory);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.productName.localeCompare(b.productName);
        case "name-desc":
          return b.productName.localeCompare(a.productName);
        case "stock-asc":
          return a.productMinStockAmount - b.productMinStockAmount;
        case "stock-desc":
          return b.productMinStockAmount - a.productMinStockAmount;
        default:
          return 0;
      }
    });

    setDisplayedProducts(filtered);
    setCurrentPage(1);
  }, [allProducts, searchTerm, selectedCategory, sortOption, currentUser]);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  // CRUD Operations
  const handleCreate = () => {
    setCurrentProduct(null);
    reset({
      productName: "",
      productImage: "",
      productCategory: "",
      productQuantityUnit: "",
      productMinStockAmount: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setValue("productName", product.productName);
    setValue("productImage", product.productImage);
    setValue("productCategory", product.productCategory);
    setValue("productQuantityUnit", product.productQuantityUnit);
    setValue("productMinStockAmount", product.productMinStockAmount);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setAllProducts(
      allProducts.filter((p) => p.productId !== productToDelete.productId)
    );
    setIsDeleteConfirmOpen(false);
    toast.success(`"${productToDelete.productName}" deleted successfully!`, {
      position: "top-right",
      autoClose: 3000,
    });
    setProductToDelete(null);
  };

  const onSubmit = (data) => {
    const newProduct = {
      productId: currentProduct
        ? currentProduct.productId
        : allProducts.length + 1,
      productName: data.productName,
      productImage:
        data.productImage ||
        "https://source.unsplash.com/random/200x200/?product",
      productCategory: data.productCategory,
      productQuantityUnit: data.productQuantityUnit,
      productMinStockAmount: Number(data.productMinStockAmount),
      createdBy: currentUser,
    };

    if (currentProduct) {
      setAllProducts(
        allProducts.map((p) =>
          p.productId === currentProduct.productId ? newProduct : p
        )
      );
      toast.success(`"${data.productName}" updated successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setAllProducts([...allProducts, newProduct]);
      toast.success(`"${data.productName}" added successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Dashboard</h1>
        <p className="text-gray-600">Manage your grocery products</p>
        <div className="mt-2 text-sm text-gray-500">
          Logged in as: <span className="font-medium">{currentUser}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.values(productCategories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="stock-asc">Stock (Low-High)</option>
            <option value="stock-desc">Stock (High-Low)</option>
          </select>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://thumbs.dreamstime.com/b/groceries-paper-bag-vector-illustration-97077851.jpg";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.productName}
                  </h3>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {product.productCategory}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p>
                    Min Stock: {product.productMinStockAmount}{" "}
                    {product.productQuantityUnit}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-600">
            No products found matching your criteria.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <FiPlus /> Add your first product
          </button>
        </div>
      )}

      {/* Pagination */}
      {displayedProducts.length > productsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="flex items-center px-2">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {currentProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      {...register("productName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.productName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.productName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      {...register("productImage")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty for random image"
                    />
                    {errors.productImage && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.productImage.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register("productCategory")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {Object.values(productCategories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.productCategory && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.productCategory.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity Unit
                    </label>
                    <select
                      {...register("productQuantityUnit")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a unit</option>
                      {Object.values(productQuantityUnits).map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    {errors.productQuantityUnit && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.productQuantityUnit.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Stock Amount
                    </label>
                    <input
                      type="number"
                      {...register("productMinStockAmount", {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    {errors.productMinStockAmount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.productMinStockAmount.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {currentProduct ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete "{productToDelete?.productName}"?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLayout;
