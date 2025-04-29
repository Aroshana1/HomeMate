import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "react-toastify";

// Zod schema for validation
const itemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  itemImage: z.string().url("Invalid URL").or(z.literal("")),
  itemCategory: z.string().min(1, "Category is required"),
  itemLocation: z.string().min(1, "Location is required"),
  itemNote: z.string(),
  itemStatus: z.enum(["working", "not working"]),
  warranty: z.string(),
  itemBillImage: z.string().url("Invalid URL").or(z.literal("")),
  ItemUserManual: z.string().url("Invalid URL").or(z.literal("")),
  itemSerialNo: z.string().min(1, "Serial number is required"),
  itemSellerInfo: z.string(),
  purchaseDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  createdBy: z.string().min(1, "Created by is required"),
});

export default function ItemAddItemModal({ isOpen, onClose, item, onSave }) {
  const [formData, setFormData] = useState({
    itemName: "",
    itemImage: "",
    itemCategory: "",
    itemLocation: "",
    itemNote: "",
    itemStatus: "working",
    warranty: "",
    itemBillImage: "",
    ItemUserManual: "",
    itemSerialNo: "",
    itemSellerInfo: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    createdBy: "user001",
  });
  const [errors, setErrors] = useState({});

  // Initialize form with item data if editing
  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        itemName: "",
        itemImage: "",
        itemCategory: "",
        itemLocation: "",
        itemNote: "",
        itemStatus: "working",
        warranty: "",
        itemBillImage: "",
        ItemUserManual: "",
        itemSerialNo: "",
        itemSellerInfo: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        createdBy: "user001",
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Validate form data
      itemSchema.parse(formData);
      onSave(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {item ? "Edit Item" : "Add New Item"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="itemName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item Name*
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.itemName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.itemName && (
                  <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="itemCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category*
                </label>
                <input
                  type="text"
                  id="itemCategory"
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.itemCategory ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.itemCategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.itemCategory}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="itemLocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location*
                </label>
                <input
                  type="text"
                  id="itemLocation"
                  name="itemLocation"
                  value={formData.itemLocation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.itemLocation ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.itemLocation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.itemLocation}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="itemStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status*
                </label>
                <select
                  id="itemStatus"
                  name="itemStatus"
                  value={formData.itemStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="working">Working</option>
                  <option value="not working">Not Working</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="itemSerialNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Serial Number*
                </label>
                <input
                  type="text"
                  id="itemSerialNo"
                  name="itemSerialNo"
                  value={formData.itemSerialNo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.itemSerialNo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.itemSerialNo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.itemSerialNo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="purchaseDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Purchase Date*
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.purchaseDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.purchaseDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.purchaseDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="warranty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Warranty Info
                </label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="e.g., 2 years (expires 2025-12-15)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="itemSellerInfo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seller Info
                </label>
                <input
                  type="text"
                  id="itemSellerInfo"
                  name="itemSellerInfo"
                  value={formData.itemSellerInfo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="itemNote"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="itemNote"
                  name="itemNote"
                  value={formData.itemNote}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="itemImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image URL
                </label>
                <input
                  type="url"
                  id="itemImage"
                  name="itemImage"
                  value={formData.itemImage}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.itemImage ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.itemImage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.itemImage}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="itemBillImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bill Image URL
                </label>{" "}
                <input
                  type="url"
                  id="itemBillImage"
                  name="itemBillImage"
                  value={formData.itemBillImage}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.itemBillImage ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.itemBillImage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.itemBillImage}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ItemUserManual"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item User Manual
                </label>{" "}
                <input
                  type="url"
                  id="ItemUserManual"
                  name="ItemUserManual"
                  value={formData.ItemUserManual}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.ItemUserManual ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.ItemUserManual && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ItemUserManual}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {item ? "Update Item" : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
