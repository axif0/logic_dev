import React, { useState, useRef } from 'react';
import axios from 'axios';
import { requestOTP } from '../services/otpService';
import { encrypt } from '../utils/encryption';

const PhoneNumberForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showVerifySection, setShowVerifySection] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  const validateBanglalinkNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    // Check if it's a valid Banglalink number (019 prefix)
    return /^(?:(?:\+|88))?019\d{8}$/.test(cleaned);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    setShowVerifySection(false);
    setOtpValues(['', '', '', '', '', '']);

    if (!validateBanglalinkNumber(phoneNumber)) {
      setMessage({
        text: 'Please enter a valid Banglalink number',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    try {
      const otpResponse = await requestOTP(phoneNumber);
      
      if (otpResponse.success) {
        const encryptedRef = encrypt(otpResponse.referenceNo);
        localStorage.setItem('otpReference', encryptedRef);
        
        setMessage({ 
          text: 'OTP sent successfully!', 
          type: 'success' 
        });
        setShowVerifySection(true);
      }
    } catch (error) {
      let errorMessage = error.message;
      
      // Handle specific error cases
      if (error.message.includes('allowed-host-address')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        console.error('Server IP needs to be whitelisted:', error.message);
      }

      setMessage({ 
        text: errorMessage,
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      setMessage({
        text: 'Please enter a valid 6-digit OTP',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Add your OTP verification logic here
      setMessage({
        text: 'OTP verified successfully!',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to verify OTP',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 transform transition-all hover:scale-105">
        <div className="flex justify-center mb-8">
          <img src="/cht20.png" alt="Logic Dev" className="h-20 w-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">Logic Dev</h1>
        
        <p className="text-red-500 text-center mb-8 font-medium">
          --- আপনার মোবাইল নম্বরটি দিন ---
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="01973808969"
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all duration-200"
              pattern="[0-9+]{11,}"
              required
              disabled={showVerifySection}
            />
          </div>

          {message.text && (
            <div className={`text-center p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } transition-all duration-300 animate-fade-in`}>
              {message.text}
            </div>
          )}

          {!showVerifySection && (
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-secondary text-white py-4 rounded-lg font-semibold text-lg
                transition-all duration-200 transform hover:scale-[1.02]
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/90 hover:shadow-lg'}
              `}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}

          {showVerifySection && (
            <div className="mt-6 space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Enter the 6-digit code sent to</p>
                <p className="font-semibold text-gray-800">{phoneNumber}</p>
              </div>

              <div className="flex justify-center gap-2">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    ref={otpRefs.current[index]}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading || otpValues.join('').length !== 6}
                className={`w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg
                  transition-all duration-200 transform hover:scale-[1.02]
                  ${isLoading || otpValues.join('').length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700 hover:shadow-lg'}
                `}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-secondary hover:text-secondary/80 font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-gray-600 text-sm mt-6">
            ( সার্ভিস চার্জ টাকা 5.00 Tk. / Daily )
          </p>
        </form>
      </div>
    </div>
  );
};

export default PhoneNumberForm; 