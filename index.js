require('dotenv').config();
const Person = require('./models/person');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const PORT = process.env.PORT;
app.get('/api/persons', (request, response) => {
  Person.find({}).then((pers) => {
    response.json(pers);
  });
});

// app.get('/info', (request, response) => {
//   const requestDate = new Date();
//   response.send(`
//     <p>Phonebook has info for ${persons.length} persons</p>
//     <p>${requestDate}<p/>
//     `);
// });

// app.get('/api/persons/:id', (request, response) => {
//   const id = request.params.id;
//   const person = persons.find((person) => person.id === id);
//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();
//   }
// });

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  });
});

app.post('/api/persons/', (request, response) => {
  const body = request.body;
  body.id = Math.floor(Math.random() * 100000) + 1;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: body.id,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

//   persons = person.concat(person);
//   response.json(person);
// });

app.listen(PORT, () => {
  console.log(`server tunning on port ${PORT}`);
});
