export default function ItemCard({ item, onView, onEdit, onDelete }) {
  const statusColor =
    item.itemStatus === "working"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 overflow-hidden">
        {item.itemImage ? (
          <img
            src={item.itemImage}
            alt={item.itemName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {item.itemName}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
            {item.itemStatus === "working" ? "Working" : "Not Working"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Category:</span> {item.itemCategory}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Location:</span> {item.itemLocation}
        </p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          <span className="font-medium">Note:</span> {item.itemNote}
        </p>

        <div className="flex justify-between items-center">
          <button
            onClick={() => onView(item)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(item)}
              className="text-gray-600 hover:text-gray-800"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(item.itemSerialNo)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
