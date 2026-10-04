import React from "react";
import { Navigate } from "react-router-dom";
import { ERole } from "../types";

export interface PrivateRouteProps {
  allowedRoles?: (ERole | string)[];
  children?: React.ReactNode;
  element?: React.ReactNode;
  [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles = [],
  children,
}) => {
  const userRole = localStorage.getItem("role");
  if (!userRole) {
    return <Navigate to="/not-found" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
