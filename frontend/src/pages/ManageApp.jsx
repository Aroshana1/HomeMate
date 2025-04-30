import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schemas for each enum type
const enumItemSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .regex(/^[A-Z0-9_]+$/, "Key must be uppercase with underscores"),
  value: z.string().min(1, "Display value is required"),
});

const TABS = {
  PRODUCT_CATEGORIES: "Product Categories",
  QUANTITY_UNITS: "Quantity Units",
  INVENTORY_LOCATIONS: "Inventory Locations",
  RECIPE_CATEGORIES: "Recipe Categories",
};

const ManageApp = () => {
  const [activeTab, setActiveTab] = useState(TABS.PRODUCT_CATEGORIES);
  const [editingId, setEditingId] = useState(null);

  // Initial data states
  const [productCategories, setProductCategories] = useState({
    FRUITS: "Fruits",
    VEGETABLES: "Vegetables",
    DAIRY: "Dairy",
    MEAT: "Meat & Poultry",
    BAKERY: "Bakery",
    BEVERAGES: "Beverages",
    SNACKS: "Snacks",
    FROZEN: "Frozen Foods",
    CANNED: "Canned Goods",
    CONDIMENTS: "Condiments & Spices",
    GRAINS: "Grains & Pasta",
    BREAKFAST: "Breakfast",
    HOUSEHOLD: "Household Essentials",
    PERSONAL_CARE: "Personal Care",
  });

  const [productQuantityUnits, setProductQuantityUnits] = useState({
    KG: "Kilogram",
    G: "Gram",
    L: "Liter",
    ML: "Milliliter",
    PC: "Piece",
    PACK: "Pack",
    BOTTLE: "Bottle",
    CAN: "Can",
    BOX: "Box",
    BAG: "Bag",
  });

  const [inventoryLocations, setInventoryLocations] = useState({
    FREEZER: "Freezer Section",
    REFRIGERATED: "Refrigerated Section",
    BACK_STORAGE: "Back Storage",
  });

  const [recipeCategories, setRecipeCategories] = useState({
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
    DESSERT: "Dessert",
    APPETIZER: "Appetizer",
    SALAD: "Salad",
    SOUP: "Soup",
    BAKED_GOODS: "Baked Goods",
    BEVERAGE: "Beverage",
    OTHER: "Other",
  });

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case TABS.PRODUCT_CATEGORIES:
        return productCategories;
      case TABS.QUANTITY_UNITS:
        return productQuantityUnits;
      case TABS.INVENTORY_LOCATIONS:
        return inventoryLocations;
      case TABS.RECIPE_CATEGORIES:
        return recipeCategories;
      default:
        return {};
    }
  };

  // Get current setter based on active tab
  const getCurrentDataSetter = () => {
    switch (activeTab) {
      case TABS.PRODUCT_CATEGORIES:
        return setProductCategories;
      case TABS.QUANTITY_UNITS:
        return setProductQuantityUnits;
      case TABS.INVENTORY_LOCATIONS:
        return setInventoryLocations;
      case TABS.RECIPE_CATEGORIES:
        return setRecipeCategories;
      default:
        return () => {};
    }
  };

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(enumItemSchema),
  });

  const onSubmit = (data) => {
    const setData = getCurrentDataSetter();
    const currentData = getCurrentData();

    if (editingId) {
      // Update existing item
      const { [editingId]: _, ...rest } = currentData;
      setData({
        ...rest,
        [data.key]: data.value,
      });
    } else {
      // Add new item
      setData({
        ...currentData,
        [data.key]: data.value,
      });
    }

    reset();
    setEditingId(null);
  };

  const handleEdit = (key) => {
    const currentData = getCurrentData();
    setValue("key", key);
    setValue("value", currentData[key]);
    setEditingId(key);
  };

  const handleDelete = (key) => {
    const setData = getCurrentDataSetter();
    const currentData = getCurrentData();
    const { [key]: _, ...rest } = currentData;
    setData(rest);
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Manage Enums</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 bg-gray-50 p-4 rounded-lg"
      >
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Item" : "Add New Item"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              {...register("key")}
              type="text"
              className={`w-full p-2 border rounded ${
                errors.key ? "border-red-500" : "border-gray-300"
              }`}
              disabled={!!editingId}
            />
            {errors.key && (
              <p className="text-red-500 text-xs mt-1">{errors.key.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Value
            </label>
            <input
              {...register("value")}
              type="text"
              className={`w-full p-2 border rounded ${
                errors.value ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.value.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingId ? (
              <FaSave className="mr-2" />
            ) : (
              <FaPlus className="mr-2" />
            )}
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Key</th>
              <th className="py-2 px-4 text-left">Display Value</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(getCurrentData()).map(([key, value]) => (
              <tr key={key} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 font-mono">{key}</td>
                <td className="py-2 px-4">{value}</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(key)}
                      className="p-2 text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(key)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageApp;
