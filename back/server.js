import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const app = express();


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

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
app.post('/cadastro', async (req, res) => {
  const { username, email, password} = req.body

  if (!username || !email || !password === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios: username, email e password' })
  }

  try {
    const novoUsuario = await prisma.user.create({
      data: {
        username,
        email,
        password
        
      }
    })

    // Remove a senha do retorno
    const { password: _, ...usuarioSemSenha } = novoUsuario;

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      usuario: novoUsuario
    })
  } catch (error) {
    handleServerError(res, error, 'ao criar usuário')
  }
})

// Rota: Listar usuários (com filtros opcionais)
app.get('/cadastro', async (req, res) => {

  try {
    const { username, email } = req.query

    const filters = {}
    if (username) filters.username = String(username)
    if (email) filters.email = String(email)
    

    const usuarios = await prisma.user.findMany({ where: filters })

    // Remove senha de todos os usuários antes de retornar
    const usuariosSemSenha = usuarios.map(user => {
      const { password, ...rest } = user;
      return rest;
    });

    res.status(200).json({
      message: Object.keys(filters).length ? 'Usuário(s) filtrado(s)' : 'Todos os usuários',
      usuario: usuariosSemSenha
    })
  } catch (error) {
    handleServerError(res, error, 'ao buscar usuários')
  }

})

// Rota: Editar usuário
app.put('/cadastro/:id', async (req, res) => {
  const { username, email } = req.body
  const { id } = req.params

  const dataToUpdate = {}
  if (username) dataToUpdate.username = username
  if (email) dataToUpdate.email = email
  

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
app.delete('/cadastro', async (req, res) => {
  let { ids } = req.body;

  if (!ids || (Array.isArray(ids) && ids.length === 0)) {
    return res.status(400).json({ error: "Envie pelo menos um ID para deletar." });
  }

  try {
    if (!Array.isArray(ids)) {
      // Se for um único ID, transforma em array pra facilitar
      ids = [ids];
    }

    const usuariosDeletados = await prisma.user.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    res.status(200).json({
      message: `Deletado(s) ${usuariosDeletados.count} usuário(s) com sucesso!`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro interno do servidor",
      detalhe: error.message
    });
  }
});



// Start do servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})
