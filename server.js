import express from 'express'

const app = express()

app.use(express.json())

const users = []

app.post('/usuarios', (req, res) => {
  users.push(req.body)
  res.send('Cadastrado com sucesso')
})

app.get('/usuarios', (req, res) => {
  res.json(users)

})

app.listen(3000, () => {
  console.log('Ta on Aproveita!!!')
})