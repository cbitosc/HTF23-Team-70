import React from "react";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ element, allowedRoles }) => {
  let allString = sessionStorage.getItem("dett");
  let selectedRole = JSON.parse(allString);
  const userRole = selectedRole?.selectedRole;
  if (userRole && allowedRoles === userRole) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};
export default PrivateRoute;
