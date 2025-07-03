import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Section {
  id: number;
  section_type: string;
  content: string;
  order: number;
}

interface LearningPage {
  id: number;
  page_number: number;
  sections: Section[];
}

const LearningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<LearningPage | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`/api/career-paths/${slug}/learning_page/?page=1`);
        setPageData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load learning page content');
        console.error('Error fetching learning page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!pageData) {
    return null;
  }

  const getSectionTitle = (sectionType: string): string => {
    const titles: { [key: string]: string } = {
      overview: 'Overview',
      scope: 'Scope and Impact',
      opportunities: 'Opportunities',
      skills: 'Skills Required',
      knowledge: 'Knowledge Areas',
    };
    return titles[sectionType] || sectionType;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Path - Page {pageData.page_number}
      </Typography>
      
      {pageData.sections.map((section) => (
        <Paper
          key={section.id}
          elevation={2}
          sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}
        >
          <Typography variant="h5" component="h2" gutterBottom color="primary">
            {getSectionTitle(section.section_type)}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {section.content}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default LearningPage; 