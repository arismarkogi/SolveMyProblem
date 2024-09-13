# Start RabbitMQ and MongoDB services
Start-Service -Name RabbitMQ
Start-Service -Name MongoDB

# Open each service in a new PowerShell window
Start-Process powershell -ArgumentList "cd orchestrator; node app.js" -NoNewWindow -Wait
Start-Process powershell -ArgumentList "cd user-service; node app.js" -NoNewWindow -Wait
Start-Process powershell -ArgumentList "cd problem-management-service; node app.js" -NoNewWindow -Wait
Start-Process powershell -ArgumentList "cd transaction-service; node app.js" -NoNewWindow -Wait
Start-Process powershell -ArgumentList "cd solver-service; node solver.js" -NoNewWindow -Wait
Start-Process powershell -ArgumentList "cd frontend/fe; $env:NODE_OPTIONS='--openssl-legacy-provider'; npm start" -NoNewWindow -Wait
