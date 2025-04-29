import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { products } from "../data/productData";

const inventoryItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productImage: z.string().url("Invalid URL").or(z.literal("")),
  productCategory: z.string().min(1, "Category is required"),
  productQuantity: z.number().min(0, "Quantity must be positive"),
  productQuantityUnit: z.string().min(1, "Unit is required"),
  productMinStockAmount: z.number().min(0, "Minimum stock must be positive"),
  productExpireDate: z.string().min(1, "Expiry date is required"),
  supplier: z.string().min(1, "Supplier is required"),
  location: z.string().min(1, "Location is required"),
});

const AddEditItemModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  categories,
  units,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      productName: "",
      productImage: "",
      productCategory: "",
      productQuantity: 0,
      productQuantityUnit: "",
      productMinStockAmount: 0,
      productExpireDate: "",
      supplier: "",
      location: "",
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [minExpiryDate, setMinExpiryDate] = useState("");

  useEffect(() => {
    // Set minimum expiry date to today
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setMinExpiryDate(formattedDate);

    if (item) {
      reset({
        ...item,
        productQuantity: parseFloat(item.productQuantity),
        productMinStockAmount: parseFloat(item.productMinStockAmount),
      });
      setSearchTerm(item.productName);
    } else {
      reset();
      setSearchTerm("");
    }
  }, [item, reset]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 1) {
      const results = products.filter((product) =>
        product.productName.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleProductSelect = (product) => {
    setValue("productName", product.productName);
    setValue("productImage", product.productImage);
    setValue("productCategory", product.productCategory);
    setValue("productQuantityUnit", product.productQuantityUnit);
    setValue("productMinStockAmount", product.productMinStockAmount);
    setSearchTerm(product.productName);
    setShowResults(false);
  };

  const onSubmit = (data) => {
    const itemToSave = {
      ...data,
      productQuantity: parseFloat(data.productQuantity),
      productMinStockAmount: parseFloat(data.productMinStockAmount),
      lastUpdated: new Date().toISOString(),
      createdBy: "currentUser",
      isLowStock:
        parseFloat(data.productQuantity) <=
        parseFloat(data.productMinStockAmount),
    };

    if (item) {
      itemToSave.inventoryItemId = item.inventoryItemId;
    }

    onSave(itemToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {item ? "Edit Inventory Item" : "Add New Inventory Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Search */}
            <div className="relative col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Product *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                    errors.productName ? "border-red-500" : "border"
                  }`}
                  placeholder="Type to search products..."
                />
                <input type="hidden" {...register("productName")} />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.productId}
                        className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center"
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.productImage && (
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-8 h-8 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-800">
                            {product.productName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.productCategory}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productName.message}
                </p>
              )}
            </div>

            {/* Product Image */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image URL
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  {...register("productImage")}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                    errors.productImage ? "border-red-500" : "border"
                  }`}
                  readOnly
                />
                {watch("productImage") && (
                  <img
                    src={watch("productImage")}
                    alt="Product preview"
                    className="w-12 h-12 object-cover rounded border border-gray-200"
                  />
                )}
              </div>
              {errors.productImage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productImage.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register("productCategory")}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                  errors.productCategory ? "border-red-500" : "border"
                }`}
              >
                <option value="">Select a category</option>
                {Object.entries(categories).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.productCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productCategory.message}
                </p>
              )}
            </div>

            {/* Quantity and Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("productQuantity", { valueAsNumber: true })}
                  className={`flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                    errors.productQuantity ? "border-red-500" : "border"
                  }`}
                />
                <select
                  {...register("productQuantityUnit")}
                  className={`inline-flex items-center rounded-r-md border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm p-2.5 ${
                    errors.productQuantityUnit ? "border-red-500" : "border"
                  }`}
                >
                  <option value="">Unit</option>
                  {Object.entries(units).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              {errors.productQuantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productQuantity.message}
                </p>
              )}
              {errors.productQuantityUnit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productQuantityUnit.message}
                </p>
              )}
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("productMinStockAmount", { valueAsNumber: true })}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                  errors.productMinStockAmount ? "border-red-500" : "border"
                }`}
              />
              {errors.productMinStockAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productMinStockAmount.message}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                min={minExpiryDate}
                {...register("productExpireDate")}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                  errors.productExpireDate ? "border-red-500" : "border"
                }`}
              />
              {errors.productExpireDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productExpireDate.message}
                </p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier *
              </label>
              <input
                type="text"
                {...register("supplier")}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                  errors.supplier ? "border-red-500" : "border"
                }`}
              />
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.supplier.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                {...register("location")}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${
                  errors.location ? "border-red-500" : "border"
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {item ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditItemModal;
