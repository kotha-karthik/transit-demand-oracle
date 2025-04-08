
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary-foreground"
          >
            <path 
              d="M8 18L12 22L16 18M12 2V22M19 9H5C3.89543 9 3 8.10457 3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7C21 8.10457 20.1046 9 19 9Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold">Metro Flow Forecast</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/city-analysis" className="hover:underline">City Analysis</Link></li>
            <li><Link to="/" className="hover:underline">Predictions</Link></li>
            <li><Link to="/" className="hover:underline">Documentation</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
