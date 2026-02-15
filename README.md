#  Atalaya Studio — Backend API

API REST desarrollada con **Node.js + Express + PostgreSQL** para gestionar solicitudes de clientes desde el formulario del sitio web.

Este backend permite:

- Crear solicitudes (clientes)
- Consultar todas las solicitudes
- Consultar por ID
- Actualizar registros
- Eliminar registros
- Conectarse a PostgreSQL mediante `pg Pool`
- Configuración segura mediante variables de entorno

---

##  Tecnologías Utilizadas

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors
- ECMAScript Modules (ESM)

---

##  Estructura del Proyecto

serverAtalaya/

├── src/

│ ├── index.js

│ ├── config.js

│ ├── db.js

│ ├── routes/

│ │ └── users.route.js

│ ├── controllers/

│ │ └── users.controllers.js

│ └── database/

│ └── db.sql

├── .env

├── package.json

└── README.md


---

##  Configuración del Entorno

Crear un archivo `.env` en la raíz del proyecto:

DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=TU_PASSWORD
DB_NAME=bd_atalaya
DB_PORT=5432

PORT=3000


⚠️ Importante:

- No usar comillas
- No usar `export`
- Agregar `.env` al `.gitignore`
- Nunca subir credenciales a GitHub

---

##  Instalación

Instalar dependencias:

npm install
npm install cors

## Modo produccion 

npm run dev


Servidor disponible en:

http://localhost:3000








