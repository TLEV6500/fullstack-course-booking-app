# Use the same Node.js base image
FROM node:20-alpine

# Set the working directory for the client
WORKDIR /usr/src/app

# Copy package files first for caching optimization
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend application files
COPY . .

# Expose the port your frontend dev server runs on (Vite defaults to 5173)
EXPOSE 5173

# Start the frontend development server
CMD ["npm", "run", "dev"]
