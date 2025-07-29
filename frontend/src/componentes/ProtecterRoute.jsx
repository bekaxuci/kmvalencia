import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userData = localStorage.getItem("user");
  console.log("userData from localStorage:", userData);

  // Si no hay datos, redirige a inicio
  if (!userData) {
    console.log("No user data, redirecting...");
    return <Navigate to="/" replace />;
  }

  // Si hay datos, intenta parsear
  try {
    const user = JSON.parse(userData);
    console.log("Parsed user:", user);
    // Aquí puedes agregar validaciones extra si quieres

    return <Outlet />;
  } catch (error) {
    console.log("Error parsing userData:", error);
    // Si el JSON está mal, limpia localStorage y redirige
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
