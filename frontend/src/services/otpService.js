import axios from 'axios';

export const requestOTP = async (phoneNumber) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log('Formatted number:', formattedNumber);
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/submit-phone`, {
      phoneNumber: formattedNumber
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('OTP Request Error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to request OTP');
  }
};

export const verifyOTP = async (phoneNumber, otp, referenceNo) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, {
      phoneNumber,
      otp,
      referenceNo
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to verify OTP');
  }
};

const formatPhoneNumber = (number) => {
  let cleaned = number.replace(/\D/g, '');
  
  if (cleaned.startsWith('88')) {
    cleaned = cleaned.slice(2);
  }
  
  return cleaned;
}; 