import React from 'react';
import { VerificationStatus } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case VerificationStatus.VERIFIED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>
      );
    case VerificationStatus.MISMATCH:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" /> Mismatch
        </span>
      );
    case VerificationStatus.NO_UAN:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <AlertTriangle className="w-3 h-3 mr-1" /> New Joiner (No UAN)
        </span>
      );
    case VerificationStatus.REJECTED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>
      );
  }
};

export default StatusBadge;
