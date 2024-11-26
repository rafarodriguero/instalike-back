import 'dotenv/config'; // Inserido para subir projeto para Cloud Google
import { ObjectId } from "mongodb";
import conextarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados usando a string de conexão fornecida
const conexao = await conextarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para obter todos os posts do banco de dados
export async function getTodosPosts() {
    // Seleciona o banco de dados "imersao-instabytes"
    const db = conexao.db("imersao-instabytes");
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");
    // Busca todos os documentos da coleção e retorna como um array
    return colecao.find().toArray();
}
export async function criarPost (novoPost) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost (id, novoPost) {
    console.log("Função Atualizar Post");
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    console.log(objID);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}
