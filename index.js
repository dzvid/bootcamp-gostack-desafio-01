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

//Verifica se o id existe na lista de projetos
/**
 * Um middleware local que será utilizado em todas rotas que recebem o {id} do projeto
 * nos parâmetros da URL (rota) que verifica se o projeto com aquele {id} existe.
 * Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente.
 * @param  {Number} req.params.id {id} de um projeto
 * @return {JSON}      Retorna uma mensagem de erro informando que {id} não existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  //Caso o projeto não exista, retorno resposta de erro
  if (!project) {
    return res.status(400).json({ error: "Project does not exists!" });
  }

  //Caso o projeto exista, a requisição continua normalmente
  return next();
}

//Verifica se o parametro {title} existe no corpo da requisição
/**
 * Um middleware local que será utilizado em todas rotas que recebem {title} como
 * parametros no corpo da requisição. Se não existir retorne um erro,
 * caso contrário permita a requisição continuar normalmente
 * @param  {String} req.body.title Parametro {title} da requisição
 * @return {JSON}      Retorna uma mensagem de erro informando que o parametro não existe
 */

function checkTitleExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "'title' is required" });
  }

  return next();
}

//Verifica se o parametro {id} existe no corpo da requisição (para Metodo POST)
/**
 * Um middleware que é utilizado na rota de criação de um projeto para verificar
 * se o id foi declarado (usado em toda requisição que recebe o {id} no corpo da requisição).
 * Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente
 * @param  {String} req.body.id Parametro {id} da requisição
 * @return {JSON}      Retorna uma mensagem de erro informando que o parametro não existe
 */

function checkIdExists(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: "'id' is required" });
  }

  return next();
}

////ROTAS
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
server.post("/projects", checkTitleExists, checkIdExists, (req, res) => {
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
server.post(
  "/projects/:id/tasks",
  checkProjectExists,
  checkTitleExists,
  (req, res) => {
    //TODO - Validar existencia dos parametros
    // Parametro id é validado no middleware
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id === id);

    project.tasks.push(title);

    return res.json(projects);
  }
);

//Alterar do titulo de um projeto
/**
 * PUT /projects/:id: A rota deve alterar apenas o título do projeto
 * com o {id} presente nos parâmetros da rota. o novo titulo desejado está
 * presente no body (parametro {title}).
 * @param  {Number} req.params.id {id} de um projeto
 * @param  {String} req.body.title Novo titulo para um projeto
 * @return {JSON}      Retorna a lista de projetos
 */
server.put(
  "/projects/:id",
  checkProjectExists,
  checkTitleExists,
  (req, res) => {
    //TODO Validar a existencia dos parametros
    // Parametro id é validado no middleware
    // Parametro project é inserido no middleware
    const { id } = req.params;
    const { title } = req.body;

    // Buscamos o projeto pelo id, se existir: alteramos (quando não existe é tratado no middleware)
    // Considerando que não há id duplicado, o find encontrará o elemento desejado (se existir)
    const project = projects.find(project => project.id === id);

    project.title = title;

    return res.json(projects);
  }
);

//Deletar um projeto
/**
 * DELETE /projects/:id: A rota deve deletar o projeto com o
 * {id} presente nos parâmetros da rota;
 * @param  {Number} req.params.id {id} de um projeto
 * @return {JSON}      Retorna um status de confirmação de exclusão
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  //TODO validar existencia do parametro
  // Parametro id é validado no middleware
  const { id } = req.params;

  // Buscamos o projeto pelo id, se existir, retorno o index do elemento no array
  // O caso do id não existir está sendo tratado pelo middleware
  // Considerando que não há id duplicado, o find encontrará o elemento desejado (se existir)
  const projectIndex = projects.findIndex(project => project.id === id);

  // Deleto o projeto do array
  projects.splice(projectIndex, 1);

  // Retorna um status de confirmação de exclusão
  return res.send();
});

// Servidor ouvindo na porta 3000
server.listen(3000);
