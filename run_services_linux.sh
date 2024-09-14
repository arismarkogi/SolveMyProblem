#!/bin/bash

# Start RabbitMQ and MongoDB services
sudo systemctl start rabbitmq-server
sudo systemctl start mongod

# Run each service in a new terminal window with a specific title
gnome-terminal --tab --title="Orchestrator Service" -- bash -c "cd orchestrator && node app.js; exec bash"
gnome-terminal --tab --title="User Service" -- bash -c "cd user-service && node app.js; exec bash"
gnome-terminal --tab --title="Problem Management Service" -- bash -c "cd problem-management-service && node app.js; exec bash"
gnome-terminal --tab --title="Transaction Service" -- bash -c "cd transaction-service && node app.js; exec bash"
gnome-terminal --tab --title="Solver Service" -- bash -c "cd solver-service && node solver.js; exec bash"
gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend/fe && export NODE_OPTIONS=--openssl-legacy-provider && npm start; exec bash"
