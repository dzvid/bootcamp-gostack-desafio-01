# ![alt text](./assets/images/favicon.png "Rocketseat Logo") Desafio 01. Conceitos do NodeJS

Crie uma aplicação do zero utilizando Express.

Essa aplicação será utilizada para armazenar projetos e suas tarefas.

## Rotas

- [x] `POST /projects`: A rota deve receber `id` e `title` dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte formato: `{ id: "1", title: 'Novo projeto', tasks: [] }`; Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.

- [x] `GET /projects`: Rota que lista todos projetos e suas tarefas;

- [x] `PUT /projects/:id`: A rota deve alterar apenas o título do projeto com o `id` presente nos parâmetros da rota;

- [x] `DELETE /projects/:id`: A rota deve deletar o projeto com o `id` presente nos parâmetros da rota;

- [x] `POST /projects/:id/tasks`: A rota deve receber um campo `title` e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do `id` presente nos parâmetros da rota;

### Exemplo

Se eu chamar a rota `POST /projects` repassando:

```js
{
  id: "1",
  title: "Novo projeto"
}
```

e após isto, chamar a rota `POST /projects/1/tasks` com:

```js
{
  title: "Nova tarefa",
}
```

o array de projetos deve ficar assim:

```js
[
  {
    id: "1",
    title: "Novo projeto",
    tasks: ["Nova tarefa"]
  }
];
```

## Middlewares

- [x] Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe. Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;

- [x] Crie um middleware para verificar se os parametros do corpo da requisição existem (id e title);

- [x] Crie um middleware global chamado em todas requisições que imprime (`console.log`) uma contagem de quantas requisições foram feitas na aplicação até então;

## Entrega

Esse desafio **não precisa ser entregue** e não receberá correção, mas você pode ver o resultado do código do desafio aqui: https://github.com/Rocketseat/bootcamp-gostack-desafio-01
