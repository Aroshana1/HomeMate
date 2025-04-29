import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { groceryInventory } from "../data/groceryInventoryData";
import { recipeCategories } from "../data/recipeData";

const recipeSchema = z.object({
  recipeName: z.string().min(1, "Recipe name is required"),
  recipeDescription: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  recipeCategory: z.string().min(1, "Category is required"),
  recipeImage: z.string().url("Invalid URL").min(1, "Image URL is required"),
  numberOfServings: z.number().min(1, "Must serve at least 1"),
  prepTime: z.string().min(1, "Prep time is required"),
  cookTime: z.string().min(1, "Cook time is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  recipeInstructions: z
    .array(z.string())
    .min(1, "At least one instruction is required"),
  ingredients: z
    .array(
      z.object({
        inventoryItemId: z.string().min(1, "Ingredient is required"),
        quantity: z.number().min(0.1, "Quantity must be at least 0.1"),
        quantityUnit: z.string().min(1, "Unit is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
});

const RecipeModal = ({ recipe, onClose, onSave }) => {
  const isEditMode = !!recipe;
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [newInstruction, setNewInstruction] = useState("");
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      recipeName: "",
      recipeDescription: "",
      recipeCategory: "",
      recipeImage: "",
      numberOfServings: 1,
      prepTime: "",
      cookTime: "",
      difficulty: "",
      tags: [],
      recipeInstructions: [],
      ingredients: [],
    },
  });

  const formIngredients = watch("ingredients");
  const formInstructions = watch("recipeInstructions");
  const formTags = watch("tags");

  useEffect(() => {
    // Load ingredient options
    const options = groceryInventory.map((item) => ({
      value: item.inventoryItemId,
      label: item.productName,
      unit: item.productQuantityUnit,
    }));
    setIngredientOptions(options);

    // If in edit mode, set form values from recipe
    if (isEditMode) {
      const { ingredients, ...rest } = recipe;
      const formattedIngredients = ingredients.map((ing) => ({
        inventoryItemId: ing.inventoryItemId,
        quantity: ing.quantity,
        quantityUnit: ing.quantityUnit,
      }));
      reset({
        ...rest,
        ingredients: formattedIngredients,
      });
    }
  }, [recipe, isEditMode, reset]);

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setValue("recipeInstructions", [
        ...formInstructions,
        newInstruction.trim(),
      ]);
      setNewInstruction("");
    }
  };

  const handleRemoveInstruction = (index) => {
    setValue(
      "recipeInstructions",
      formInstructions.filter((_, i) => i !== index)
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formTags.includes(newTag.trim())) {
      setValue("tags", [...formTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setValue(
      "tags",
      formTags.filter((t) => t !== tag)
    );
  };

  const handleAddIngredient = () => {
    setValue("ingredients", [
      ...formIngredients,
      { inventoryItemId: "", quantity: 1, quantityUnit: "PC" },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setValue(
      "ingredients",
      formIngredients.filter((_, i) => i !== index)
    );
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formIngredients];
    updatedIngredients[index][field] = value;

    // If changing the ingredient, update the default unit
    if (field === "inventoryItemId") {
      const selectedIngredient = groceryInventory.find(
        (item) => item.inventoryItemId === value
      );
      if (selectedIngredient) {
        updatedIngredients[index].quantityUnit =
          selectedIngredient.productQuantityUnit;
      }
    }

    setValue("ingredients", updatedIngredients);
  };

  const onSubmit = (data) => {
    // Format ingredients with additional data
    const formattedIngredients = data.ingredients.map((ing) => {
      const inventoryItem = groceryInventory.find(
        (item) => item.inventoryItemId === ing.inventoryItemId
      );
      return {
        ...ing,
        productName: inventoryItem.productName,
        isLowStock: inventoryItem.isLowStock,
        isExpiringSoon: isExpiringSoon(inventoryItem.productExpireDate),
      };
    });

    onSave({
      ...data,
      ingredients: formattedIngredients,
      lastUpdated: new Date().toISOString(),
      ...(isEditMode
        ? { recipeID: recipe.recipeID, createdAt: recipe.createdAt }
        : {}),
    });
  };

  const isExpiringSoon = (expireDate) => {
    const today = new Date();
    const expire = new Date(expireDate);
    const timeDiff = expire.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 7;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Edit Recipe" : "Add New Recipe"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name*
                </label>
                <input
                  {...register("recipeName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.recipeName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.recipeName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  {...register("recipeCategory")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {Object.entries(recipeCategories).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors.recipeCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.recipeCategory.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                {...register("recipeDescription")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.recipeDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recipeDescription.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL*
              </label>
              <input
                {...register("recipeImage")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.recipeImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recipeImage.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings*
                </label>
                <input
                  type="number"
                  {...register("numberOfServings", { valueAsNumber: true })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.numberOfServings && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.numberOfServings.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prep Time*
                </label>
                <input
                  {...register("prepTime")}
                  placeholder="e.g. 10 mins"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.prepTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.prepTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cook Time*
                </label>
                <input
                  {...register("cookTime")}
                  placeholder="e.g. 20 mins"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.cookTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cookTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty*
                </label>
                <select
                  {...register("difficulty")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags*
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors"
                >
                  <FiPlus size={18} />
                </button>
              </div>
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients*
              </label>
              {formIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 mb-2 items-end"
                >
                  <div className="col-span-5">
                    <select
                      value={ingredient.inventoryItemId}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "inventoryItemId",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select ingredient</option>
                      {ingredientOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          parseFloat(e.target.value)
                        )
                      }
                      min="0.1"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={ingredient.quantityUnit}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantityUnit",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PC">Piece</option>
                      <option value="KG">Kilogram</option>
                      <option value="G">Gram</option>
                      <option value="L">Liter</option>
                      <option value="ML">Milliliter</option>
                      <option value="Tbsp">Tablespoon</option>
                      <option value="tsp">Teaspoon</option>
                      <option value="CUP">Cup</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                    >
                      <FiMinus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredient}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors"
              >
                <FiPlus size={18} className="inline mr-1" /> Add Ingredient
              </button>
              {errors.ingredients && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ingredients.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions*
              </label>
              <ol className="list-decimal pl-5 mb-2 space-y-1">
                {formInstructions.map((instruction, index) => (
                  <li key={index} className="flex justify-between items-start">
                    <span>{instruction}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FiX size={16} />
                    </button>
                  </li>
                ))}
              </ol>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  placeholder="Add an instruction step"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors"
                >
                  <FiPlus size={18} />
                </button>
              </div>
              {errors.recipeInstructions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recipeInstructions.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? "Update Recipe" : "Save Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
