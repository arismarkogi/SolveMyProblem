# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install Python3, pip, and venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create and activate a virtual environment for Python
RUN python3 -m venv /app/venv

# Ensure that pip is upgraded within the virtual environment
RUN /app/venv/bin/pip install --upgrade pip

# Install ortools inside the virtual environment
RUN /app/venv/bin/pip3 install ortools

# Copy package.json and package-lock.json
COPY package*.json ./

ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 6789

# Command to run the Node.js application
CMD ["node", "solver.js"]
