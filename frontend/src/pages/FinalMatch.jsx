import React from 'react';
import { motion } from 'framer-motion';

const finalCareer = {
  emoji: '💻',
  title: 'Software Developer',
  description: 'You love building things and solving problems with code. Software development is your perfect match!',
  salary: '$70,000 - $120,000',
  roadmap: '#',
};

export default function FinalMatch() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
      >
        <span className="text-5xl mb-4">{finalCareer.emoji}</span>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{finalCareer.title}</h2>
        <div className="text-lg text-gray-600 mb-4 text-center">{finalCareer.description}</div>
        <div className="text-lg text-blue-500 mb-4 text-center">Salary Range: <span className="font-bold">{finalCareer.salary}</span></div>
        <a
          href={finalCareer.roadmap}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold px-8 py-3 rounded-2xl shadow transition text-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Roadmap
        </a>
      </motion.div>
    </div>
  );
} 