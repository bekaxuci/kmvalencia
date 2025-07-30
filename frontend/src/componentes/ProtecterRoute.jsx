import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userData = localStorage.getItem("user");

  // Si no hay datos, redirige a inicio
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  // Si hay datos, intenta parsear
  try {
    const user = JSON.parse(userData);
    // Puedes agregar validaciones aquí si es necesario

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
