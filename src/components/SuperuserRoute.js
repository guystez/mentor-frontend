import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SuperuserRoute = () => {
  const isAuthenticated = localStorage.getItem('session') === 'logged-in';
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  // If authenticated and isSuperuser, return an outlet that will render child elements
  // If not, return element that will navigate to login page or a not authorized page
  return isAuthenticated && isSuperuser ? <Outlet /> : <Navigate to={isAuthenticated ? "/not-authorized" : "/login"} />;
}

export default SuperuserRoute;
