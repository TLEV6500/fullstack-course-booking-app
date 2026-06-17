# client/Dockerfile

# Use the official lightweight Node.js image
FROM node:20-alpine

ARG VITE_COURSE_BOOKING_API

ENV VITE_COURSE_BOOKING_API=$VITE_COURSE_BOOKING_API

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's build cache
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your Express/API server listens on
EXPOSE 5173

# Start the application in development mode (e.g., using nodemon)
CMD ["npm", "run", "dev"]
