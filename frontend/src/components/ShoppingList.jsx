import { useState } from "react";
import { toast } from "react-toastify";

const ShoppingList = ({ items, setItems }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheck = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((itemId) => itemId !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const handleRemove = () => {
    const newItems = items.filter(
      (item) => !checkedItems.includes(item.inventoryItemId)
    );
    setItems(newItems);
    setCheckedItems([]);
    toast.success("Selected items removed from shopping list");
  };

  const handleRemoveAll = () => {
    setItems([]);
    setCheckedItems([]);
    toast.success("All items removed from shopping list");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Shopping List</h2>
        <div className="space-x-2">
          {items.length > 0 && checkedItems.length > 0 && (
            <button
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Remove Selected
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Remove All
            </button>
          )}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.inventoryItemId}
              className={`flex items-center p-4 border rounded-lg ${
                checkedItems.includes(item.inventoryItemId)
                  ? "bg-gray-50 border-green-500"
                  : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={checkedItems.includes(item.inventoryItemId)}
                onChange={() => handleCheck(item.inventoryItemId)}
                className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.productName}
                  </h3>
                  <span className="text-gray-600">
                    Need: {item.neededQuantity} {item.productQuantityUnit}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.productCategory}</p>
                <p className="text-sm text-gray-500">
                  Current: {item.productQuantity} {item.productQuantityUnit}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No items in shopping list
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add items to your shopping list when they're low in stock.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
