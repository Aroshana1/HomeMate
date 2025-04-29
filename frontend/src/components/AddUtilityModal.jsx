import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";

const utilitySchema = z.object({
  month: z.string().min(1, "Month is required"),
  year: z.number().min(2000).max(2100),
  electricity: z.number().min(0),
  water: z.number().min(0),
  gas: z.number().min(0),
  internet: z.number().min(0),
  trash: z.number().min(0),
  recycling: z.number().min(0),
  paid: z.boolean(),
  paymentDate: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
});

const AddUtilityModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    month: "",
    year: 2025,
    electricity: 0,
    water: 0,
    gas: 0,
    internet: 0,
    trash: 0,
    recycling: 0,
    paid: false,
    paymentDate: "",
    dueDate: "",
    notes: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const calculateTotal = () => {
    return (
      formData.electricity +
      formData.water +
      formData.gas +
      formData.internet +
      formData.trash +
      formData.recycling
    ).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const validatedData = utilitySchema.parse({
        ...formData,
        total: parseFloat(calculateTotal()),
      });
      onSave(validatedData);
      toast.success("Utility record added successfully!");
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center bg-green-600 text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Add New Utility Bill</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.month ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
              {errors.month && (
                <p className="text-red-500 text-xs mt-1">{errors.month}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.year ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electricity (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                name="electricity"
                value={formData.electricity}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.electricity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.electricity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.electricity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Water (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                name="water"
                value={formData.water}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.water ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.water && (
                <p className="text-red-500 text-xs mt-1">{errors.water}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gas (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                name="gas"
                value={formData.gas}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.gas ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.gas && (
                <p className="text-red-500 text-xs mt-1">{errors.gas}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internet (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                name="internet"
                value={formData.internet}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.internet ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.internet && (
                <p className="text-red-500 text-xs mt-1">{errors.internet}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trash (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                name="trash"
                value={formData.trash}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.trash ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.trash && (
                <p className="text-red-500 text-xs mt-1">{errors.trash}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recycling (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                name="recycling"
                value={formData.recycling}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.recycling ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.recycling && (
                <p className="text-red-500 text-xs mt-1">{errors.recycling}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.dueDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="paid"
                checked={formData.paid}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Paid</label>
            </div>
          </div>

          {formData.paid && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.paymentDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.paymentDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.paymentDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Method</option>
                  <option value="Auto-pay">Auto-pay</option>
                  <option value="Online">Online</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="bg-green-50 p-4 rounded-md mb-4">
            <p className="text-lg font-semibold text-green-800">
              Total: LKR{calculateTotal()}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Utility Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUtilityModal;
