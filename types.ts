export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  MISMATCH = 'MISMATCH',
  NO_UAN = 'NO_UAN',
  REJECTED = 'REJECTED'
}

export interface Candidate {
  id: string;
  name: string;
  dob: string;
  aadhaarNumber: string;
  documentUrl?: string;
  epfoStatus: VerificationStatus;
  aadhaarStatus: VerificationStatus;
  uan?: string;
  aiDecisionConfidence?: number;
  submittedAt: string;
  discrepancies?: string[];
}

export interface EpfoResponse {
  uanFound: boolean;
  uan?: string;
  name?: string;
  dob?: string;
  kycStatus?: 'VERIFIED' | 'NOT_VERIFIED';
}

export interface ExtractedData {
  name: string;
  dob: string;
  aadhaarNumber: string;
  isXml?: boolean;
}
