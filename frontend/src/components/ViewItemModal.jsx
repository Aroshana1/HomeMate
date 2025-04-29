export default function ViewItemModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  const warrantyStatus = item.warranty.includes("expired")
    ? "Expired"
    : item.warranty.includes("expires")
    ? "Active"
    : "Unknown";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Item Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
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
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.itemName}
              </h3>
              <div className="flex items-center mb-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.itemStatus === "working"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.itemStatus === "working" ? "Working" : "Not Working"}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    warrantyStatus === "Expired"
                      ? "bg-red-100 text-red-800"
                      : warrantyStatus === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {warrantyStatus} Warranty
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-sm font-medium">{item.itemCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium">{item.itemLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="text-sm font-medium">{item.itemSerialNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="text-sm font-medium">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Warranty Information</p>
                  <p className="text-sm font-medium">{item.warranty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller Information</p>
                  <p className="text-sm font-medium">{item.itemSellerInfo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm font-medium">
                    {item.itemNote || "No notes available"}
                  </p>
                </div>
                {item.itemBillImage && (
                  <div>
                    <p className="text-sm text-gray-500">Bill Image</p>
                    <a
                      href={item.itemBillImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Bill
                    </a>
                  </div>
                )}

                {item.ItemUserManual && (
                  <div>
                    <p className="text-sm text-gray-500">Item User Manual</p>
                    <a
                      href={item.ItemUserManual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View User Manual
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
