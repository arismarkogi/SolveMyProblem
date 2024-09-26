# Problem Management Service

The Problem Management Service manages the submission and history of user problems. It stores the problem data, tracks solution status, and interacts with the solver microservice.

## Features:

    - Submit problems
    - View problem history
    - Store solutions

## Endpoints:

    - POST /submit-problem
    - GET /getProblems
    - DELETE /deleteProblem/:id

## Technologies:

    - Node.js
    - Express
    - MongoDB