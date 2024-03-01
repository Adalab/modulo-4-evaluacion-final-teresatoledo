# Librería - Sistema de Gestión de Inventarios

Este es un sistema de gestión de inventarios para una librería, desarrollado con Node.js y MySQL. El sistema permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la base de datos de la librería, así como la gestión de usuarios con autenticación segura mediante tokens y encriptación bcrypt.

## Características

-   Gestión completa del inventario de la librería.
-   Registro de usuarios con seguridad mediante bcrypt.
-   Autenticación con generación de tokens JWT.
-   Permite la visualización del perfil de usuario.
-   Implementa endpoints para la gestión de libros y usuarios.

## Tecnologías Utilizadas

-   Node.js
-   Express.js
-   MySQL
-   bcrypt
-   JSON Web Tokens (JWT)

## Endpoints

Libros

-   GET /books: Obtiene la lista completa de libros.
-   GET /bookYear?year=YYYY: Filtra libros por año de publicación. Devuelve los libros con una fecha de publicación igual o posterior a la indicada.
-   PUT /books/:id: Modifica un libro existente según su ID.
-   POST /addBook: Añade un nuevo libro al inventario.
-   DELETE /deleteBook: Elimina un libro existente por su ID.

Usuarios

-   POST /register: Registra un nuevo usuario.
-   POST /login: Inicia sesión de usuario.
-   GET /userProfile: Obtiene el perfil del usuario (requiere autenticación).
-   PUT /logout: Cierra la sesión del usuario.

### Configuración del Proyecto

-   Clona este repositorio en tu local.
-   Instala las dependencias con npm install.
-   Configura la base de datos MySQL con el esquema proporcionado.
-   Configura las variables de entorno en un archivo .env.
-   Ejecuta el servidor con npm start.

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno en un archivo .env:

-   DB_HOST: Host de la base de datos MySQL.
-   DB_USER: Usuario de la base de datos MySQL.
-   DB_PASS: Contraseña de la base de datos MySQL.
-   DB_NAME: Nombre de la base de datos MySQL.
-   DB_KEY: Clave secreta para firmar los tokens JWT.
-   PORT: Puerto en el que quieres que se ejecute.

### Licencia

Este proyecto está bajo la Licencia MIT.
