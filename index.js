require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))
persons = [
    ]

const welcomePage = `
<h2>Rest Phonebook</h2>
<p>Get information via a RESTful API</p>
<table>
    <tr>
        <th>endpoint</th>
        <th>description</th>
    </tr>
    <tr>
        <td><a href='info'>/info</a></td>
        <td>Info about phonebook</td>
    </tr>
    <tr>
        <td><a href='api/persons'>/api/persons</a></td>
        <td>All persons data</td>
    <tr>
        <td><a href='api/persons/1'>/api/persons/{number}</a></td>
        <td>Search person by id</td>    
    </tr>
</table>`



app.get('/api', (request, response) => {
    response.send(`${welcomePage}`)
})

// This need to be updated to work with MongoDB
app.get('/info', (request, response) => {
    const date = new Date();
  
    // Use Person.countDocuments to count the number of documents in the collection
    Person.countDocuments({})
      .then(count => {
        console.log('There are %d people in the collection.', count);
        const infoPage = `
          <p>Phonebook has info for ${count} people.</p>
          <p>${date}</p>
        `;
        response.send(infoPage);
      })
      .catch(error => {
        console.error('Error counting documents:', error);
        response.status(500).send('Internal Server Error');
      });
  });

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
    response.json(person)
    })
  })

app.delete('/api/persons/:id', (request, response, next) =>{
    Person.findByIdAndDelete(request.params.id)
    .then(result =>{
        response.status(204).end()
    })
    .catch (error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person ({ 
        name: body.name, 
        number: body.number
      })
      person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({error: error.message})
    }
  
    next(error)
  }

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})