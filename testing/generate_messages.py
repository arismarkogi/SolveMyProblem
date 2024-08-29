import json
import random
import uuid

def generate_mongo_id():
    # Generate a unique identifier that mimics the MongoDB ObjectId format
    return str(uuid.uuid4()).replace('-', '')[:24]

def generate_message(num_vehicles, depot, max_distance, location_file_path):
    return {
        "type": "problemIssue",
        "mes": {
            "locationFilePath": location_file_path,
            "numVehicles": num_vehicles,
            "depot": depot,
            "maxDistance": max_distance,
            "userId": generate_mongo_id()
        }
    }

def generate_messages(n, location_file_path="uploads/locations_20.json", num_locations=20):
    messages = []
    for i in range(n):
        num_vehicles = random.randint(1, 10)  # Random number of vehicles between 1 and 10
        depot = random.randint(0, num_locations - 1)  # Random depot, less than number of locations
        max_distance = random.randint(50000, 200000)  # Random max distance between 50,000 and 200,000
        message = generate_message(num_vehicles, depot, max_distance, location_file_path)
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
    
    # Generate the messages
    messages = generate_messages(n)
    
    # Write the messages to a file
    write_messages_to_file(messages, output_file_path)
