import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ChallengeCompleted() {
  const navigate = useNavigate();
  const xpEarned = 100;
  const streak = 8;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
      >
        <span className="text-5xl mb-4">🎉</span>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Challenge Completed!</h2>
        <div className="text-lg text-gray-600 mb-4 text-center">You earned <span className="text-blue-500 font-bold">{xpEarned} XP</span> today.</div>
        <div className="text-lg text-yellow-500 mb-8 text-center">🔥 Current Streak: <span className="font-bold">{streak} days</span></div>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold text-lg shadow transition"
        >
          Next Day
        </button>
      </motion.div>
    </div>
  );
} 