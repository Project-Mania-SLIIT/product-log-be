# Use the official Node.js 16 image
FROM node:21.4.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000


RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Command to run the application
CMD ["npm", "run", "start:prod"]
