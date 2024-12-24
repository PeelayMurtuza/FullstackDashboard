import React, { useState } from 'react';
import axios from 'axios';

const Signin = () => {
  // State management for form fields, error messages, and success messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle the form submission for signin
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit
    setError('');
    setMessage('');

    try {
      // API request to the backend for signin
      const response = await axios.post('http://localhost:3000/signin', {
        email,
        password,
      });

      // Handle success response
      setMessage(response.data.message || 'Signin successful');
    } catch (err) {
      // Handle error response
      console.error('Signin Error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Error signing in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Signin</h2>
        
        {/* Display error message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Display success message */}
        {message && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded-md text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSignin} className="space-y-4">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200"
          >
            Signin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
