import React from 'react';
import { motion } from 'framer-motion';

const users = [
  { id: 1, username: 'student1', xp: 1200, streak: 5, progress: 'Software Dev (12 days)' },
  { id: 2, username: 'student2', xp: 900, streak: 3, progress: 'UI/UX (7 days)' },
  { id: 3, username: 'student3', xp: 1500, streak: 8, progress: 'Data Analyst (15 days)' },
];

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Panel</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-bold">{user.xp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-yellow-500 font-bold">{user.streak} 🔥</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 