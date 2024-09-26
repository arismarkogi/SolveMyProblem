# SolveMyProblem - SaaS Application

## Team 24

SolveMyProblem is a microservices-based web application developed as part of the "Software as a Service" course by six students from the Electrical and Computer Engineering department at the National Technical University of Athens. The project was guided by Professor Vasilios Vescoukis.

### Team Members:

    - Kaousias Thanasis
    - Katsikopoulos Kostis
    - Malos Vasilis
    - Markogiannakis Aris
    - Papanikolaou Ariadni
    - Tsetsilas Tasos

The application aims to help users solve complex computational problems without requiring expensive software licenses or hardware. The core functionality of the system involves solving a Vehicle Routing Problem (VRP) using Google OR-Tools for optimization.

### Features

    - User management (including Google login)
    - Purchase of credits for solving problems
    - Submission of computational problems
    - Execution and management of problem-solving
    - Solution review and problem history tracking

### Problem Submission Format

Users can submit problems in the following JSON format:


```
{
  "numVehicles": 3,
  "depot": 0,
  "maxDistance": 50,
  "locationFileContent": {
    "Locations": [
      {
        "Latitude": 37.99983328183838,
        "Longitude": 23.74317714798427
      },
      {
        "Latitude": 37.966783510525985,
        "Longitude": 23.778605533642235
      },
      {
        "Latitude": 37.9990464764814,
        "Longitude": 23.773251398190194
      },
      ...
    ]
  },
  "pythonFileContent": "..."
}```

### Problem Solver Description

SolveMyProblem currently solves a Vehicle Routing Problem (VRP) using Python and Google OR-Tools. Here is a sample of the Python code used:


```
import json
import os
import sys
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def haversine_distance(lat1, lon1, lat2, lon2):
    # Code for calculating distance between locations

def calculate_distance_matrix(locations):
    # Code for creating distance matrix between locations

def create_data_model(locations, num_vehicles, depot):
    # Code for generating the data model

def print_solution(data, manager, routing, solution):
    # Code for printing the solution

def main():
    if len(sys.argv) != 5:
        print("Usage: python vrpSolver.py <input_file.json> <num_vehicles> <depot> <max_distance>")
        sys.exit(1)

    input_file = sys.argv[1]
    num_vehicles = int(sys.argv[2])
    depot = int(sys.argv[3])
    max_distance = int(sys.argv[4])

    # Load locations and solve the problem

if __name__ == "__main__":
    main()
```

Example Locations Files:

    locations_20.json: 20 random locations for vehicle routing
    locations_200.json: 200 random locations
    locations_1000.json: 1000 random locations

### System Architecture

The application is composed of the following microservices:

    - User Service: Manages user registration, authentication (including Google login).
    - Problem Management Service: Handles problem submissions, storing solutions and managing problem history.
    - Solver Microservice: Processes submitted problems using Google OR-Tools.
    - Transactions Service: Manages the user credits and financial transactions.
    - Orchestrator: Responsible for coordinating communication between services.
    - Frontend: A React-based interface for users to interact with the system.

Communication between the services is managed through message queues (using RabbitMQ), with the frontend communicating via HTTP API calls to the orchestrator.

### Running the Application

**Locally**

    - For Linux:

```
./run_services_linux.sh
```

    - For Windows:

```
    ./run_services_windows.sh
```

- Using Docker

To run the application with Docker:

```
docker-compose up --build
```

### Technical Requirements

    - Google OR-Tools installed.
    - The project uses Docker for containerization.
    - Python for solving the VRP.
    - Node.js and Express for backend services.
    - React for the frontend.

### Instructions from the Professors

The project follows the guidelines provided by Vasilios Vescoukis, Panagiotis Tsanakas, and M. Koniaris. The architecture is based on microservices and utilizes agile methodologies for project management.

The main deliverables include:

    - UML diagrams of the architecture.
    - GitHub repository with source code.
    - Working application in Docker containers.
    - Stress testing results using jMeter.
    - Detailed documentation on AI tools used.