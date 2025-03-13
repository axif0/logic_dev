import axios from 'axios';

export const requestOTP = async (phoneNumber) => {
  try {
    // Format phone number to required format
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    const response = await axios.post('https://api.applink.com.bd/otp/request', {
      applicationId: process.env.REACT_APP_APPLICATION_ID,
      password: process.env.REACT_APP_PASSWORD,
      subscriberId: `tel:${formattedNumber}`,
      action: "1"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.statusDetail || 'Failed to request OTP');
  }
};

const formatPhoneNumber = (number) => {
  // Remove any non-digit characters
  const cleaned = number.replace(/\D/g, '');
  
  // Remove leading '88' if present
  if (cleaned.startsWith('88')) {
    return cleaned.slice(2);
  }
  
  // Remove leading '+88' if present
  if (cleaned.startsWith('88')) {
    return cleaned.slice(2);
  }
  
  return cleaned;
}; 