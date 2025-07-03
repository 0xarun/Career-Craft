import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Paper,
  LinearProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as TrophyIcon,
  Psychology as PsychologyIcon,
  Work as WorkIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const OnboardingQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/onboarding-questions/');
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch questions');
      setLoading(false);
    }
  };

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: value
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfetti(true);
      // Submit all answers
      try {
        const answerPromises = Object.entries(answers).map(([questionId, answer]) =>
          axios.post('/api/onboarding-answers/', {
            question: questionId,
            answer: answer
          })
        );
        await Promise.all(answerPromises);
        // Navigate to the recommendations page after submitting answers
        setTimeout(() => navigate('/onboarding/recommendation'), 2000);
      } catch (err) {
        setError('Failed to submit answers');
        console.error('Error submitting answers:', err);
      }
    }
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'yes_no':
        return <PsychologyIcon />;
      case 'multi_choice':
        return <WorkIcon />;
      case 'scale_1_5':
        return <SchoolIcon />;
      default:
        return <PsychologyIcon />;
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    const questionVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    };

    switch (question.type) {
      case 'yes_no':
        return (
          <motion.div
            variants={questionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ fontSize: '1.2rem', mb: 2 }}>
                {question.text}
              </FormLabel>
              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(e.target.value === 'true')}
                sx={{ gap: 2 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                    bgcolor: answers[question.id] === true ? 'primary.light' : 'background.paper',
                    color: answers[question.id] === true ? 'white' : 'text.primary',
                  }}
                  onClick={() => handleAnswer(true)}
                >
                  <CardContent>
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                      sx={{ width: '100%', m: 0 }}
                    />
                  </CardContent>
                </Card>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                    bgcolor: answers[question.id] === false ? 'primary.light' : 'background.paper',
                    color: answers[question.id] === false ? 'white' : 'text.primary',
                  }}
                  onClick={() => handleAnswer(false)}
                >
                  <CardContent>
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                      sx={{ width: '100%', m: 0 }}
                    />
                  </CardContent>
                </Card>
              </RadioGroup>
            </FormControl>
          </motion.div>
        );

      case 'multi_choice':
        return (
          <motion.div
            variants={questionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ fontSize: '1.2rem', mb: 2 }}>
                {question.text}
              </FormLabel>
              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                sx={{ gap: 2 }}
              >
                {question.options.map((option) => (
                  <Card
                    key={option}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                      bgcolor: answers[question.id] === option ? 'primary.light' : 'background.paper',
                      color: answers[question.id] === option ? 'white' : 'text.primary',
                    }}
                    onClick={() => handleAnswer(option)}
                  >
                    <CardContent>
                      <FormControlLabel
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{ width: '100%', m: 0 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>
          </motion.div>
        );

      case 'scale_1_5':
        return (
          <motion.div
            variants={questionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ fontSize: '1.2rem', mb: 2 }}>
                {question.text}
              </FormLabel>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={answers[question.id] || 3}
                  onChange={(_, value) => handleAnswer(value)}
                  min={1}
                  max={5}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                  ]}
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                    },
                    '& .MuiSlider-track': {
                      height: 8,
                    },
                    '& .MuiSlider-rail': {
                      height: 8,
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">Not at all</Typography>
                  <Typography variant="caption" color="text.secondary">Very much</Typography>
                </Box>
              </Box>
            </FormControl>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </motion.div>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {getQuestionIcon(questions[currentQuestionIndex]?.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(currentQuestionIndex / questions.length) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          {renderQuestion()}
        </AnimatePresence>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            sx={{ borderRadius: 2 }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            endIcon={currentQuestionIndex === questions.length - 1 ? <TrophyIcon /> : <ArrowForwardIcon />}
            onClick={handleNext}
            disabled={!answers[questions[currentQuestionIndex]?.id]}
            sx={{
              borderRadius: 2,
              px: 4,
              background: currentQuestionIndex === questions.length - 1
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'primary.main',
              '&:hover': {
                background: currentQuestionIndex === questions.length - 1
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'primary.dark',
              },
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 3,
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          {questions[currentQuestionIndex]?.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
            />
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default OnboardingQuestions; 