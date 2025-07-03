import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OnboardingInterests() {
  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      const token = localStorage.getItem('token');
      // Authentication token is not strictly needed to fetch public interests, 
      // but keeping it here in case the endpoint requires authentication later.

      try {
        const response = await fetch('http://localhost:8000/api/interests/');

        if (response.ok) {
          const data = await response.json();
          setInterests(data);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Failed to fetch interests.');
        }
      } catch (err) {
        setError('An error occurred while fetching interests.');
        console.error('Error fetching interests:', err);
      }
      setLoading(false);
    };

    fetchInterests();
  }, []);

  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      // Get selected interest names
      const selectedInterestNames = interests
        .filter(interest => selected.includes(interest.id))
        .map(interest => interest.name);

      // Save selected interests to the user model
      const updateResponse = await fetch('http://localhost:8000/api/users/update_interests/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ interests: selectedInterestNames }),
      });

      if (updateResponse.ok) {
        // If interests are saved successfully, navigate to questions page
        navigate('/onboarding/questions');
      } else {
        const errorData = await updateResponse.json();
        setError(errorData.error || 'Failed to save interests.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred while saving interests.');
      console.error('Error saving interests:', err);
      setLoading(false);
    }
    // setLoading(false) will be called after success or error
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading interests...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">What interests you?</h2>
        <p className="text-gray-500 mb-8 text-center">Select the career fields that excite you most. You can pick up to 7!</p>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-8">
          {interests.map((interest) => (
            <motion.button
              key={interest.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleInterest(interest.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow transition border-2 text-lg font-semibold focus:outline-none
                ${selected.includes(interest.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-100'}
              `}
              disabled={selected.length >= 7 && !selected.includes(interest.id)}
            >
              <span className="text-3xl mb-2">{interest.emoji}</span>
              {interest.name}
            </motion.button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={selected.length === 0 || loading}
          className={`w-full py-3 rounded-2xl font-bold text-lg shadow transition
            ${selected.length === 0 || loading
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}
        >
          {loading ? 'Saving Interests...' : 'Continue'}
        </button>
      </motion.div>
    </div>
  );
} 