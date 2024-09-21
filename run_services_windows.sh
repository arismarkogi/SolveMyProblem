#!/bin/bash

# Create a logs directory
LOGS_DIR="$PWD/logs"
mkdir -p "$LOGS_DIR"

# Function to check if a service is running
check_service() {
    service_name=$1
    echo "Checking status of $service_name..."
    sc query "$service_name" | grep -q "RUNNING"
    if [ $? -eq 0 ]; then
        echo "$service_name is running."
        return 0
    else
        echo "$service_name is not running."
        return 1
    fi
}

# Function to start a service if it's not running
start_service() {
    service_name=$1
    if check_service "$service_name"; then
        echo "$service_name is already running."
    else
        echo "$service_name is not running. Please start it manually or run this script with administrator privileges."
    fi
    echo "-----------------------------------"
}

# Function to install dependencies and start a Node.js application
install_and_start_node_app() {
    app_name=$1
    app_path=$2
    command=$3
    log_file="$LOGS_DIR/${app_name// /_}.log"
    
    echo "Processing $app_name..."
    if [ ! -d "$app_path" ]; then
        echo "Error: Directory $app_path does not exist." | tee -a "$log_file"
        return 1
    fi
    
    echo "Installing dependencies for $app_name..." | tee -a "$log_file"
    (cd "$app_path" && npm install) 2>&1 | tee -a "$log_file"
    
    echo "Starting $app_name..." | tee -a "$log_file"
    echo "Command: cd \"$app_path\" && $command" | tee -a "$log_file"
    
    # Start the service and redirect output to log file
    (cd "$app_path" && eval "$command") 2>&1 | tee -a "$log_file" &
    
    echo "$app_name started. Check $log_file for details."
    echo "-----------------------------------"
}

echo "Script started. Running in directory: $PWD"
echo "Logs will be stored in: $LOGS_DIR"
echo "-----------------------------------"

# Check RabbitMQ and MongoDB services
start_service RabbitMQ
start_service MongoDB

# Start each service
install_and_start_node_app "Orchestrator Service" "$PWD/orchestrator" "node app.js"
install_and_start_node_app "User Service" "$PWD/user-service" "node app.js"
install_and_start_node_app "Problem Management Service" "$PWD/problem-management-service" "node app.js"
install_and_start_node_app "Transaction Service" "$PWD/transaction-service" "node app.js"
install_and_start_node_app "Solver Service" "$PWD/solver-service" "node solver.js"

# Check if package.json exists and has a start script for the frontend
if [ -f "$PWD/frontend/fe/package.json" ]; then
    if grep -q '"start"' "$PWD/frontend/fe/package.json"; then
        install_and_start_node_app "Frontend" "$PWD/frontend/fe" "npm start"
    else
        echo "Error: No 'start' script found in frontend package.json" | tee -a "$LOGS_DIR/Frontend.log"
    fi
else
    echo "Error: package.json not found in $PWD/frontend/fe" | tee -a "$LOGS_DIR/Frontend.log"
fi

echo "All services have been started."
echo "Check the log files in $LOGS_DIR for each service's status."
echo "Press Ctrl+C to stop all services."

# Wait for user input
read -n 1 -s -r -p "Press any key to exit..."