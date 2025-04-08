
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to London Underground analysis directly
const Index = () => {
  return <Navigate to="/city-analysis" replace />;
};

export default Index;
