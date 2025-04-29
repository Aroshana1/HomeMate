import { useState } from "react";
import { FiEdit, FiTrash2, FiShoppingCart, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const RecipeList = ({ recipes, onEdit, onDelete }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleAddToShoppingList = (ingredient) => {
    // In a real app, you would add this to your shopping list state or API
    toast.success(`${ingredient.productName} added to shopping list`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.recipeID}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleRecipeClick(recipe)}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={recipe.recipeImage}
                alt={recipe.recipeName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {recipe.recipeName}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {recipe.recipeCategory}
                </span>
              </div>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {recipe.recipeDescription}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>Prep: {recipe.prepTime}</span>
                <span>Cook: {recipe.cookTime}</span>
                <span>Difficulty: {recipe.difficulty}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Serves: {recipe.numberOfServings}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(recipe);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(recipe.recipeID);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {isModalOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRecipe.recipeName}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="mb-6">
                <img
                  src={selectedRecipe.recipeImage}
                  alt={selectedRecipe.recipeName}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-700 mb-4">
                  {selectedRecipe.recipeDescription}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800">Category</h3>
                    <p>{selectedRecipe.recipeCategory}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Servings</h3>
                    <p>{selectedRecipe.numberOfServings}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Prep Time</h3>
                    <p>{selectedRecipe.prepTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Cook Time</h3>
                    <p>{selectedRecipe.cookTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Difficulty</h3>
                    <p>{selectedRecipe.difficulty}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className={`p-3 rounded-lg ${
                          ingredient.isLowStock || ingredient.isExpiringSoon
                            ? "bg-red-50 border-l-4 border-red-500"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {ingredient.quantity} {ingredient.quantityUnit}{" "}
                              {ingredient.productName}
                            </span>
                            {(ingredient.isLowStock ||
                              ingredient.isExpiringSoon) && (
                              <div className="flex gap-2 mt-1">
                                {ingredient.isLowStock && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    Low Stock
                                  </span>
                                )}
                                {ingredient.isExpiringSoon && (
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                    Expiring Soon
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {(ingredient.isLowStock ||
                            ingredient.isExpiringSoon) && (
                            <button
                              onClick={() =>
                                handleAddToShoppingList(ingredient)
                              }
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <FiShoppingCart size={16} />
                              <span className="text-sm">Add</span>
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Instructions
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {selectedRecipe.recipeInstructions.map(
                      (instruction, index) => (
                        <li key={index} className="text-gray-700">
                          {instruction}
                        </li>
                      )
                    )}
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeList;
