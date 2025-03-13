import axios from 'axios';

export const requestOTP = async (phoneNumber) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log('Frontend formatted number:', formattedNumber);
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/submit-phone`, {
      phoneNumber: formattedNumber
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Backend response:', response.data);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('OTP Request Error:', {
      message: error.message,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.error || error.message);
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
  
  console.log('Phone formatting:', {
    input: number,
    output: cleaned
  });
  
  return cleaned;
}; 