// Separate objects for categories and quantity units
const productCategories = {
  FRUITS: "Fruits",
  VEGETABLES: "Vegetables",
  DAIRY: "Dairy",
  MEAT: "Meat & Poultry",
  BAKERY: "Bakery",
  BEVERAGES: "Beverages",
  SNACKS: "Snacks",
  FROZEN: "Frozen Foods",
  CANNED: "Canned Goods",
  CONDIMENTS: "Condiments & Spices",
  GRAINS: "Grains & Pasta",
  BREAKFAST: "Breakfast",
  HOUSEHOLD: "Household Essentials",
  PERSONAL_CARE: "Personal Care",
};

const productQuantityUnits = {
  KG: "Kilogram",
  G: "Gram",
  L: "Liter",
  ML: "Milliliter",
  PC: "Piece",
  PACK: "Pack",
  BOTTLE: "Bottle",
  CAN: "Can",
  BOX: "Box",
  BAG: "Bag",
};

// Product data array
const products = [
  {
    productId: 1,
    productName: "Red Apple",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg",
    productCategory: productCategories.FRUITS,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 2,
    productName: "Banana",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/800px-Banana-Single.jpg",
    productCategory: productCategories.FRUITS,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 3,
    createdBy: "user001",
  },
  {
    productId: 3,
    productName: "Orange",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ambersweet_oranges.jpg/800px-Ambersweet_oranges.jpg",
    productCategory: productCategories.FRUITS,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 4,
    productName: "Carrot",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/CarrotDiversityLg.jpg/800px-CarrotDiversityLg.jpg",
    productCategory: productCategories.VEGETABLES,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 3,
    createdBy: "user001",
  },
  {
    productId: 5,
    productName: "Broccoli",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/800px-Broccoli_and_cross_section_edit.jpg",
    productCategory: productCategories.VEGETABLES,
    productQuantityUnit: productQuantityUnits.PC,
    productMinStockAmount: 4,
    createdBy: "user001",
  },
  {
    productId: 6,
    productName: "Milk",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow%27s_milk.jpg/800px-Cow%27s_milk.jpg",
    productCategory: productCategories.DAIRY,
    productQuantityUnit: productQuantityUnits.L,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 7,
    productName: "Cheddar Cheese",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cheese_32.jpg/800px-Cheese_32.jpg",
    productCategory: productCategories.DAIRY,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 1,
    createdBy: "user001",
  },
  {
    productId: 8,
    productName: "Greek Yogurt",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Yogurt_%281%29.jpg/800px-Yogurt_%281%29.jpg",
    productCategory: productCategories.DAIRY,
    productQuantityUnit: productQuantityUnits.PACK,
    productMinStockAmount: 4,
    createdBy: "user001",
  },
  {
    productId: 9,
    productName: "Chicken Breast",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Chicken_breast_pieces.jpg/800px-Chicken_breast_pieces.jpg",
    productCategory: productCategories.MEAT,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 10,
    productName: "Ground Beef",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/80_lean_ground_beef.jpg/800px-80_lean_ground_beef.jpg",
    productCategory: productCategories.MEAT,
    productQuantityUnit: productQuantityUnits.KG,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 11,
    productName: "Whole Wheat Bread",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fresh_made_bread_05.jpg/800px-Fresh_made_bread_05.jpg",
    productCategory: productCategories.BAKERY,
    productQuantityUnit: productQuantityUnits.PACK,
    productMinStockAmount: 3,
    createdBy: "user001",
  },
  {
    productId: 12,
    productName: "Bagel",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Bagel-Plain-Alt.jpg/800px-Bagel-Plain-Alt.jpg",
    productCategory: productCategories.BAKERY,
    productQuantityUnit: productQuantityUnits.PACK,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 13,
    productName: "Butter Croissant",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Cross_section_of_a_Croissant_-_2019.jpg/800px-Cross_section_of_a_Croissant_-_2019.jpg",
    productCategory: productCategories.BAKERY,
    productQuantityUnit: productQuantityUnits.PC,
    productMinStockAmount: 4,
    createdBy: "user001",
  },
  {
    productId: 14,
    productName: "Cola Soda",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/CocaColaBottle.jpg/800px-CocaColaBottle.jpg",
    productCategory: productCategories.BEVERAGES,
    productQuantityUnit: productQuantityUnits.BOTTLE,
    productMinStockAmount: 4,
    createdBy: "user001",
  },
  {
    productId: 15,
    productName: "Orange Juice",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Orange_juice_1_edit1.jpg/800px-Orange_juice_1_edit1.jpg",
    productCategory: productCategories.BEVERAGES,
    productQuantityUnit: productQuantityUnits.BOTTLE,
    productMinStockAmount: 3,
    createdBy: "user001",
  },
  {
    productId: 16,
    productName: "Mineral Water",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bottled_water.jpg/800px-Bottled_water.jpg",
    productCategory: productCategories.BEVERAGES,
    productQuantityUnit: productQuantityUnits.BOTTLE,
    productMinStockAmount: 5,
    createdBy: "user001",
  },
  {
    productId: 17,
    productName: "Potato Chips",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Lays_Classic.jpg/800px-Lays_Classic.jpg",
    productCategory: productCategories.SNACKS,
    productQuantityUnit: productQuantityUnits.BAG,
    productMinStockAmount: 4,
    createdBy: "user001",
  },
  {
    productId: 18,
    productName: "Chocolate Chip Cookies",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Chocolate_Chip_Cookies_-_kimberlykv.jpg/800px-Chocolate_Chip_Cookies_-_kimberlykv.jpg",
    productCategory: productCategories.SNACKS,
    productQuantityUnit: productQuantityUnits.PACK,
    productMinStockAmount: 3,
    createdBy: "user001",
  },
  {
    productId: 19,
    productName: "Vanilla Ice Cream",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ice_Cream_dessert_02.jpg/800px-Ice_Cream_dessert_02.jpg",
    productCategory: productCategories.FROZEN,
    productQuantityUnit: productQuantityUnits.BOX,
    productMinStockAmount: 2,
    createdBy: "user001",
  },
  {
    productId: 20,
    productName: "Pepperoni Pizza",
    productImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Pizza_pepperoni_1.jpg/800px-Pizza_pepperoni_1.jpg",
    productCategory: productCategories.FROZEN,
    productQuantityUnit: productQuantityUnits.PC,
    productMinStockAmount: 3,
    createdBy: "user001",
  },
];

// Export the data for use in your React components
export { products, productCategories, productQuantityUnits };
