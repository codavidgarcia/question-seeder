const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const questionsFilePath = path.join(__dirname, 'questions.json');

app.post('/api/questions', (req, res) => {
  const { question, answers } = req.body;

  const newQuestion = {
    question: {
      description: question.description,
      type: question.type,
      resource: question.resource || undefined,
      module_id: question.module_id
    },
    answers: answers.map((answer, index) => {
      return {
        description: answer.description,
        type: answer.type,
        value: answer.value,
        resource: answer.resource
      }
    })
  }

  fs.readFile(questionsFilePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo');
      return;
    }

    const questions = JSON.parse(data || '[]');
    questions.push(newQuestion);

    fs.writeFile(questionsFilePath, JSON.stringify(questions, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al escribir en el archivo');
        return;
      }
    
      res.status(200).send('Pregunta guardada con éxito');
    });
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});