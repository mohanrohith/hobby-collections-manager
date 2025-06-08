import React from 'react';

import { useAuth } from '../hooks/useAuth';

import DashboardComponent from '../components/Dashboard/Dashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardComponent userId={user.uid} />
    </div>
  );
};

export default Dashboard;
