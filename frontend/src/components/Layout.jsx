import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';

const Layout = ({ isAuthenticated, onLogout, title }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="p-8 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
