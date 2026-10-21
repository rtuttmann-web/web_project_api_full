# EUA Afora — Back-end

## Descrição do projeto

API RESTful para o projeto **EUA Afora**, desenvolvida em Node.js com Express e conectada a um banco de dados **MongoDB** por meio do **Mongoose**. A API permite criar, consultar, atualizar e excluir usuários e cartões (lugares/fotos), além de curtir e descurtir cartões.

## Funcionalidades

### Usuários

- `GET /users` — retorna todos os usuários
- `GET /users/:userId` — retorna um usuário pelo `_id`
- `POST /users` — cria um novo usuário (`name`, `about`, `avatar`)
- `PATCH /users/me` — atualiza o perfil (`name`, `about`)
- `PATCH /users/me/avatar` — atualiza o avatar

### Cartões

- `GET /cards` — retorna todos os cartões
- `POST /cards` — cria um novo cartão (`name`, `link`); o `owner` é definido automaticamente
- `DELETE /cards/:cardId` — exclui um cartão pelo `_id`
- `PUT /cards/:cardId/likes` — curte um cartão
- `DELETE /cards/:cardId/likes` — remove a curtida

### Validação de dados

- `name` e `about`: strings de 2 a 30 caracteres, obrigatórias
- `avatar` e `link`: URLs validadas por **expressão regular** (aceitam `http://` ou `https://`, `www.` opcional, caminho e `#` no final)
- Curtidas únicas por usuário, com os operadores `$addToSet` e `$pull` do MongoDB

### Tratamento de erros

- `400` — dados inválidos ou ID com formato inválido
- `404` — usuário, cartão ou rota não encontrados
- `500` — erro padrão do servidor ("Ocorreu um erro no servidor")

Os códigos de status estão centralizados como constantes em `utils/errors.js`.

> **Autorização temporária:** um middleware em `app.js` adiciona um usuário de teste (`req.user._id`) a cada solicitação. Essa solução será substituída por autenticação real no próximo sprint.

## Tecnologias e técnicas utilizadas

- Node.js
- Express.js (`express.Router()` para roteamento modular)
- MongoDB
- Mongoose (esquemas, modelos, validadores personalizados, `orFail()`)
- Expressões regulares para validação de URLs
- Arquitetura em camadas: `models/`, `controllers/`, `routes/`, `utils/`
- ESLint com configuração Airbnb (`airbnb-base`)
- Nodemon para recarga automática em desenvolvimento
- Postman e MongoDB Compass para testes

## Estrutura do projeto

```
├── controllers/
│   ├── cards.js
│   └── users.js
├── models/
│   ├── card.js
│   └── user.js
├── routes/
│   ├── cards.js
│   └── users.js
├── utils/
│   └── errors.js
├── app.js
└── package.json
```

## Como rodar o projeto

1. Inicie o servidor do MongoDB (endereço padrão `mongodb://localhost:27017`).
2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor:

```bash
npm run start   # inicia o servidor em localhost:3000
npm run dev     # inicia com recarga automática (nodemon)
```

4. Verifique o código com o ESLint:

```bash
npm run lint
```

O banco de dados `aroundb` é criado automaticamente na primeira gravação.

## Autor

Ricardo Tuttmann
