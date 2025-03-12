import React from 'react';
import PhoneNumberForm from './components/PhoneNumberForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-blue-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <PhoneNumberForm />
      </div>
    </div>
  );
}

export default App; 