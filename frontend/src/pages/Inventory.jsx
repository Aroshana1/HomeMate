import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InventoryTable from "../components/InventoryTable";
import ShoppingList from "../components/ShoppingList";
import {
  productCategories,
  productQuantityUnits,
  groceryInventory,
} from "../data/groceryInventoryData";

import RecipiesGenerator from "../components/RecipiesGenerator";

function Inventory() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [shoppingList, setShoppingList] = useState([]);

  const addToShoppingList = (item) => {
    setShoppingList((prev) => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Grocery Inventory Management</h1>
        <nav className="flex mt-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "inventory"
                ? "bg-white text-green-600"
                : "bg-green-700 text-white"
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "shopping"
                ? "bg-white text-green-600"
                : "bg-green-700 text-white"
            }`}
            onClick={() => setActiveTab("shopping")}
          >
            Shopping List ({shoppingList.length})
          </button>
        </nav>
      </header>

      <main className="container mx-auto p-4">
        {activeTab === "inventory" ? (
          <InventoryTable
            addToShoppingList={addToShoppingList}
            categories={productCategories}
            units={productQuantityUnits}
          />
        ) : (
          <ShoppingList items={shoppingList} setItems={setShoppingList} />
        )}
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Inventory;
