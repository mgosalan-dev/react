import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

// Middleware padrão
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware de debug de requisições
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    console.log(`\n=== ${req.method} ${req.url} ===`)
    console.log('Content-Type:', req.headers['content-type'])
    console.log('Body recebido:', req.body)
  }
  next()
})

// Função para tratar erros de servidor
function handleServerError(res, error, contexto = '') {
  console.error(`Erro ${contexto}:`, error)
  res.status(500).json({
    error: 'Erro interno do servidor',
    mensagem: error.message || 'Erro desconhecido'
  })
}

// Rota para criar usuário
app.post('/usuarios', async (req, res) => {
  const { email, name, age } = req.body

  if (!email || !name || age === undefined) {
    return res.status(400).json({
      error: 'Campos obrigatórios: name, email, age'
    })
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

// Rota para listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany()
    res.status(200).json(usuarios)
  } catch (error) {
    handleServerError(res, error, 'ao buscar usuários')
  }
})

// Rota para editar usuário
app.put('/usuarios/:id', async (req, res) => {
  const { email, name, age } = req.body

  // Monta dinamicamente os dados a serem atualizados
  const dataToUpdate = {}
  if (email !== undefined) dataToUpdate.email = email
  if (name !== undefined) dataToUpdate.name = name
  if (age !== undefined) dataToUpdate.age = Number(age)

  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({
      error: 'Nenhum dado enviado para atualização'
    })
  }

  try {
    const update = await prisma.user.update({
      where: { id: req.params.id },
      data: dataToUpdate
    })

    res.status(200).json({
      message: 'Usuário editado com sucesso',
      usuario: update
    })
  } catch (error) {
    handleServerError(res, error, 'ao editar usuário')
  }
})

// rota para deletar um usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: req.params.id }
    })

    res.status(202).json({
      message: 'Usuário deletado com sucesso',
      usuario: deletedUser
    })
  } catch (error) {
    res.status(502)
    handleServerError(res, error, 'ao deletar o usuário')
  }
})


// Inicialização do servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})