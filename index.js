const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
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



app.get('/', (request, response) => {
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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p=>p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p=>p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 99999);
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content "name" or "number" missing'})
    } else if (persons.map(p=>p.name).includes(body.name)) {
        return response.status(400).json({error: ' "name" must be unique'})
    }
    const person = { 
        "id": id,
        "name": body.name, 
        "number": body.number
      }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})