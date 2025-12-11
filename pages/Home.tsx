import React from 'react';
import { User, Briefcase, Shield } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Shield className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          VeriFlow
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          The next-gen onboarding platform. Secure, OTP-free verification integrated directly with EPFO and UIDAI systems.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl w-full">
        <button 
          onClick={() => onNavigate('candidate')}
          className="relative group bg-white p-8 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-200 text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">For Candidates</h3>
          </div>
          <p className="text-gray-500">
            Join your new organization seamlessly. Upload your Aadhaar or XML to verify identity instantly without OTP hassles.
          </p>
          <span className="absolute bottom-6 right-8 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Start Onboarding &rarr;
          </span>
        </button>

        <button 
          onClick={() => onNavigate('employer')}
          className="relative group bg-white p-8 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-200 text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
             <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <Briefcase className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">For Employers</h3>
          </div>
          <p className="text-gray-500">
            Manage onboarding queues, view verification statuses, and handle UAN generation/linking from a central dashboard.
          </p>
          <span className="absolute bottom-6 right-8 text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Dashboard &rarr;
          </span>
        </button>
      </div>
      
      <div className="mt-16 text-center text-sm text-gray-400">
        <p>&copy; 2024 VeriFlow Systems. Compliant with UIDAI & EPFO regulations.</p>
      </div>
    </div>
  );
};

export default Home;
