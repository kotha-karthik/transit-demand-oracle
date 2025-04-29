
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to the Network Map page directly
const Index = () => {
  return <Navigate to="/network" replace />;
};

export default Index;
