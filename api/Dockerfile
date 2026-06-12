# Use the official lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's build cache
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your Express/API server listens on
EXPOSE 5000

# Start the application in development mode (e.g., using nodemon)
CMD ["npm", "run", "dev"]
