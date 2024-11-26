import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js"; // Importa as funções para obter e criar posts do modelo de dados
import fs from "fs"; // Importa o módulo do sistema de arquivos para realizar operações com arquivos
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
  // Chama a função do modelo para obter todos os posts do banco de dados
  const posts = await getTodosPosts();
  // Envia os posts como resposta JSON com status 200 (OK)
  res.status(200).json(posts);
  console.log("listagem de Posts");
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post enviados no corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função do modelo para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta JSON com status 200 (OK)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    // Envia uma mensagem de erro como resposta JSON com status 500 (Erro interno do servidor)
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome do arquivo da imagem
  console.log("Inicio da função uploadImagem");
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };
  console.log("")
  try {
    // Chama a função do modelo para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Gera um novo nome para a imagem, incluindo o ID do post
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    console.log("variavel imagemAtualizada " + imagemAtualizada);
    // Renomeia o arquivo da imagem para o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    console.log("req.file.path " + req.file.path);
    // Envia o post criado como resposta JSON com status 200 (OK)
    res.status(200).json(postCriado);
    console.log("Json PostCriado " + json(postCriado));
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    console.log(erro.message);
    // Envia uma mensagem de erro como resposta JSON com status 500 (Erro interno do servidor)
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

export async function atualizarNovoPost(req, res) {
    
    const id = req.params.id;
    const urlImagem = `https://instalike-back-328641433931.southamerica-east1.run.app/${id}.png`
    
    try {
        const imagemBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imagemBuffer);
        
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
  }