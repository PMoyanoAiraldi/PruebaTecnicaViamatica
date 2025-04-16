Este repositorio contiene la implementación del backend para la prueba técnica solicitada.

🚀 Tecnologías utilizadas

NestJS

TypeScript

TypeORM

PostgreSQL

Swagger (Documentación de la API)

📦 Instalación

npm install

▶️ Ejecución del proyecto

npm run start:dev

🔒 Autenticación

La API utiliza JWT para autenticar a los usuarios.

Para probar endpoints, hacé login con un usuario existente.

Copiá el token de acceso (access_token) y hacé click en Authorize en Swagger para usarlo automáticamente en las rutas.

📑 Documentación Swagger

Una vez que la app esté corriendo, podés acceder a la documentación en:

http://localhost:3010/api

📂 Estructura de carpetas

src/
├── auth/
├── config/
├── guard/
├── users/
├── person/
├── rol1-options/
├── rol_users/
├── rol/
├── sessions/
└── shared
└── users

📌 Endpoints principales

POST /auth/login → Iniciar sesión

POST /auth/logout → Cerrar sesión (requiere token)

GET /users → Listar usuarios 

PUT /users/:id → Modificar usuario

PATCH /users/:id/status → Cambiar estado del usuario (activo/inactivo)

PUT /person/:id → Modificar persona

...

📝 Consideraciones importantes

🔁 PUT /person/:id y /users/:id

Todos los campos del DTO son opcionales.Si no deseás modificar un dato (por ejemplo, identification), simplemente eliminalo del cuerpo (body) antes de enviar la solicitud.

Ejemplo:

{
  "names": "Marcelo"
}

🗓️ Zona horaria y fechas

La fecha de nacimiento (birthDate) puede verse con un día de diferencia en la base de datos, ya que se guarda en formato UTC.Esta diferencia es esperada y no afecta la integridad del dato.

🔐 Roles y permisos

Para acceder a ciertos endpoints es necesario ser admin.

Se utiliza un guard para validar el rol y un decorador personalizado para definirlo.

📌 Estado actual

✅ Backend completo y funcional.
🧪 Tests manuales realizados desde Swagger.

