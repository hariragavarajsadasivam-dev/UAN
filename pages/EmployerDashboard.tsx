import React, { useEffect, useState } from 'react';
import { getCandidates } from '../services/mockBackend';
import { Candidate, VerificationStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { RefreshCw, Search, Filter, ShieldCheck, UserPlus, AlertOctagon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const EmployerDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | VerificationStatus>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getCandidates();
    setCandidates(data);
    setLoading(false);
  };

  const filteredCandidates = candidates.filter(c => 
    filter === 'ALL' ? true : c.epfoStatus === filter
  );

  const stats = {
    total: candidates.length,
    verified: candidates.filter(c => c.epfoStatus === VerificationStatus.VERIFIED).length,
    mismatch: candidates.filter(c => c.epfoStatus === VerificationStatus.MISMATCH).length,
    newJoiner: candidates.filter(c => c.epfoStatus === VerificationStatus.NO_UAN).length,
  };

  const chartData = [
    { name: 'Verified', value: stats.verified, color: '#10B981' },
    { name: 'Mismatch', value: stats.mismatch, color: '#F59E0B' },
    { name: 'New Joiner', value: stats.newJoiner, color: '#3B82F6' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Real-time verification status for new hires.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" onClick={fetchData} isLoading={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="primary">Export Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Processed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full text-gray-600">
            <Search className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Verified Matches</p>
            <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">New Joiners</p>
            <p className="text-2xl font-bold text-blue-600">{stats.newJoiner}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Attention Needed</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.mismatch}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Candidate Queue</h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="ALL">All Status</option>
                <option value={VerificationStatus.VERIFIED}>Verified</option>
                <option value={VerificationStatus.MISMATCH}>Mismatch</option>
                <option value={VerificationStatus.NO_UAN}>New Joiner</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">ID: {candidate.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(candidate.submittedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={candidate.epfoStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.aiDecisionConfidence ? (
                        <div className="flex items-center">
                          <div className={`h-2 w-16 rounded-full mr-2 ${candidate.aiDecisionConfidence > 0.8 ? 'bg-green-200' : 'bg-yellow-200'}`}>
                            <div 
                              className={`h-2 rounded-full ${candidate.aiDecisionConfidence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                              style={{ width: `${candidate.aiDecisionConfidence * 100}%` }}
                            ></div>
                          </div>
                          {Math.round(candidate.aiDecisionConfidence * 100)}%
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium">Details</button>
                    </td>
                  </tr>
                ))}
                {filteredCandidates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No candidates found matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics/Details Panel */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Overview</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             {chartData.map((d) => (
               <div key={d.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center">
                   <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                   <span className="text-gray-600">{d.name}</span>
                 </div>
                 <span className="font-semibold text-gray-900">{d.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
