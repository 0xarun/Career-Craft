import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Container,
  Paper,
  Avatar,
  Button,
  Alert,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  HourglassEmpty as HourglassEmptyIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [careerProgress, setCareerProgress] = useState([]); // Keep career progress to show on selected tracks
  const [selectedCareerTracks, setSelectedCareerTracks] = useState([]); // State for selected tracks details
  const [skillTags, setSkillTags] = useState([]); // State for skill tags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        // Fetch User Data
        const userResponse = await fetch('http://localhost:8000/api/users/me/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!userResponse.ok) {
          const errorData = userResponse.headers.get('content-type')?.includes('application/json') ? await userResponse.json() : { detail: userResponse.statusText };
          setError(`Failed to fetch user data: ${errorData.detail || JSON.stringify(errorData)}`);
          setLoading(false);
          return;
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch Career Progress
         const progressResponse = await fetch('http://localhost:8000/api/progress/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!progressResponse.ok) {
          const errorData = progressResponse.headers.get('content-type')?.includes('application/json') ? await progressResponse.json() : { detail: progressResponse.statusText };
          // Only set error if there's actual progress data expected but failed to fetch
          if (userData.selected_career_paths && userData.selected_career_paths.length > 0) {
             setError(`Failed to fetch career progress: ${errorData.detail || JSON.stringify(errorData)}`);
          }
          // Continue loading other data even if progress fails
        } else {
          const progressData = await progressResponse.json();
          setCareerProgress(progressData);
        }


        // Fetch Selected Career Tracks if available
        if (userData.selected_career_paths && userData.selected_career_paths.length > 0) {
            // Construct query string for fetching multiple tracks by ID
            const trackIdsQuery = userData.selected_career_paths.map(id => `id=${id}`).join('&');
            const selectedTracksResponse = await fetch(`http://localhost:8000/api/career-tracks/?${trackIdsQuery}`, {
                headers: {
                  'Authorization': `Token ${token}`,
                },
            });

            if (selectedTracksResponse.ok) {
                const selectedTracksData = await selectedTracksResponse.json();
                 // Sort selected tracks based on the order in user.selected_career_paths
                 const sortedSelectedTracks = userData.selected_career_paths
                     .map(id => selectedTracksData.find(track => track.id === id))
                     .filter(track => track !== undefined);
                setSelectedCareerTracks(sortedSelectedTracks);
            } else {
                const errorData = selectedTracksResponse.headers.get('content-type')?.includes('application/json') ? await selectedTracksResponse.json() : { detail: selectedTracksResponse.statusText };
                setError(`Failed to fetch selected career tracks: ${errorData.detail || JSON.stringify(errorData)}`);
            }
        } else {
            setSelectedCareerTracks([]); // Ensure it's an empty array if no paths selected
        }

        // Fetch Skill Tags
        const skillTagsResponse = await fetch('/api/onboarding-answers/user_skill_tags/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });

        if (skillTagsResponse.ok) {
            const skillTagsData = await skillTagsResponse.json();
            setSkillTags(skillTagsData.skill_tags || []);
        } else {
            const errorData = skillTagsResponse.headers.get('content-type')?.includes('application/json') ? await skillTagsResponse.json() : { detail: skillTagsResponse.statusText };
            // Only set error if there are no selected paths and skill tags were expected
             if (!userData.selected_career_paths || userData.selected_career_paths.length === 0) {
                setError(`Failed to fetch skill tags: ${errorData.detail || JSON.stringify(errorData)}`);
             }
        }

      } catch (err) {
        setError(`An error occurred while fetching data: ${err.message}`);
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    };

    if (token) {
        fetchData();
    }

  }, [token, navigate]);

  const getLevelFromXP = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getNextLevelXP = (xp) => {
    const currentLevel = getLevelFromXP(xp);
    return currentLevel * 100;
  };

  const getProgressPercentage = (xp) => {
    const currentLevel = getLevelFromXP(xp);
    const currentLevelXP = (currentLevel - 1) * 100;
    const nextLevelXP = currentLevel * 100;
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  // Determine if the user has selected career paths
  const hasSelectedPaths = user?.selected_career_paths && user.selected_career_paths.length > 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* User Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              boxShadow: '0 4px 24px rgba(79, 70, 229, 0.2)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'white',
                    color: '#4f46e5',
                    fontSize: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Welcome back, {user?.username}!
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  Level {getLevelFromXP(user?.xp || 0)} Career Explorer
                </Typography>
              </Grid>
              <Grid item>
                <Box sx={{ textAlign: 'center' }}>
                  <Tooltip title="Experience Points">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                      <Typography 
                        variant="h5" 
                        fontWeight="bold"
                        sx={{ 
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {user?.xp || 0} XP
                      </Typography>
                    </Box>
                  </Tooltip>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(user?.xp || 0)}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      },
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 0.5, 
                      opacity: 0.9,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {user?.xp || 0} / {getNextLevelXP(user?.xp || 0)} XP to next level
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ textAlign: 'center' }}>
                  <Tooltip title="Current Streak">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FireIcon 
                        sx={{ 
                          color: '#f59e0b',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }} 
                      />
                      <Typography 
                        variant="h5" 
                        fontWeight="bold"
                        sx={{ 
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {user?.streak || 0} days
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.9,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    Keep the streak going!
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Skill Tags Section */}
          {skillTags.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Your Skills
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {skillTags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Chip
                      label={tag}
                      icon={<FitnessCenterIcon />}
                      sx={{ 
                        mb: 1,
                        bgcolor: 'rgba(79, 70, 229, 0.1)',
                        color: '#4f46e5',
                        borderRadius: 2,
                        '& .MuiChip-icon': { color: '#4f46e5' },
                        '&:hover': {
                          bgcolor: 'rgba(79, 70, 229, 0.2)',
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </Box>
          )}

          {/* Selected Career Paths Section */}
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Your Chosen Career Paths
          </Typography>

          {!user?.onboarding_complete ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}
            >
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Complete the onboarding process to unlock your career journey and choose your paths!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/onboarding/interests')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                    boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
                  },
                }}
              >
                Start Onboarding
              </Button>
            </Paper>
          ) : !hasSelectedPaths ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}
            >
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                You haven't selected any career paths yet. Choose your paths to see them here.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/onboarding/recommendation')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                    boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
                  },
                }}
              >
                Choose Your Paths
              </Button>
            </Paper>
          ) : selectedCareerTracks.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}
            >
              <CircularProgress size={24} sx={{ color: '#4f46e5' }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Loading your selected career paths...
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {selectedCareerTracks.map((track, index) => {
                  const trackProgress = careerProgress.find(p => p.career.id === track.id);
                  const daysCompleted = trackProgress ? trackProgress.days_completed : 0;

                  return (
                    <Grid item xs={12} md={6} key={track.id}>
                      <motion.div
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Typography 
                                variant="h2" 
                                sx={{ 
                                  mr: 2,
                                  fontSize: '2.5rem',
                                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                                }}
                              >
                                {track.emoji}
                              </Typography>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  fontWeight="bold"
                                  sx={{ 
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }}
                                >
                                  {track.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    size="small"
                                    icon={<TrendingUpIcon />}
                                    label={`$${track.avg_salary}/yr`}
                                    sx={{ 
                                      bgcolor: 'rgba(79, 70, 229, 0.1)',
                                      color: '#4f46e5',
                                      '& .MuiChip-icon': { color: '#4f46e5' }
                                    }}
                                  />
                                  {trackProgress ? (
                                    <Chip
                                      size="small"
                                      icon={<CheckCircleOutlineIcon />}
                                      label={`${daysCompleted} Days Completed`}
                                      sx={{ 
                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        '& .MuiChip-icon': { color: '#10b981' }
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      size="small"
                                      icon={<HourglassEmptyIcon />}
                                      label="Not Started"
                                      sx={{ 
                                        bgcolor: 'rgba(156, 163, 175, 0.1)',
                                        color: '#6b7280',
                                        '& .MuiChip-icon': { color: '#6b7280' }
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                gutterBottom
                                sx={{ mb: 1 }}
                              >
                                Progress: {daysCompleted} days completed
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={trackProgress ? (daysCompleted / 14) * 100 : 0}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: 'rgba(79, 70, 229, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: '#4f46e5',
                                    boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
                                  },
                                }}
                              />
                            </Box>

                            <Button
                              variant="contained"
                              fullWidth
                              sx={{ 
                                mt: 3,
                                borderRadius: 3,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                                  boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
                                },
                                '&:disabled': {
                                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                                  boxShadow: 'none',
                                }
                              }}
                              onClick={() => navigate(`/career-paths/${track.slug}/page-1`)}
                            >
                              Start Learning
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}