import json
import random
import uuid
from datetime import datetime

def generate_problem_id():
    # Generate a unique identifier that mimics the MongoDB ObjectId format
    return str(uuid.uuid4()).replace('-', '')[:24]

def generate_message(num_vehicles, depot, max_distance, locations, location_file_name):
    return {
        "problemId": generate_problem_id(),
        "numVehicles": num_vehicles,
        "depot": depot,
        "maxDistance": max_distance,
        "locationFileContent": locations,
        "locationFileName": location_file_name
    }

def generate_messages(n, num_locations, locations):
    messages = []
    for i in range(n):
        location_file_name = f"locations{i}.json"
        num_vehicles = random.randint(1, 10)  # Random number of vehicles between 1 and 10
        depot = random.randint(0, num_locations - 1)  # Random depot, less than number of locations
        max_distance = random.randint(50000, 200000)  # Random max distance between 50,000 and 200,000
        message = generate_message(num_vehicles, depot, max_distance, locations, location_file_name)
        messages.append(message)  # Append the message dictionary
    return messages

def write_messages_to_file(messages, output_file_path):
    with open(output_file_path, "w") as output_file:
        for message in messages:
            output_file.write(json.dumps(message) + "\n")
    print(f"Processed data has been written to {output_file_path}")

# Main execution
if __name__ == "__main__":
    n = 40  # Number of messages to generate
    output_file_path = "generated_messages.csv"
    

    locations= """{
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
            {
                "Latitude": 37.974070236340665,
                "Longitude": 23.737519890565082
            },
            {
                "Latitude": 37.99763705556787,
                "Longitude": 23.76632669971703
            },
            {
                "Latitude": 37.987158185269436,
                "Longitude": 23.760040398809927
            },
            {
                "Latitude": 37.96565952612894,
                "Longitude": 23.78044816563277
            },
            {
                "Latitude": 38.00816194011881,
                "Longitude": 23.743726736188382
            },
            {
                "Latitude": 37.983474656462256,
                "Longitude": 23.73256864917707
            },
            {
                "Latitude": 37.96362413346355,
                "Longitude": 23.77785820154608
            },
            {
                "Latitude": 37.96581060070882,
                "Longitude": 23.72133687257313
            },
            {
                "Latitude": 37.97624293546459,
                "Longitude": 23.740238201740137
            },
            {
                "Latitude": 38.00566809733227,
                "Longitude": 23.728089082692076
            },
            {
                "Latitude": 38.00132387722171,
                "Longitude": 23.75830400972441
            },
            {
                "Latitude": 37.96320247915091,
                "Longitude": 23.785174964462342
            },
            {
                "Latitude": 37.965357705819066,
                "Longitude": 23.74320004992697
            },
            {
                "Latitude": 37.9692186084866,
                "Longitude": 23.785110852487332
            },
            {
                "Latitude": 37.98271697637991,
                "Longitude": 23.73542153051244
            },
            {
                "Latitude": 37.97230013076112,
                "Longitude": 23.788423933330492
            },
            {
                "Latitude": 37.97827880279073,
                "Longitude": 23.75884558944574
            }
        ]
    }
            """
    #print(locations)
    # Generate the messages
    messages = generate_messages(n, 20, locations)
    
    # Write the messages to a file
    write_messages_to_file(messages, output_file_path)
