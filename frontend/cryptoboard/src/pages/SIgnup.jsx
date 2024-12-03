import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('User created successfully! Please log in.');
        setTimeout(() => {
          navigate('/login');  // Redirect to the login page after a successful signup
        }, 200);  // Optional: Add a short delay before redirecting
      } else {
        setMessage(data.message || 'Error signing up');
      }
    } catch (err) {
      setMessage('Error connecting to the server');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="custom-bg p-8 rounded shadow">
        <h2 className="text-xl mb-4">Greetings!!</h2>
        <div className="mb-4">
          <label className="block mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
