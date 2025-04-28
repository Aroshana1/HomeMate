// src/utils/links.js
import React from "react";
import { FaHome, FaCogs, FaBox, FaUsers } from "react-icons/fa";
import {
  MdInventory2,
  MdOutlineShoppingCartCheckout,
  MdSettings,
} from "react-icons/md";
import { GiMeal, GiHotMeal, GiRiceCooker, GiFruitBowl } from "react-icons/gi";

const Links = [
  {
    text: "Overview",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    text: "Grocery Inventory",

    path: "/dashboard/inventory",
    icon: <MdInventory2 />,
  },

  {
    text: "Meal Plans",
    path: "/dashboard/meals",
    icon: <GiMeal />,
  },

  {
    text: "Recipe",
    path: "/dashboard/recipes",
    icon: <GiHotMeal />,
  },

  {
    text: "Household Items",
    path: "dashboard/householditems",
    icon: <GiRiceCooker />,
    subLinks: [
      { text: "Equipments", path: "/dashboard/householditems" },
      { text: "Tasks", path: "/dashboard/tasks" },
      { text: "Utilities", path: "/dashboard/utility" },
    ],
  },

  {
    text: "Manage App ",
    path: "manageapp",
    icon: <MdSettings />,
  },

  {
    text: "Recipe Generator",
    path: "recipe-generator",
    icon: <GiFruitBowl />,
  },

  {
    text: "User Profile",
    path: "profile",
    icon: <FaUsers />,
  },
];

export default Links;
