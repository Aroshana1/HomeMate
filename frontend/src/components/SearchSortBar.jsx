// components/SearchSortBar.jsx
const SearchSortBar = ({
  searchTerm,
  setSearchTerm,
  categories,
  filterCategory,
  setFilterCategory,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
            placeholder="Search products..."
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="sr-only">
          Category
        </label>
        <select
          id="category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
        >
          <option value="all">All Categories</option>
          {Object.keys(categories).map((key) => (
            <option key={key} value={key}>
              {categories[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchSortBar;
