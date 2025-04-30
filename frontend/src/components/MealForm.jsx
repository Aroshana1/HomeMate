import React, { useState, useEffect } from "react";
import { z } from "zod";
import { ToastContainer } from "react-toastify";
import { isToday, isAfter, parseISO } from "date-fns";
import { mealCategories } from "../data/mealData";

const mealSchema = z.object({
  mealName: z.string().min(1, "Meal name is required"),
  mealCategory: z.string().min(1, "Category is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const selectedDate = parseISO(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare dates only
      return isToday(selectedDate) || isAfter(selectedDate, today);
    }, "Date must be today or in the future"),
  calories: z.number().min(0, "Calories must be positive"),
  cost: z.number().min(0, "Cost must be positive"),
  notes: z.string().optional(),
  isCompleted: z.boolean().optional(),
  recipe: z.any().optional(),
});
//meal form
const MealForm = ({ meal, date, onClose, onSubmit, recipes }) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const [formData, setFormData] = useState({
    mealName: "",
    mealImage: "",
    mealCategory: "",
    date: date || today,
    calories: 0,
    cost: 0,
    notes: "",
    isCompleted: false,
    recipe: null,
  });

  const [errors, setErrors] = useState({});
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);

  useEffect(() => {
    if (meal) {
      setFormData({
        mealName: meal.mealName,
        mealImage: meal.mealImage,
        mealCategory: meal.mealCategory,
        date: meal.date,
        calories: meal.calories || 0,
        cost: meal.cost || 0,
        notes: meal.notes || "",
        isCompleted: meal.isCompleted || false,
        recipe: meal.recipe || null,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        date: date || today,
      }));
    }
  }, [meal, date, today]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const validatedData = mealSchema.parse({
        ...formData,
        calories: Number(formData.calories),
        cost: Number(formData.cost),
      });

      onSubmit({
        ...validatedData,
        mealId: meal?.mealId || `MEAL${Math.floor(Math.random() * 10000)}`,
        createdBy: "user001",
      });
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

  const handleRecipeSelect = (recipe) => {
    setFormData((prev) => ({
      ...prev,
      recipe: recipe,
      mealName: recipe.recipeName,
      mealImage: recipe.recipeImage,
      mealCategory: recipe.recipeCategory,
      calories: recipe.ingredients.reduce(
        (acc, ing) => acc + (ing.calories || 0),
        0
      ),
    }));
    setShowRecipeSelector(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {meal ? "Edit Meal" : "Add New Meal"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  name="mealName"
                  value={formData.mealName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.mealName && (
                  <p className="text-red-500 text-sm">{errors.mealName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="mealCategory"
                  value={formData.mealCategory}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a category</option>
                  {Object.values(mealCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.mealCategory && (
                  <p className="text-red-500 text-sm">{errors.mealCategory}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className="w-full p-2 border rounded"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="mealImage"
                  value={formData.mealImage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded"
                />
                {errors.calories && (
                  <p className="text-red-500 text-sm">{errors.calories}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost ($)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleNumberChange}
                  step="0.01"
                  className="w-full p-2 border rounded"
                />
                {errors.cost && (
                  <p className="text-red-500 text-sm">{errors.cost}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isCompleted"
                    checked={formData.isCompleted}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Meal Completed
                  </span>
                </label>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowRecipeSelector(true)}
                  className="bg-green-100 text-green-500 px-4 py-2 rounded hover:bg-green-200 transition"
                >
                  {formData.recipe ? "Change Recipe" : "Select Recipe"}
                </button>
                {formData.recipe && (
                  <div className="mt-2 text-sm">
                    Selected: {formData.recipe.recipeName}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
              >
                {meal ? "Update Meal" : "Add Meal"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select a Recipe</h2>
                <button
                  onClick={() => setShowRecipeSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.recipeID}
                    onClick={() => handleRecipeSelect(recipe)}
                    className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      {recipe.recipeImage && (
                        <img
                          src={recipe.recipeImage}
                          alt={recipe.recipeName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{recipe.recipeName}</h3>
                        <p className="text-sm text-gray-600">
                          {recipe.recipeCategory}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MealForm;
