import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PREFERENCES = [
  {
    id: 'coding',
    label: 'Code vs Non-Code',
    options: [
      { value: 'code', label: 'Code', emoji: '💻' },
      { value: 'non-code', label: 'Non-Code', emoji: '📝' },
    ],
  },
  {
    id: 'creative',
    label: 'Creative vs Analytical',
    options: [
      { value: 'creative', label: 'Creative', emoji: '🎨' },
      { value: 'analytical', label: 'Analytical', emoji: '📈' },
    ],
  },
  {
    id: 'environment',
    label: 'Indoor vs Outdoor',
    options: [
      { value: 'indoor', label: 'Indoor', emoji: '🏢' },
      { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    ],
  },
];

export default function OnboardingPreferences() {
  const [prefs, setPrefs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (prefId, value) => {
    setPrefs((prev) => ({ ...prev, [prefId]: value }));
  };

  const isComplete = Object.keys(prefs).length === PREFERENCES.length;

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
      const response = await fetch('http://localhost:8000/api/users/me/update_preferences/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ preferences: prefs }),
      });

      if (response.ok) {
        navigate('/onboarding/recommendation');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update preferences.');
      }
    } catch (err) {
      setError('An error occurred while saving preferences.');
      console.error('Error updating preferences:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Your Work Preferences</h2>
        <p className="text-gray-500 mb-8 text-center">Help us understand your work style and preferences.</p>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="w-full flex flex-col gap-8 mb-8">
          {PREFERENCES.map((pref, i) => (
            <motion.div
              key={pref.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-gray-50 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="font-semibold text-gray-800 text-lg mb-2 md:mb-0 md:w-1/3 text-center md:text-left">{pref.label}</div>
              <div className="flex gap-4 w-full justify-center">
                {pref.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleToggle(pref.id, opt.value)}
                    className={`flex flex-col items-center px-6 py-3 rounded-2xl border-2 font-semibold text-lg shadow transition focus:outline-none
                      ${prefs[pref.id] === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-100'}
                    `}
                  >
                    <span className="text-2xl mb-1">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={!isComplete || loading}
          className={`w-full py-3 rounded-2xl font-bold text-lg shadow transition
            ${!isComplete || loading
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </motion.div>
    </div>
  );
} 