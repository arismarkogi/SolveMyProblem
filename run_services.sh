#!/bin/bash

# Start RabbitMQ and MongoDB services
sudo systemctl start rabbitmq-server
sudo systemctl start mongod

# Run each service in a new terminal window with a specific title
gnome-terminal --title="Orchestrator Service" -- bash -c "cd orchestrator && node app.js; exec bash"
gnome-terminal --title="User Service" -- bash -c "cd user-service && node app.js; exec bash"
gnome-terminal --title="Problem Management Service" -- bash -c "cd problem-management-service && node app.js; exec bash"
gnome-terminal --title="Transaction Service" -- bash -c "cd transaction-service && node app.js; exec bash"
gnome-terminal --title="Solver Service" -- bash -c "cd solver-service && node solver.js; exec bash"