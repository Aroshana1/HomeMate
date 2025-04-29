import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  recipeData,
  recipeCategories,
  getRecipesWithExpiringIngredients,
  getRecipesWithLowStockIngredients,
} from "../data/recipeData";
import RecipeList from "./RecipeList";
import RecipeModal from "./RecipeModal";
import SearchAndFilter from "./SearchAndFilter";

const RecipeDashboard = () => {
  const [recipes, setRecipes] = useState(recipeData);
  const [filteredRecipes, setFilteredRecipes] = useState(recipeData);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  // Filter functions
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    filterRecipes();
  }, [
    searchTerm,
    categoryFilter,
    difficultyFilter,
    timeFilter,
    tagFilter,
    recipes,
  ]);

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.recipeDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          recipe.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (recipe) => recipe.recipeCategory === categoryFilter
      );
    }

    if (difficultyFilter) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === difficultyFilter
      );
    }

    if (timeFilter) {
      const [minTime, maxTime] = timeFilter.split("-").map(Number);
      filtered = filtered.filter((recipe) => {
        const prepTime = parseInt(recipe.prepTime);
        const cookTime = parseInt(recipe.cookTime);
        const totalTime = prepTime + cookTime;
        return totalTime >= minTime && totalTime <= maxTime;
      });
    }

    if (tagFilter) {
      filtered = filtered.filter((recipe) => recipe.tags.includes(tagFilter));
    }

    setFilteredRecipes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleAddRecipe = () => {
    setSelectedRecipe(null);
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteRecipe = (recipeId) => {
    setRecipes(recipes.filter((recipe) => recipe.recipeID !== recipeId));
    toast.success("Recipe deleted successfully");
  };

  const handleSaveRecipe = (recipe) => {
    if (selectedRecipe) {
      // Update existing recipe
      setRecipes(
        recipes.map((r) => (r.recipeID === recipe.recipeID ? recipe : r))
      );
      toast.success("Recipe updated successfully");
    } else {
      // Add new recipe
      const newRecipe = {
        ...recipe,
        recipeID: `REC${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setRecipes([...recipes, newRecipe]);
      toast.success("Recipe added successfully");
    }
    setIsModalOpen(false);
  };

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Special filters
  const showExpiringRecipes = () => {
    setFilteredRecipes(getRecipesWithExpiringIngredients());
  };

  const showLowStockRecipes = () => {
    setFilteredRecipes(getRecipesWithLowStockIngredients());
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDifficultyFilter("");
    setTimeFilter("");
    setTagFilter("");
    setFilteredRecipes(recipes);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Recipe Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <button
          onClick={handleAddRecipe}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Recipe
        </button>

        <div className="flex gap-2">
          <button
            onClick={showExpiringRecipes}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Expiring Ingredients
          </button>
          <button
            onClick={showLowStockRecipes}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Low Stock Ingredients
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        recipeCategories={recipeCategories}
      />

      <RecipeList
        recipes={currentRecipes}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
      />

      {filteredRecipes.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 border-t border-b border-gray-300 ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                paginate(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No recipes found matching your criteria
          </p>
        </div>
      )}

      {isModalOpen && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRecipe}
        />
      )}
    </div>
  );
};

export default RecipeDashboard;
