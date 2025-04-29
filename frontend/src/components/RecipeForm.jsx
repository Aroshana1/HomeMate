import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeSchema } from "../utils/validations";
import { useRecipes } from "../context/RecipeContext";
import { groceryInventory } from "../groceryInventoryData";

const RecipeForm = ({ recipe, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe || {
      recipeName: "",
      recipeImage: "",
      recipeDescription: "",
      recipeCategory: "",
      recipeInstructions: [""],
      ingredients: [],
      numberOfServings: 1,
      prepTime: "",
      cookTime: "",
      difficulty: "Easy",
      tags: [],
    },
  });

  const handleAddInstruction = () => {
    setValue("recipeInstructions", [...watch("recipeInstructions"), ""]);
  };

  const handleRemoveInstruction = (index) => {
    const instructions = watch("recipeInstructions");
    setValue(
      "recipeInstructions",
      instructions.filter((_, i) => i !== index)
    );
  };

  const handleAddIngredient = () => {
    setValue("ingredients", [
      ...watch("ingredients"),
      {
        inventoryItemId: "",
        productName: "",
        quantity: 0,
        quantityUnit: "PC",
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const ingredients = watch("ingredients");
    setValue(
      "ingredients",
      ingredients.filter((_, i) => i !== index)
    );
  };

  const handleIngredientChange = (index, field, value) => {
    const ingredients = [...watch("ingredients")];
    ingredients[index][field] = value;

    // If changing the inventory item, update the product name and unit
    if (field === "inventoryItemId") {
      const selectedItem = groceryInventory.find(
        (item) => item.inventoryItemId === value
      );
      if (selectedItem) {
        ingredients[index].productName = selectedItem.productName;
        ingredients[index].quantityUnit = selectedItem.productQuantityUnit;
      }
    }

    setValue("ingredients", ingredients);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipe Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipe Name
          </label>
          <input
            {...register("recipeName")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
          {errors.recipeName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recipeName.message}
            </p>
          )}
        </div>

        {/* Recipe Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL (optional)
          </label>
          <input
            {...register("recipeImage")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
          {errors.recipeImage && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recipeImage.message}
            </p>
          )}
        </div>
      </div>

      {/* Recipe Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("recipeDescription")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
        {errors.recipeDescription && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recipeDescription.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipe Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("recipeCategory")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          >
            <option value="">Select a category</option>
            {Object.values(recipeCategories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.recipeCategory && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recipeCategory.message}
            </p>
          )}
        </div>

        {/* Number of Servings */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Servings
          </label>
          <input
            type="number"
            {...register("numberOfServings", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
          {errors.numberOfServings && (
            <p className="mt-1 text-sm text-red-600">
              {errors.numberOfServings.message}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            {...register("difficulty")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && (
            <p className="mt-1 text-sm text-red-600">
              {errors.difficulty.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prep Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prep Time
          </label>
          <input
            {...register("prepTime")}
            placeholder="e.g. 15 mins"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
          {errors.prepTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.prepTime.message}
            </p>
          )}
        </div>

        {/* Cook Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cook Time
          </label>
          <input
            {...register("cookTime")}
            placeholder="e.g. 30 mins"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          />
          {errors.cookTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.cookTime.message}
            </p>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Ingredient
          </button>
        </div>

        {watch("ingredients").map((ingredient, index) => (
          <div
            key={index}
            className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-medium text-gray-500">
                Product
              </label>
              <select
                value={ingredient.inventoryItemId}
                onChange={(e) =>
                  handleIngredientChange(
                    index,
                    "inventoryItemId",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              >
                <option value="">Select an ingredient</option>
                {groceryInventory.map((item) => (
                  <option
                    key={item.inventoryItemId}
                    value={item.inventoryItemId}
                  >
                    {item.productName}
                  </option>
                ))}
              </select>
              {errors.ingredients?.[index]?.inventoryItemId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ingredients[index].inventoryItemId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500">
                Quantity
              </label>
              <input
                type="number"
                step="0.1"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(
                    index,
                    "quantity",
                    parseFloat(e.target.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
              />
              {errors.ingredients?.[index]?.quantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ingredients[index].quantity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500">
                Unit
              </label>
              <input
                value={ingredient.quantityUnit}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border bg-gray-100"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        {errors.ingredients &&
          typeof errors.ingredients.message === "string" && (
            <p className="mt-1 text-sm text-red-600">
              {errors.ingredients.message}
            </p>
          )}
      </div>

      {/* Instructions */}
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <button
            type="button"
            onClick={handleAddInstruction}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Instruction
          </button>
        </div>

        {watch("recipeInstructions").map((instruction, index) => (
          <div key={index} className="mt-2 flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500">
                Step {index + 1}
              </label>
              <div className="flex gap-2">
                <textarea
                  {...register(`recipeInstructions.${index}`)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                />
                {watch("recipeInstructions").length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(index)}
                    className="self-end inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              {errors.recipeInstructions?.[index] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.recipeInstructions[index].message}
                </p>
              )}
            </div>
          </div>
        ))}
        {errors.recipeInstructions &&
          typeof errors.recipeInstructions.message === "string" && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recipeInstructions.message}
            </p>
          )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          {...register("tags")}
          placeholder="e.g. vegetarian, quick, healthy"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {recipe ? "Update Recipe" : "Add Recipe"}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
