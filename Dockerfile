# Define image with node already installed
FROM node:16 as base

# Define where the app will be in the container's disk
WORKDIR /usr/src/app

# Copy all the files that starts with "package" and ends with ".json" to workdir
# Then install the app dependencies
COPY package*.json ./
RUN npm install
# If building for production its better using "RUN npm ci --only=production"

# Copy everything inside the folder where Dockerfile is to workdir (.dockerignore will make this ignore node_modules)
COPY . .

# CMD npm run dev