const express = require("express");

//Instancio o servidor
const server = express();

// Configura o express para tratar o corpo (body) da requisição como JSON
server.use(express.json());

server.get("/teste", (req, res) => {
  return res.json({ message: "OK" });
});

// Servidor ouvindo na porta 3000
server.listen(3000);
