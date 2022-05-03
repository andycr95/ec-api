# EClass-Api
Prueba técnica backend node para eclass

### Instalar dependencias
Para instalar las dependecias necesarias para este proyecto, solo se debe ejecutar el comando ```npm install```.

### Para ejecutar
Para ejecutar el proyecto, debe ejecutar el comando ```npm run dev```

### Nota
El proyecto se encuentra conectado a una base de datos de prueba de mongo en la nube, adicionalmente en el proyecto se encuentra una coleccion de Postman para realizar las pruebas del proyecto

### Metodos en postman

#### GetUsers
Metodo que retorna los usuarios registrados en orden ascendente

#### GetUser/id
Metodo que retorna el usuario identificado con el id proporcionado

#### SearchUsers?search
Metodo que retorna los usuarios registrados en orden ascendente que coinciden con el query ingresado

#### NewUser
Metodo que registra un usuario con la informacion proporcionada

#### UpdateUser
Metodo que actualiza la informacion de un usuario con la proporcionada

#### DeleteUser
Metodo que elimina el usuario identificado con el id proporcionado

#### Login
Metodo que retorna el usuario y token asignado para los datos enviados('email', 'password') si coinciden y son correctas con las registradas
