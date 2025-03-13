import React, { useState } from 'react';
import axios from 'axios';

const PhoneNumberForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    console.log('Submitting phone number:', phoneNumber); // Debug log

    try {
      console.log('Making API call...'); // Debug log
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/submit-phone`, {
        phoneNumber: phoneNumber.trim()
      }, {
        timeout: 8000, // Increased to 8 seconds
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('API Response:', response.data); // Debug log

      if (response.data.success) {
        setMessage({ 
          text: 'Phone number submitted successfully!', 
          type: 'success' 
        });
        setPhoneNumber(''); // Clear the input
      }
    } catch (error) {
      console.error('Error details:', error); // Debug log
      setMessage({ 
        text: error.response?.data?.error || 'Error submitting phone number', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 transform transition-all hover:scale-105">
      <div className="flex justify-center mb-6">
        <img src="/cht20.png" alt="Logic Dev" className="h-16 w-auto" />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2">Logic Dev</h1>
      
      <p className="text-red-500 text-center mb-6">
        --- আপনার মোবাইল নম্বরটি দিন ---
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="8801590100831"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            pattern="[0-9]{11,}"
            required
          />
        </div>

        {message.text && (
          <div className={`text-center p-2 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-secondary text-white py-3 rounded-lg font-semibold
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/90'}
          `}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          ( সার্ভিস চার্জ টাকা 5.00 Tk. / Daily )
        </p>
      </form>
    </div>
  );
};

export default PhoneNumberForm; 