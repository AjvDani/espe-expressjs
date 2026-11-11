# espe-expressjs

API REST para gestionar reservas de citas médicas, desarrollada con Express en la asignatura de Desarrollo Web Avanzado (ESPE).

- **PostgreSQL** (con Prisma) guarda usuarios, bloques de horario y citas.
- **MongoDB** (con Mongoose) guarda el catálogo de especialidades.
- La autenticación usa **JWT** con dos roles: `USER` y `ADMIN`.

## Tecnologías

| Área | Herramientas |
|---|---|
| Servidor | Node.js, Express 5 |
| PostgreSQL | Prisma 7 con `@prisma/adapter-pg` |
| MongoDB | Mongoose 9, `slugify`, `validator` |
| Seguridad | `jsonwebtoken`, `bcryptjs` |
| Entorno | Docker Compose (PostgreSQL 17, pgAdmin 4, MongoDB 8) |
| Pruebas manuales | Colección de Postman en `postman/` |

## Requisitos

- Node.js 20.19 o superior (o 22.12 o superior).
- Docker Desktop (o Docker Engine con Compose).

## Puesta en marcha

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea tu archivo de entorno a partir del ejemplo y completa `PORT` y `JWT_SECRET`:

   ```bash
   cp .env-example .env
   ```

3. Levanta las bases de datos:

   ```bash
   docker compose up -d
   ```

4. Aplica las migraciones y genera el cliente de Prisma:

   ```bash
   npx prisma migrate deploy
   ```

   ```bash
   npx prisma generate
   ```

5. Carga los datos de ejemplo (opcional). El seed se puede ejecutar varias veces sin duplicar datos:

   ```bash
   node prisma/seed.js
   ```

6. Inicia el servidor:

   ```bash
   npm run dev
   ```

   Usa `npm start` para ejecutarlo sin recarga automática. La API queda en `http://localhost:<PORT>/api`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `JWT_SECRET` | Clave para firmar los tokens; usa un valor largo y aleatorio | — |
| `DATABASE_URL` | Conexión a PostgreSQL | Ver `.env-example` |
| `MONGODB_URI` | Conexión a MongoDB | Ver `.env-example` |

Los valores de `.env-example` funcionan con los contenedores de `docker-compose.yml`. El archivo `.env` no se sube al repositorio.

## Servicios de Docker

| Servicio | Contenedor | Puerto local | Notas |
|---|---|---|---|
| PostgreSQL 17 | `espe-postgres` | `5433` | Se usa 5433 para no chocar con un PostgreSQL instalado en el equipo |
| pgAdmin 4 | `espe-pgadmin` | `5050` | Interfaz web en `http://localhost:5050` |
| MongoDB 8 | `espe-mongo` | `27017` | Se puede conectar con MongoDB Compass |

Las credenciales de cada servicio están en `docker-compose.yml` y son solo para desarrollo local.

## Endpoints

Todas las rutas empiezan por `/api`. Las rutas protegidas necesitan la cabecera `Authorization: Bearer <token>`.

### Autenticación

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | Público | Registra un usuario (siempre con rol `USER`) |
| `POST` | `/auth/login` | Público | Devuelve un token JWT válido por 4 horas |
| `GET` | `/auth/protected-route` | Con token | Ruta de prueba para comprobar el token |

### Administración

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/admin/time-block` | `ADMIN` | Crea un bloque de horario (`startTime`, `endTime`) |
| `GET` | `/admin/reservations` | `ADMIN` | Lista todas las reservas con su usuario y bloque |

### Reservas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/reservations` | Con token | Crea una reserva (`date`, `timeBlockId`) para el usuario del token |
| `GET` | `/reservations/:id` | Dueño o `ADMIN` | Muestra una reserva |
| `PUT` | `/reservations/:id` | Dueño o `ADMIN` | Cambia la fecha o el bloque de una reserva |
| `DELETE` | `/reservations/:id` | Dueño o `ADMIN` | Elimina una reserva |

Una reserva se rechaza si ya existe otra con la misma fecha y el mismo bloque.

### Historial de citas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/users/:id/appointments` | El propio usuario o `ADMIN` | Lista las citas de un usuario con su bloque de horario |

### Especialidades (MongoDB)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/specialties` | Público | Crea una especialidad |
| `GET` | `/specialties` | Público | Lista las especialidades |
| `GET` | `/specialties/:id` | Público | Muestra una especialidad, incluido el campo virtual `info` |
| `POST` | `/specialties/:id` | Público | Actualiza una especialidad y regenera su `slug` |
| `DELETE` | `/specialties/:id` | Público | Elimina una especialidad |

Reglas del modelo `Specialty`:

- `name` es obligatorio y único; el `slug` se genera a partir de él.
- `code` es obligatorio y sigue el formato `ABC-01`.
- `description` es obligatoria y tiene entre 50 y 300 caracteres.
- `area` es `clinica` (por defecto), `quirurgica` o `diagnostico`.
- `durationMinutes` va de 15 a 120 minutos, en múltiplos de 15; por defecto es 30.
- `contactEmail` es opcional, pero si se envía debe ser un correo válido.

Los errores de validación responden `400` con la lista de mensajes en `errors`.

## Datos de ejemplo

`prisma/seed.js` crea un usuario `ADMIN`, un usuario `USER`, dos bloques de horario y una cita para cada usuario. Las credenciales de esas cuentas están en el mismo archivo y son solo para desarrollo.

## Pruebas con Postman

1. Importa `postman/espe-api.postman_collection.json` y `postman/espe-local.postman_environment.json`.
2. Selecciona el entorno **ESPE Local**, ajusta `baseUrl` a tu puerto y completa `adminEmail` y `adminPassword` con una cuenta `ADMIN`.
3. Ejecuta las carpetas en orden con el Runner.

La colección cubre rutas, autenticación, roles, autorización, reservas, historial y especialidades. Los usuarios y bloques que crea se quedan en la base de datos, porque la API no tiene rutas para borrarlos.

## Estructura del proyecto

```text
├── docker-compose.yml       # PostgreSQL, pgAdmin y MongoDB
├── postman/                 # Colección y entorno de Postman
├── prisma/
│   ├── migrations/          # Migraciones de PostgreSQL
│   ├── schema.prisma        # Modelos User, TimeBlock y Appointment
│   └── seed.js              # Datos de ejemplo
├── prisma7.config.ts        # Configuración de Prisma
└── src/
    ├── server.js            # Punto de entrada: conecta MongoDB y arranca Express
    ├── app.js               # Configuración de Express
    ├── controllers/         # Manejo de peticiones y respuestas
    ├── db/                  # Conexión a MongoDB
    ├── middlewares/         # Autenticación, autorización y utilidades
    ├── models/              # Modelos de Mongoose
    ├── routes/              # Definición de rutas
    ├── services/            # Acceso a datos
    └── utils/               # Funciones de apoyo
```

## Origen

Este proyecto parte del repositorio de clase [paulosk8/espe-expressjs](https://github.com/paulosk8/espe-expressjs), que se sigue como remoto `upstream` para incorporar sus cambios.
