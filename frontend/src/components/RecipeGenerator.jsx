import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import * as z from "zod";
import axios from "axios";

// Schema for form validation
const recipeSchema = z.object({
  servings: z.number().min(1).max(20),
  mealType: z.string().min(1, "Please select a meal type"),
  dietary: z.string().optional(),
  priorityExpiring: z.boolean().optional(),
  useLowStock: z.boolean().optional(),
});

const RecipeGenerator = ({ inventory }) => {
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      servings: 4,
      priorityExpiring: true,
      useLowStock: true,
    },
  });

  // Toggle ingredient selection
  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Sort inventory by expiration date (soonest first)
  const sortedInventory = [...inventory].sort(
    (a, b) => new Date(a.productExpireDate) - new Date(b.productExpireDate)
  );

  const onSubmit = async (data) => {
    if (selectedIngredients.length === 0) {
      toast.error("Please select at least one ingredient");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Generating recipe...");

      const response = await axios.post("/api/v1/recipes/generate", {
        ingredients: selectedIngredients,
        preferences: data,
      });

      setGeneratedRecipe(response.data.recipe);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast.error("Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Recipe Generator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingredients Selection */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Available Ingredients
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedInventory.map((item) => (
                <div
                  key={item.inventoryItemId}
                  onClick={() => toggleIngredient(item.productName)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedIngredients.includes(item.productName)
                      ? "bg-blue-100 border border-blue-300"
                      : "hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.productName}</span>
                    <span className="text-sm text-gray-500">
                      {item.productQuantity} {item.productQuantityUnit}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Expires:{" "}
                    {new Date(item.productExpireDate).toLocaleDateString()}
                    {item.isLowStock && (
                      <span className="ml-2 text-red-500">(Low Stock)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Selected: {selectedIngredients.length} ingredients
            </div>
          </div>
        </div>

        {/* Recipe Preferences Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Servings
              </label>
              <input
                type="number"
                {...register("servings", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.servings.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                {...register("mealType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Preferences
              </label>
              <select
                {...register("dietary")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="low-carb">Low-Carb</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="priorityExpiring"
                {...register("priorityExpiring")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="priorityExpiring"
                className="ml-2 block text-sm text-gray-700"
              >
                Prioritize soon-to-expire ingredients
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useLowStock"
                {...register("useLowStock")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="useLowStock"
                className="ml-2 block text-sm text-gray-700"
              >
                Use low-stock items first
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate Recipe"}
            </button>
          </form>
        </div>

        {/* Generated Recipe */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg h-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Generated Recipe
            </h3>
            {generatedRecipe ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans">
                  {generatedRecipe}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                {isLoading
                  ? "Generating your recipe..."
                  : "Your recipe will appear here after generation"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
