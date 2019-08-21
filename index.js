const express = require("express");

//Instancio o servidor
const server = express();

// Configura o express para tratar o corpo (body) da requisição como JSON
server.use(express.json());

// Lista de projetos,
// Um projeto tem o formato: { id: "1", title: 'Novo projeto', tasks: [] }
const projects = [];

//Middleware global
// Armazena contagem de quantas requisições foram feitas na aplicação até então
let requestsCounter = 0;

/**
 * Um middleware global chamado em todas requisições que imprime (console.log) uma
 * contagem de quantas requisições foram feitas na aplicação até então;
 */
server.use((req, res, next) => {
  requestsCounter++;
  console.log(`Total of requests: ${requestsCounter}`);
  return next();
});

//ROTAS
//Listar projetos
/**
 * Listagem de todos os projetos e suas tarefas
 * @return {JSON}      Lista de projetos e suas tarefas
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Criar um projeto
/**
 *  POST /projects: A rota deve receber {id} e {title} dentro do corpo e cadastrar um
 * novo projeto dentro de um array no seguinte formato:
 * { id: "1", title: 'Novo projeto', tasks: [] };
 * Certifique-se de enviar tanto o {id} quanto o título do projeto no formato
 * string com aspas duplas.
 * @param  {Number} req.params.id {id} de um projeto
 * @param  {String} req.body.title Nova tarefa recebida
 * @return {JSON}      Retorna a lista de projetos
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  //TODO verificar se os parametros existem
  //TODO verificar id duplicado antes da inserção

  // Criamos o projeto e adicionamos à lista de projetos
  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

//Criar uma tarefa num projeto
/**
 * POST /projects/:id/tasks: A rota deve receber um campo {title} e armazenar
 * uma nova tarefa no array de tarefas de um projeto específico escolhido
 * através do {id} presente nos parâmetros da rota;
 * @param  {Number} req.params.id {id} de um projeto
 * @param  {String} req.body.title Nova tarefa recebida
 * @return {JSON}      Retorna a lista de projetos
 */
server.post("/projects/:id/tasks", (req, res) => {
  //TODO - Validar existencia dos parametros
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  //Caso o projeto não exista, retorno resposta de erro
  if (!project) {
    return res.status(400).json({ error: "Projeto não existe, id inválido!" });
  }

  project.tasks.push(title);

  return res.json(projects);
});

//Alterar do titulo de um projeto
/**
 * PUT /projects/:id: A rota deve alterar apenas o título do projeto
 * com o {id} presente nos parâmetros da rota. o novo titulo desejado está
 * presente no body (parametro {title}).
 * @param  {Number} req.params.id {id} de um projeto
 * @param  {String} req.body.title Novo titulo para um projeto
 * @return {JSON}      Retorna a lista de projetos
 */
server.put("/projects/:id", (req, res) => {
  //TODO Validar a existencia dos parametros
  const { id } = req.params;
  const { title } = req.body;

  // Buscamos o projeto pelo id, se existir: alteramos
  // Considerando que não há id duplicado, o find encontrará o elemento desejado (se existir)
  const project = projects.find(project => project.id === id);

  //Caso o projeto não exista, retorno resposta de erro
  if (!project) {
    return res.status(400).json({ error: "Projeto não existe, id inválido!" });
  }

  project.title = title;

  return res.json(projects);
});

//Deletar um projeto
/**
 * DELETE /projects/:id: A rota deve deletar o projeto com o
 * {id} presente nos parâmetros da rota;
 * @param  {Number} req.params.id {id} de um projeto
 * @return {JSON}      Retorna um status de confirmação de exclusão
 */
server.delete("/projects/:id", (req, res) => {
  //TODO validar existencia do parametro
  const { id } = req.params;

  // Buscamos o projeto pelo id, se existir, retorno o index do elemento no array
  // Considerando que não há id duplicado, o find encontrará o elemento desejado (se existir)
  const projectIndex = projects.findIndex(project => project.id === id);

  //Caso o projeto não exista, retorno resposta de erro
  if (projectIndex === -1) {
    return res.status(400).json({ error: "Projeto não existe, id inválido!" });
  }

  // Deleto o projeto do array
  projects.splice(projectIndex, 1);

  return res.send();
});

// Servidor ouvindo na porta 3000
server.listen(3000);
