import express from "express"; // Importa o framework Express para criação de servidores web
import multer from "multer"; // Importa o middleware Multer para upload de arquivos
import cors from "cors";

// Importa funções controladoras de posts de um arquivo externo
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";  

const corsOptions = {
    origin:"http://localhost:3001",
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({ // Define a lógica de armazenamento para arquivos enviados
  destination: function (req, file, cb) { // Função para definir o diretório de destino
    cb(null, 'uploads/'); // Define o diretório "uploads" para armazenar os arquivos
  },
  filename: function (req, file, cb) { // Função para definir o nome do arquivo
    cb(null, file.originalname); // Mantém o nome original do arquivo enviado
  }
})

// Cria uma instância do middleware Multer com a configuração de armazenamento
const upload = multer({ dest: "./uploads", storage }); 

// Comentário alternativo para servidores com arquitetura Unix (onde ./uploads funciona)
// const upload = multer({ dest: "./uploads"})

const routes = (app) => { // Função que define as rotas da aplicação
  // Habilita o middleware express.json para interpretar requisições no formato JSON
  app.use(express.json());
  app.use(cors(corsOptions));

  // Rota GET para listar todos os posts (provavelmente chama a função listarPosts do arquivo postsController)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (provavelmente chama a função postarNovoPost do arquivo postsController)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem (usa o middleware upload.single para tratar um único arquivo chamado "imagem" e depois chama a função uploadImagem do arquivo postsController)
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
}

export default routes; // Exporta a função routes para ser utilizada em outro arquivo