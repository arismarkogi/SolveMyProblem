# Function to start a service if it's not running
function Start-ServiceIfNotRunning {
    param (
        [string]$ServiceName
    )
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service -and $service.Status -ne 'Running') {
        Start-Service -Name $ServiceName
        Write-Host "Started $ServiceName service."
    } elseif ($service) {
        Write-Host "$ServiceName service is already running."
    } else {
        Write-Host "$ServiceName service not found."
    }
}

# Function to stop running Node.js processes
function Stop-NodeProcesses {
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Stopping existing Node.js processes..."
        Stop-Process -Name node -Force
        Start-Sleep -Seconds 2  # Wait for processes to fully terminate
    }
}

# Function to start a Node.js application in a new window
function Start-NodeApp {
    param (
        [string]$AppName,
        [string]$AppPath,
        [string]$Command
    )
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\$AppPath'; $Command" -WindowStyle Normal
    Write-Host "Started $AppName"
}

# Stop any running Node.js processes
Stop-NodeProcesses

# Start RabbitMQ and MongoDB services
Start-ServiceIfNotRunning -ServiceName RabbitMQ
Start-ServiceIfNotRunning -ServiceName MongoDB

# Start each service in a new window
Start-NodeApp -AppName "Orchestrator Service" -AppPath "orchestrator" -Command "node app.js"
Start-NodeApp -AppName "User Service" -AppPath "user-service" -Command "node app.js"
Start-NodeApp -AppName "Problem Management Service" -AppPath "problem-management-service" -Command "node app.js"
Start-NodeApp -AppName "Transaction Service" -AppPath "transaction-service" -Command "node app.js"
Start-NodeApp -AppName "Solver Service" -AppPath "solver-service" -Command "node solver.js"

# Start the frontend
Start-NodeApp -AppName "Frontend" -AppPath "frontend\fe" -Command "`$env:NODE_OPTIONS='--openssl-legacy-provider'; npm start"

Write-Host "All services started. Press any key to exit."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")