import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const dummyQuiz = {
  questions: [
    { text: 'What is the main responsibility of a software developer?', options: ['Designing clothes', 'Writing code', 'Cooking food', 'Painting'], answer: 1 },
    { text: 'Which tool is used for version control?', options: ['Git', 'Excel', 'Photoshop', 'Word'], answer: 0 },
    { text: 'What does UI stand for?', options: ['User Interface', 'Unique Idea', 'Ultra Internet', 'Unit Index'], answer: 0 },
    { text: 'Which is a programming language?', options: ['Python', 'Snake', 'Lion', 'Tiger'], answer: 0 },
    { text: 'What is data analysis?', options: ['Studying data', 'Drawing', 'Singing', 'Dancing'], answer: 0 },
    { text: 'What is cybersecurity about?', options: ['Protecting data', 'Making cakes', 'Driving cars', 'Flying planes'], answer: 0 },
    { text: 'Which is a frontend framework?', options: ['React', 'Django', 'Flask', 'Laravel'], answer: 0 },
  ]
};

export default function Challenge() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const question = dummyQuiz.questions[current];
  const total = dummyQuiz.questions.length;

  const handleSelect = (idx) => setSelected(idx);
  const handleNext = () => {
    setAnswers((prev) => [...prev, selected]);
    setSelected(null);
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      navigate(`/challenge/${careerId}/completed`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
      >
        <div className="w-full mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-blue-500 font-bold">Question {current + 1} / {total}</div>
            <div className="text-gray-500 text-sm">Quiz Progress</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="w-full mb-6">
          <div className="text-xl font-bold text-gray-800 mb-4">{question.text}</div>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full px-6 py-3 rounded-2xl border-2 font-semibold text-lg shadow transition focus:outline-none
                  ${selected === idx
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-100'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`w-full py-3 rounded-2xl font-bold text-lg shadow transition
            ${selected === null
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}
        >
          {current < total - 1 ? 'Next' : 'Submit'}
        </button>
      </motion.div>
    </div>
  );
} 