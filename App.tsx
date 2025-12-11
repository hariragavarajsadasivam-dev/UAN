import React, { useState } from 'react';
import Home from './pages/Home';
import CandidateOnboarding from './pages/CandidateOnboarding';
import EmployerDashboard from './pages/EmployerDashboard';
import { Shield } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'candidate':
        return <CandidateOnboarding />;
      case 'employer':
        return <EmployerDashboard />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VeriFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              {currentPage !== 'home' && (
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
