// src/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import App from "./App";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRouter;
