# Use an official Node.js runtime as a parent image
FROM node:16

ENV MONGO_DB_USERNAME=Astewale
ENV MONGO_DB_PSW=Astewale

# Set the working directory in the container
WORKDIR /home/music-api

# Create the directory in the container
RUN mkdir -p /home/music-api

# Copy contents from the host's Document/MUSICAPP/music_app_api/app to /home/music-api in the container
COPY . /home/music-api

# Install app dependencies
RUN npm install express mongoose dotenv cors nodemon

# Expose the port the app runs on
EXPOSE 8800

# Define the command to run your app
CMD node /home/music-api/server.js