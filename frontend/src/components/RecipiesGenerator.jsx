import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import * as z from "zod";
import { groceryInventory } from "../data/groceryInventoryData.js";

// Define validation schema
const recipeSchema = z.object({
  servings: z.number().min(1).max(20),
  mealCategory: z.string().min(1),
  preferences: z.string().optional(),
  useExpiringSoon: z.boolean().optional(),
});

export default function RecipiesGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      servings: 4,
      mealCategory: "dinner",
      useExpiringSoon: true,
    },
  });

  const mealCategories = [
    "breakfast",
    "lunch",
    "dinner",
    "dessert",
    "snack",
    "appetizer",
    "salad",
    "soup",
  ];

  const onSubmit = async (data) => {
    setIsGenerating(true);
    setGeneratedRecipe("");
    toast.info("Generating recipe...", { autoClose: false });

    try {
      const response = await fetch("/api/v1/recipe/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedRecipe(result.recipe);
        toast.success("Recipe generated successfully!");
      } else {
        // Show more detailed error from backend
        throw new Error(
          result.message || result.error || "Failed to generate recipe"
        );
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Full error:", error);

      // Additional debug info
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate expiring soon items
  const expiringSoonItems = groceryInventory.filter((item) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(item.productExpireDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Generate Recipe from Inventory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Meal Category
              </label>
              <select
                {...register("mealCategory")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mealCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Preferences (optional)
              </label>
              <textarea
                {...register("preferences")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., vegetarian, quick preparation, spicy"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useExpiringSoon"
                {...register("useExpiringSoon")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="useExpiringSoon"
                className="ml-2 block text-sm text-gray-700"
              >
                Prioritize items expiring soon
              </label>
            </div>

            {expiringSoonItems.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800">
                  Items expiring soon:
                </h4>
                <ul className="mt-1 text-xs text-yellow-700">
                  {expiringSoonItems.map((item) => (
                    <li key={item.inventoryItemId}>
                      {item.productName} (expires: {item.productExpireDate})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isGenerating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isGenerating ? "Generating..." : "Generate Recipe"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 min-h-64">
            {generatedRecipe ? (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Generated Recipe
                </h3>
                <div className="whitespace-pre-wrap">{generatedRecipe}</div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p>Generating your recipe...</p>
                  </div>
                ) : (
                  <p>Your generated recipe will appear here</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
