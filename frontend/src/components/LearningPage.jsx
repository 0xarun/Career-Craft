import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, NavigateNext as NextIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PhaseTwo from './PhaseTwo';

const LearningPage = () => {
  const { slug } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageNumber = 1;
        const response = await fetch(`http://localhost:8000/api/career-tracks/${slug}/learning_page/?page=${pageNumber}`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 404) {
            setError('This learning path is not available yet. Please check back later.');
          } else {
            setError(`Failed to fetch learning content: ${errorData.detail || response.statusText}`);
          }
          console.error('API Error Response:', errorData);
          return;
        }

        const data = await response.json();
        console.log('Fetched learning content data:', data);
        setPageData(data);
      } catch (err) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error fetching learning data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchContent();
    }
  }, [slug, token]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!pageData) {
    return null;
  }

  const getSectionTitle = (sectionType) => {
    const titles = {
      overview: 'Overview',
      scope: 'Scope and Impact',
      opportunities: 'Opportunities',
      skills: 'Skills Required',
      knowledge: 'Knowledge Areas',
    };
    return titles[sectionType] || sectionType;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNextPhase = () => {
    setActiveTab(1); // Switch to Phase 2
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to Dashboard
        </Button>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom>
            Learning Path - Page {pageData.page_number}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Learn" />
              <Tab label="Feel the Path" />
            </Tabs>
          </Box>
          
          {activeTab === 0 ? (
            <>
              {/* Phase 1 Content */}
              {pageData.sections.map((section) => (
                <Box key={section.id} sx={{ mt: 4 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    {getSectionTitle(section.section_type)}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {section.content}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 4 }} />
              
              {/* Next Phase Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<NextIcon />}
                  onClick={handleNextPhase}
                >
                  Continue to Feel the Path
                </Button>
              </Box>
            </>
          ) : (
            // Phase 2 Content
            <PhaseTwo 
              funFacts={pageData.fun_facts}
              dayInLife={pageData.day_in_life}
              scenarios={pageData.scenarios}
              reflections={pageData.reflections}
            />
          )}
        </Paper>
      </Stack>
    </Container>
  );
};

export default LearningPage; 