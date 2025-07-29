import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import App from "./App";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./componentes/ResetPasswordPage";
import Header from "./componentes/Header";

const AppRouter = () => {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
