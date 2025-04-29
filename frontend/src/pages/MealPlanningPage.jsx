import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MealLists from "../components/MealLists"; // Fixed import name (was MealList)
import MealForm from "../components/MealForm";
import {
  mealCategories,
  getMealsByDate,
  getMealsByDateRange,
  calculateWeeklyCost,
} from "../data/mealData";
import { recipeData } from "../data/recipeData";

const getStartOfWeek = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().split("T")[0];
};

const MealPlanningPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [viewMode, setViewMode] = useState("day");

  const weeklyCost = calculateWeeklyCost(getStartOfWeek(selectedDate));

  useEffect(() => {
    loadMeals();
  }, [selectedDate, viewMode]);

  const loadMeals = () => {
    if (viewMode === "day") {
      setMeals(getMealsByDate(selectedDate));
    } else {
      const startDate = getStartOfWeek(selectedDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      setMeals(
        getMealsByDateRange(startDate, endDate.toISOString().split("T")[0])
      );
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowForm(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleDeleteMeal = (mealId) => {
    // In a real app, you would make an API call here
    const updatedMeals = meals.filter((meal) => meal.mealId !== mealId);
    setMeals(updatedMeals);
    toast.success("Meal deleted successfully!");
  };

  const handleFormSubmit = (mealData) => {
    if (editingMeal) {
      // Update existing meal
      const updatedMeals = meals.map((meal) =>
        meal.mealId === editingMeal.mealId ? mealData : meal
      );
      setMeals(updatedMeals);
      toast.success("Meal updated successfully!");
    } else {
      // Add new meal
      setMeals([...meals, mealData]);
      toast.success("Meal added successfully!");
    }
    setShowForm(false);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "day" ? "week" : "day");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Meal Calendar</h2>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="border-0"
            />
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={toggleViewMode}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {viewMode === "day" ? "Show Week" : "Show Day"}
              </button>
              <button
                onClick={handleAddMeal}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Add Meal
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-2">Week Summary</h2>
            <p className="text-lg font-semibold">
              Total Cost: ${weeklyCost.toFixed(2)}
            </p>
            <div className="mt-4">
              {Object.values(mealCategories).map((category) => (
                <div
                  key={category}
                  className="flex justify-between py-2 border-b"
                >
                  <span>{category}</span>
                  <span>
                    {
                      meals.filter((meal) => meal.mealCategory === category)
                        .length
                    }{" "}
                    meals
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">
              {viewMode === "day"
                ? `Meals for ${new Date(selectedDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}`
                : `Meals for Week of ${new Date(
                    getStartOfWeek(selectedDate)
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}`}
            </h2>

            <MealLists
              meals={meals}
              viewMode={viewMode}
              onEdit={handleEditMeal}
              onDelete={handleDeleteMeal}
            />
          </div>
        </div>
      </div>

      {showForm && (
        <MealForm
          meal={editingMeal}
          date={selectedDate}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          recipes={recipeData}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MealPlanningPage;
