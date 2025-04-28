import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecipeDashboard from "./components/RecipeDashboard";
import RecipiesGenerator from "./components/RecipiesGenerator";
import "./App.css";

import {
  Errors,
  DashboardLayout,
  ProductLayout,
  Register,
  Login,
  Inventory,
  Recipe,
  MealPlanningPage,
  HouseHoldItems,
  Tasks,
  Utility,
  UserProfile,
  HomePage,
  Stats,
  ManageApp,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,

    errorElement: <Errors />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Stats />,
      },
      {
        path: "products",
        element: <ProductLayout />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "recipes",
        element: <RecipeDashboard />,
      },
      {
        path: "meals",
        element: <MealPlanningPage />,
      },
      {
        path: "householditems",
        element: <HouseHoldItems />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "utility",
        element: <Utility />,
      },
      {
        path: "ManageApp",
        element: <ManageApp />,
      },

      {
        path: "profile",
        element: <UserProfile />,
      },

      {
        path: "recipe-generator",
        element: <RecipiesGenerator />,
      },
    ],
  },
  {
    path: "/register",
    element: <UserProfile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
