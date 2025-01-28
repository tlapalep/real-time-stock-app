FROM node:16

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Expone el puerto 3000 para el servidor de desarrollo
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]


