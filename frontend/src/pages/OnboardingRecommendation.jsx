import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  Paper,
  Fade,
} from '@mui/material';
import {
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const OnboardingRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/users/recommendations/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = response.headers.get('content-type')?.includes('application/json') ? await response.json() : { detail: response.statusText };
          setError(`Failed to fetch recommendations: ${errorData.detail || JSON.stringify(errorData)}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(`An error occurred while fetching recommendations: ${err.message}`);
        console.error('Error fetching recommendations:', err);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [token]);

  const handleSelectTrack = (trackId) => {
    setSelectedTracks((prevSelected) =>
      prevSelected.includes(trackId)
        ? prevSelected.filter((id) => id !== trackId)
        : [...prevSelected, trackId]
    );
  };

  const handleSaveSelections = async () => {
    if (selectedTracks.length === 0 || selectedTracks.length > 4) {
      setError('Please select between 1 and 4 career paths.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/users/select_career_paths/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ career_track_ids: selectedTracks }),
      });

      if (!response.ok) {
         const errorData = response.headers.get('content-type')?.includes('application/json') ? await response.json() : { detail: response.statusText };
        setError(`Failed to save selections: ${errorData.detail || JSON.stringify(errorData)}`);
        setSaving(false);
        return;
      }

      // Assuming successful save navigates to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(`An error occurred while saving selections: ${err.message}`);
      console.error('Error saving selections:', err);
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            Finding the perfect career paths for you...
          </Typography>
        </motion.div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Fade in>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Choose Your Career Paths
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
          >
            Select up to 4 career paths that align with your interests and goals. 
            We'll help you build a personalized learning journey for each path.
          </Typography>
        </Box>

        {recommendations.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <Typography color="text.secondary">
              No career recommendations found based on your interests.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {recommendations.map((track, index) => (
                <Grid item xs={12} sm={6} md={4} key={track.id}>
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
                        cursor: 'pointer',
                        borderRadius: 4,
                        border: selectedTracks.includes(track.id) 
                          ? '2px solid #4f46e5' 
                          : '1px solid rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                          borderColor: selectedTracks.includes(track.id) 
                            ? '#4f46e5' 
                            : 'rgba(79, 70, 229, 0.3)',
                        },
                      }}
                      onClick={() => handleSelectTrack(track.id)}
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
                            </Box>
                          </Box>
                        </Box>

                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {track.description}
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold" 
                            sx={{ mb: 1, color: 'text.secondary' }}
                          >
                            Relevant Interests:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {track.relevant_interests.map(interest => (
                              <Chip
                                key={interest.id}
                                label={interest.name}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(79, 70, 229, 0.1)',
                                  color: '#4f46e5',
                                  borderRadius: 2,
                                  '&:hover': {
                                    bgcolor: 'rgba(79, 70, 229, 0.2)',
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                      <Box 
                        sx={{ 
                          p: 2, 
                          pt: 0, 
                          display: 'flex', 
                          justifyContent: 'flex-end',
                          borderTop: '1px solid rgba(0,0,0,0.08)'
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedTracks.includes(track.id)}
                              onChange={() => handleSelectTrack(track.id)}
                              disabled={selectedTracks.length >= 4 && !selectedTracks.includes(track.id)}
                              sx={{
                                color: '#4f46e5',
                                '&.Mui-checked': {
                                  color: '#4f46e5',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary">
                              Select Path
                            </Typography>
                          }
                        />
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        <Box 
          sx={{ 
            mt: 6, 
            textAlign: 'center',
            position: 'sticky',
            bottom: 24,
            zIndex: 1000
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSaveSelections}
              disabled={selectedTracks.length === 0 || selectedTracks.length > 4 || saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <WorkIcon />}
              endIcon={!saving && <ArrowForwardIcon />}
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
                '&:disabled': {
                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  boxShadow: 'none',
                }
              }}
            >
              {saving ? 'Saving...' : `Continue with ${selectedTracks.length} Path${selectedTracks.length !== 1 ? 's' : ''}`}
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default OnboardingRecommendation; 