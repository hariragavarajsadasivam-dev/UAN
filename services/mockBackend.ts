import { Candidate, EpfoResponse, VerificationStatus } from "../types";

// Simulated In-Memory Database
let candidates: Candidate[] = [
  {
    id: 'c_1',
    name: 'Priya Singh',
    dob: '1995-08-20',
    aadhaarNumber: '987654321012',
    epfoStatus: VerificationStatus.VERIFIED,
    aadhaarStatus: VerificationStatus.VERIFIED,
    uan: '101234567890',
    aiDecisionConfidence: 0.98,
    submittedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'c_2',
    name: 'Amit Verma',
    dob: '1992-02-10',
    aadhaarNumber: '112233445566',
    epfoStatus: VerificationStatus.MISMATCH,
    aadhaarStatus: VerificationStatus.VERIFIED,
    uan: '109876543210',
    aiDecisionConfidence: 0.45,
    discrepancies: ['Name mismatch in EPFO records'],
    submittedAt: new Date(Date.now() - 12000000).toISOString()
  }
];

export const checkEpfoDatabase = async (aadhaar: string): Promise<EpfoResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulated logic based on mock DB constant or random for demo
  if (aadhaar.includes('1234')) {
    return {
      uanFound: true,
      uan: '100900900123',
      name: 'Rahul Sharma',
      dob: '1990-05-15',
      kycStatus: 'VERIFIED'
    };
  } else if (aadhaar.includes('9999')) {
    return {
      uanFound: false
    };
  } else {
    // Randomize slightly for demo
    return {
      uanFound: true,
      uan: '100' + Math.floor(Math.random() * 100000000),
      name: 'Simulated User', // Likely a mismatch if user enters real name
      dob: '1990-01-01',
      kycStatus: 'NOT_VERIFIED'
    };
  }
};

export const submitCandidateApplication = async (data: Omit<Candidate, 'id' | 'submittedAt' | 'epfoStatus' | 'aadhaarStatus'>): Promise<Candidate> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Perform Server-Side Verification Logic (Simulated)
  const epfoResponse = await checkEpfoDatabase(data.aadhaarNumber);
  
  let epfoStatus = VerificationStatus.PENDING;
  let aadhaarStatus = VerificationStatus.VERIFIED; // Assuming document check passed in frontend via Gemini
  let discrepancies: string[] = [];

  if (!epfoResponse.uanFound) {
    epfoStatus = VerificationStatus.NO_UAN;
  } else {
    const nameMatch = epfoResponse.name?.toLowerCase() === data.name.toLowerCase();
    const dobMatch = epfoResponse.dob === data.dob;

    if (nameMatch && dobMatch) {
      epfoStatus = VerificationStatus.VERIFIED;
    } else {
      epfoStatus = VerificationStatus.MISMATCH;
      if (!nameMatch) discrepancies.push(`Name mismatch: Input(${data.name}) vs EPFO(${epfoResponse.name})`);
      if (!dobMatch) discrepancies.push(`DOB mismatch: Input(${data.dob}) vs EPFO(${epfoResponse.dob})`);
    }
  }

  const newCandidate: Candidate = {
    ...data,
    id: `c_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    epfoStatus,
    aadhaarStatus,
    uan: epfoResponse.uan,
    discrepancies,
    aiDecisionConfidence: epfoStatus === VerificationStatus.VERIFIED ? 0.99 : 0.6
  };

  candidates = [newCandidate, ...candidates];
  return newCandidate;
};

export const getCandidates = async (): Promise<Candidate[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return candidates;
};

export const updateCandidateStatus = async (id: string, status: VerificationStatus): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  candidates = candidates.map(c => c.id === id ? { ...c, epfoStatus: status } : c);
};
