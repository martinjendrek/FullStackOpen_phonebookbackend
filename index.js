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


app.get('/info', (request, response) => {
    date = new Date()
    const infoPage = `
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${date}</p>
        `
    response.send(`${infoPage}`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
    console.log(person)
      response.json(person)
    })
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p=>p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content "name" or "number" missing'})
    } else if (persons.map(p=>p.name).includes(body.name)) {
        return response.status(400).json({error: ' "name" must be unique'})
    }
    const person = new Person ({ 
        name: body.name, 
        number: body.number
      })
      person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})