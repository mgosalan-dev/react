import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware de log para debug
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    console.log(`\n=== ${req.method} ${req.url} ===`)
    console.log('Headers:', req.headers)
    console.log('Body:', req.body)
  }
  next()
})

// Função de tratamento de erros
function handleServerError(res, error, contexto = '') {
  console.error(`Erro ${contexto}:`, error)
  res.status(500).json({
    error: 'Erro interno do servidor',
    detalhe: error.message || 'Erro desconhecido'
  })
}

// Rota: Criar usuário
app.post('/usuarios', async (req, res) => {
  const { email, name, age } = req.body

  if (!email || !name || age === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, email e age' })
  }

  try {
    const novoUsuario = await prisma.user.create({
      data: {
        email,
        name,
        age: Number(age)
      }
    })

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      usuario: novoUsuario
    })
  } catch (error) {
    handleServerError(res, error, 'ao criar usuário')
  }
})

// Rota: Listar usuários (com filtros opcionais)
app.get('/usuarios', async (req, res) => {
  try {
    const { email, name, age } = req.query

    const filters = {}
    if (email) filters.email = String(email)
    if (name) filters.name = String(name)
    if (age) filters.age = Number(age)

    const usuarios = await prisma.user.findMany({ where: filters })

    res.status(200).json({
      message: Object.keys(filters).length ? 'Usuário(s) filtrado(s)' : 'Todos os usuários',
      usuario: usuarios
    })
  } catch (error) {
    handleServerError(res, error, 'ao buscar usuários')
  }
})

// Rota: Editar usuário
app.put('/usuarios/:id', async (req, res) => {
  const { email, name, age } = req.body
  const { id } = req.params

  const dataToUpdate = {}
  if (email) dataToUpdate.email = email
  if (name) dataToUpdate.name = name
  if (age !== undefined) dataToUpdate.age = Number(age)

  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({ error: 'Nenhum dado enviado para atualização' })
  }

  try {
    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data: dataToUpdate
    })

    res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado
    })
  } catch (error) {
    handleServerError(res, error, 'ao editar usuário')
  }
})

// Rota: Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params

  try {
    const usuarioDeletado = await prisma.user.delete({
      where: { id }
    })

    res.status(200).json({
      message: 'Usuário deletado com sucesso',
      usuario: usuarioDeletado
    })
  } catch (error) {
    handleServerError(res, error, 'ao deletar usuário')
  }
})

// Start do servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})
