## Installation Instructions

After installing JMeter:

1. Place the following files in the `jmeter/lib/ext` folder:
    - `saas2024-24/testing/java_files/jmeter-plugins-manager-1.10.jar`
    - `saas2024-24/testing/java_files/JMeterAMQP.jar`

2. Place the following file in the `jmeter/lib` folder:
    - `saas2024-24/testing/java_files/amqp-client-5.21.0.jar`

## Running the Tests

To run the tests:

1. Open JMeter.
2. Go to `File -> Open -> /path/to/saas2024-24/testing/CSV Data Set Config.jmx`.
3. After opening the file, you need to change the `Filename` field in `Test Plan -> Thread Group -> CSV Data Set Config` to `/path/to/saas2024-24/testing/generated_messages.csv`.
4. Now you can run the tests.
