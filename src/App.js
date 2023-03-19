import React, { useState, useEffect, useRef } from 'react';
import { Snackbar } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/lab';
import { FormLabel } from '@mui/material';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  TextField,
  Typography,
} from '@mui/material';

function App() {
  const [moduleID, setModuleID] = useState(5);
  const [question, setQuestion] = useState({
    description: '',
    type: 'IMAGE',
    resource: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [answers, setAnswers] = useState(
    Array(3).fill({ description: '', type: 'IMAGE', resource: '' }),
  );

  const questionRef = useRef(null);
  const answerRefs = useRef(Array(3).fill(null));

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event, index) => {
    if (event.key === 'Tab' && index < 2) {
      event.preventDefault();
      answerRefs.current[index + 1].focus();
    } else if (event.key === 'Tab' && index === 2) {
      event.preventDefault();
      document.getElementById('guardar-button').focus();
    }
  };

  // const resetForm = () => {
  //   setModuleID(6);
  //   setQuestion({
  //     description: '',
  //     type: 'IMAGE',
  //     resource: '',
  //   });
  //   setCorrectAnswerIndex(0);
  //   setAnswers(Array(5).fill({ description: '', type: 'IMAGE', resource: '' }));
  // };  

  const handleSaveQuestion = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: {
          description: question.description,
          type: question.type,
          resource: question.resource || undefined,
          module_id: moduleID,
        },
        answers: answers.map((answer, index) => {
          const answerObj = {
            description: answer.description,
            type: answer.type,
            value: index === correctAnswerIndex ? 1 : 0,
          };
  
          if (answer.type !== 'TEXT') {
            answerObj.resource = answer.resource;
          }
  
          return answerObj;
        }),
      }),
    };
  
    try {
      const response = await fetch('/api/questions', requestOptions);
      if (!response.ok) {
        throw new Error('Error al guardar la pregunta');
      }
      setSnackbar({ open: true, message: 'Pregunta guardada con éxito' });
      // resetForm();
    } catch (error) {
      setSnackbar({ open: true, message: error.message });
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generador de preguntas
        </Typography>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="module-label">Módulo</InputLabel>
          <Select
            labelId="module-label"
            value={moduleID}
            onChange={(e) => setModuleID(e.target.value)}
            label="Módulo"
          >
            <MenuItem value={1}>Módulo 1</MenuItem>
            <MenuItem value={2}>Módulo 2</MenuItem>
            <MenuItem value={3}>Módulo 3</MenuItem>
            <MenuItem value={4}>Módulo 4</MenuItem>
            <MenuItem value={5}>Módulo 5</MenuItem>
            <MenuItem value={6}>Módulo 6</MenuItem>
            <MenuItem value={7}>Módulo 7</MenuItem>
            <MenuItem value={8}>Módulo 8</MenuItem>
            <MenuItem value={9}>Módulo 9</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          sx={{ my: 2 }}
          label="Pregunta"
          value={question.description}
          onChange={(e) =>
            setQuestion({ ...question, description: e.target.value })
          }
        />
  <FormControl fullWidth sx={{ my: 2 }}>
  <FormLabel htmlFor="question-type-label">Tipo de pregunta</FormLabel>
  <ToggleButtonGroup
    value={question.type}
    exclusive
    onChange={(e, newValue) => {
      if (newValue) {
        setQuestion({ ...question, type: newValue });
      }
    }}
    sx={{ mt: 1 }}
  >
    <ToggleButton value="TEXT">Texto</ToggleButton>
    <ToggleButton value="IMAGE">Imagen</ToggleButton>
    <ToggleButton value="AUDIO">Audio</ToggleButton>
  </ToggleButtonGroup>
  </FormControl>
        {question.type !== 'TEXT' && (
          <TextField
            fullWidth
            sx={{ my: 2 }}
            label="Recurso de la pregunta"
            value={question.resource}
            onChange={(e) =>
              setQuestion({ ...question, resource: e.target.value })
            }
          />
        )}
        <RadioGroup
          aria-label="respuesta correcta"
          value={correctAnswerIndex}
          onChange={(e) => setCorrectAnswerIndex(parseInt(e.target.value))}
          row
        >
          {answers.map((answer, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value={index}
                control={<Radio />}
                label={`Respuesta ${index + 1}`}
              />
              <TextField
                sx={{ flex: 1, ml: 2 }}
                label={`Respuesta ${index + 1}`}
                value={answer.description}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = {
                    ...answer,
                    description: e.target.value,
                  };
                  setAnswers(newAnswers);
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputRef={(ref) => (answerRefs.current[index] = ref)}
              />
  <FormControl sx={{ minWidth: 100, ml: 2 }}>
  <FormLabel htmlFor={`answer-type-label-${index}`}>Tipo</FormLabel>
  <ToggleButtonGroup
    value={answer.type}
    exclusive
    onChange={(e, newValue) => {
      if (newValue) {
        const newAnswers = [...answers];
        newAnswers[index] = {
          ...answer,
          type: newValue,
        };
        setAnswers(newAnswers);
      }
    }}
    sx={{ mt: 1 }}
  >
    <ToggleButton value="TEXT">Texto</ToggleButton>
    <ToggleButton value="IMAGE">Imagen</ToggleButton>
    <ToggleButton value="AUDIO">Audio</ToggleButton>
  </ToggleButtonGroup>
  </FormControl>
              {answer.type !== 'TEXT' && (
                <TextField
                  sx={{ minWidth: 200, ml: 2 }}
                  label="Recurso"
                  value={answer.resource}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = {
                      ...answer,
                      resource: e.target.value,
                    };
                    setAnswers(newAnswers);
                  }}
                />
              )}
            </Box>
          ))}
        </RadioGroup>
        <Button variant="contained" onClick={handleSaveQuestion}>
          Guardar pregunta
        </Button>
      </Box>

  <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={handleCloseSnackbar}
  message={snackbar.message}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  ContentProps={{ style: { fontSize: '1.1rem' } }}
  action={
    <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
      Cerrar
    </Button>
  }
/>
    </Container>
  );
}

export default App;

