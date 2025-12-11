import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { extractDocumentData } from '../services/geminiService';
import { submitCandidateApplication } from '../services/mockBackend';
import { VerificationStatus, Candidate } from '../types';

const CandidateOnboarding: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    aadhaarNumber: ''
  });
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [result, setResult] = useState<Candidate | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractionError(null);
    }
  };

  const handleExtraction = async () => {
    if (!file) return;
    setIsLoading(true);
    setExtractionError(null);
    try {
      const extracted = await extractDocumentData(file);
      setFormData({
        name: extracted.name || '',
        dob: extracted.dob || '',
        aadhaarNumber: extracted.aadhaarNumber || ''
      });
      setStep(2);
    } catch (error) {
      setExtractionError("Failed to verify document. Please ensure it's a clear Aadhaar card or XML.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await submitCandidateApplication({
        name: formData.name,
        dob: formData.dob,
        aadhaarNumber: formData.aadhaarNumber,
        aiDecisionConfidence: 0.95 // Simulated from previous step
      });
      setResult(response);
      setStep(3);
    } catch (error) {
      setExtractionError("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Identity Document</h2>
        <p className="text-gray-600 mb-6">
          Please upload your Aadhaar Card (Image/PDF) or Offline KYC XML. 
          Our secure system will verify the details without sending an OTP.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors bg-gray-50">
          <input 
            type="file" 
            id="doc-upload" 
            className="hidden" 
            accept="image/*,application/pdf,text/xml"
            onChange={handleFileChange}
          />
          <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center justify-center">
            {file ? (
              <FileText className="w-12 h-12 text-indigo-600 mb-2" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {file ? file.name : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Supports JPEG, PNG, PDF, XML (Max 5MB)
            </span>
          </label>
        </div>

        {extractionError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            {extractionError}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button 
            disabled={!file} 
            isLoading={isLoading} 
            onClick={handleExtraction}
            className="w-full sm:w-auto"
          >
            Verify & Proceed
          </Button>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">How this works securely:</h4>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Your document is processed locally using secure extraction.</li>
          <li>We check against public records using authorized APIs.</li>
          <li>No OTP is required from your mobile number.</li>
        </ul>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Extracted Details</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Please confirm the details extracted from your document.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhaar Number / Reference ID</label>
            <input
              type="text"
              required
              value={formData.aadhaarNumber}
              onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            />
            <p className="text-xs text-gray-500 mt-1">We do not store your raw Aadhaar number, only the secure hash.</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" type="button" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Confirm & Submit
          </Button>
        </div>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center animate-fade-in">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
      <p className="text-gray-600 mb-6">
        Your details have been securely transmitted to your employer for final approval.
      </p>

      <div className="bg-gray-50 p-4 rounded-md text-left mb-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Verification Result</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">EPFO Status</dt>
            <dd className="mt-1 text-sm text-gray-900 font-semibold">
              {result?.epfoStatus === VerificationStatus.VERIFIED && <span className="text-green-600">Verified Match</span>}
              {result?.epfoStatus === VerificationStatus.NO_UAN && <span className="text-blue-600">No UAN (New Joiner)</span>}
              {result?.epfoStatus === VerificationStatus.MISMATCH && <span className="text-yellow-600">Discrepancy Found</span>}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">UAN</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {result?.uan || "Not Assigned"}
            </dd>
          </div>
          {result?.discrepancies && result.discrepancies.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-red-500">Issues</dt>
              <dd className="mt-1 text-sm text-red-600">
                <ul className="list-disc list-inside">
                  {result.discrepancies.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <Button onClick={() => {
        setStep(1);
        setFile(null);
        setFormData({ name: '', dob: '', aadhaarNumber: '' });
      }}>
        Submit Another Application
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Onboarding</h1>
        <p className="mt-2 text-gray-600">Secure, Paperless, OTP-Free Verification</p>
      </div>
      
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <li key={s} className={`relative ${s !== 3 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center 
                    ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}
                    font-bold text-sm transition-colors duration-200
                  `}>
                    {s}
                  </div>
                  {s !== 3 && (
                    <div className="absolute top-4 left-8 w-full h-0.5 bg-gray-200 sm:w-20 -z-10">
                      <div className={`h-full bg-indigo-600 transition-all duration-300 ${step > s ? 'w-full' : 'w-0'}`}></div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default CandidateOnboarding;
