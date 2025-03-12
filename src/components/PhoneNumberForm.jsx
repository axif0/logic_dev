import React, { useState } from 'react';

const PhoneNumberForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add your submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      alert('Submitted successfully!');
    } catch (error) {
      alert('Error submitting form');
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

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-primary text-white rounded-lg font-medium 
            ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-opacity-90'} 
            transition-all duration-200`}
        >
          {isLoading ? 'Submitting...' : 'SUBMIT'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          ( সার্ভিস চার্জ টাকা 5.00 Tk. / Daily )
        </p>
      </form>
    </div>
  );
};

export default PhoneNumberForm; 