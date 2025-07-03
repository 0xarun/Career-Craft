import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';

const PhaseTwo = ({ funFacts, dayInLife, scenarios, reflections }) => {
  const theme = useTheme();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedReflection, setSelectedReflection] = useState(null);

  const handleScenarioSelect = (scenario, option) => {
    setSelectedScenario({ ...scenario, selectedOption: option });
  };

  const handleReflectionSelect = (option) => {
    setSelectedReflection(option);
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* Fun Facts Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Fun Facts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {funFacts.map((fact) => (
          <Grid item xs={12} md={6} key={fact.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {fact.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {fact.fact_text}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Takeaway: {fact.takeaway}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Day in Life Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        A Day in the Life
      </Typography>
      <Card elevation={3} sx={{ mb: 6 }}>
        <CardContent>
          <List>
            {dayInLife && dayInLife.narrative && Object.entries(dayInLife.narrative).map(([time, content]) => (
              <React.Fragment key={time}>
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={time.charAt(0).toUpperCase() + time.slice(1)}
                    secondary={content}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Scenarios Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Real-World Scenarios
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} md={6} key={scenario.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {scenario.question}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['A', 'B', 'C'].map((option) => (
                    <Button
                      key={option}
                      variant={
                        selectedScenario?.id === scenario.id &&
                        selectedScenario?.selectedOption === option
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() => handleScenarioSelect(scenario, option)}
                      disabled={selectedScenario?.id === scenario.id}
                    >
                      {scenario[`option_${option.toLowerCase()}`]}
                    </Button>
                  ))}
                </Box>
                {selectedScenario?.id === scenario.id && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle1"
                      color={
                        selectedScenario.selectedOption === scenario.correct_option
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      {selectedScenario.selectedOption === scenario.correct_option
                        ? 'Correct!'
                        : 'Not quite right.'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {scenario.explanation}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reflection Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Reflection
      </Typography>
      <Card elevation={3}>
        <CardContent>
          {reflections && reflections[0] && (
            <Typography variant="h6" gutterBottom>
              {reflections[0]?.question_text}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reflections && reflections[0] && ['1', '2', '3'].map((option) => (
              <Button
                key={option}
                variant={selectedReflection === option ? 'contained' : 'outlined'}
                onClick={() => handleReflectionSelect(option)}
                disabled={selectedReflection !== null}
              >
                {reflections[0][`option_${option}`]}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PhaseTwo; 