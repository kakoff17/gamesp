# GAMESP

## [Visita la página](https://gamesp.netlify.app/)

![GAMESP LOGO](https://i.imgur.com/gAwIOI5.png)

## Descripción

**NOTE -** Proyecto personal para poner a pruebas mis conocimientos de javascript y react. Es un proyecto sobre un catalogo de juegos donde puedes interactuar añadiendo comentarios y añadiendo los juegos a favoritos.
#### [Repositorio de cliente](https://github.com/kakoff17/gamesp-client)
#### [Repositorio de servidor](https://github.com/kakoff17/gamesp-server)

## Funcionalidades futuras

**NOTE -** 
-Implementar que en lugar de extraer la información de un JSON provenga de una API.
-Añadir un chat para comentar curiosidades sobre juegos.
-Añadir amigos entre usuarios para conocer sus juegos favoritos y poder curiosear.

## Tecnologías usadas

**NOTE -** List here all technologies used in the project like HTML, CSS, Javascript, React, axios, React Context etc.
- HTML
- CSS
- Javascript
- React
- Axios
- Bootstrap
- MongoDB
- Netlify
- Github

# Estructura de servidor

## Models

User model

```javascript
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  favGame: [{type: Schema.Types.ObjectId,ref:'Game'}]
  role: {type: String, enum: ["user", "admin"], default: "user"},
}
```

Game model

```javascript
 {
   name: {type: String},
   description: String, image: String, 
   genre: { type: [String],  enum: 
   [   "Acción",
      "Estrategia",
      "Rol",
      "Disparos",
      "Aventura",
      "Carreras",
      "Deportes",
      "Educación",
      "Competitivo multijugador"
    ],},
    platform: { type: [String],
      enum: [
        "PS4",
        "PS5",
        "PC",
        "XBOX",
        "NINTENDO"
      ] },
    gameplay: {type: String},
 }
```

Comment model

```javascript
{
  content: { type: String, required: true, unique: false,},
  game: {type: mongoose.Schema.Types.ObjectId, ref: "Game"},
  author: {type: mongoose.Schema.Types.ObjectId,ref: "User",},
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                    |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | -------------------------------------------------------------- |
| POST        | `/auth/signup`              | {name, email, password}      | 201            | 400          | Registers the user in the Database                             |
| POST        | `/auth/login`               | {username, password}         | 200            | 400          | Validates credentials, creates and sends Token                 |
| GET         | `/auth/verify`              |                              | 200            | 401          | Verifies the user Token                                        |
| GET         | `/games`                    |                              | 200            | 400          | Show games in the DB, only titles and images                   |
| POST        | `/games/create`             | {newGame                     | 201            | 400          | Creates a new Game Document                                    |
| GET         | `/games/:gameId`            |                              | 200            | 400, 401     | Sends all game Details                                         |
| PUT         | `/games/:gameId`            |                              | 200            | 400, 401     | Edits game document                                            |
| DELETE      | `/games/:gameId`            |                              | 200            | 401          | Deletes game document                                          |
| GET         | `/games/:gameId/comment     |                              | 200            | 401          | Deletes game document                                          |
| DELETE      | `/games/:gameId/comment/commId |                           | 200            | 401          | Deletes game document                                          |
| POST        | `/games/:gameId/fav         |                              | 200            | 401          | Deletes game document                                          |
| DELETE      | `/games/:gameId/fav/remove` |                              | 200            | 401          | Deletes game document                                          |
| GET         | `/profile`                  |                              | 200            | 401          | Sends user profile details                                     |
| PUT         | `/profile`                  |                              | 200            | 400, 401     | Edits the user profile                                         |
| GET         | `/profile/favs`             |                              | 200            | 401          | Adds game to favourite                                         |
  
## Links

### Collaborators

[Carlos Ponce Diez](https://github.com/kakoff17)

### Project

[Repository Link Client](https://github.com/kakoff17/gamesp-client)

[Repository Link Server](https://github.com/kakoff17/gamesp-server)

[Deploy Link](https://gamesp.netlify.app)
