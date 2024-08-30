Αφού εγκαταστήσετε το jmeter,

Θα βάλετε στον φάκελο jmeter/lib/ext τα αρχεία: 
    - saas2024-24/testing/java_files/jmeter-plugins-manager-1.10.jar
    - saas2024-24/testing/java_files/JMeterAMQP.jar

Θα βάλετε στον φάκελο jmeter/lib το αρχείο:
    - saas2024-24/testing/java_files/amqp-client-5.21.0.jar

Για να τρέξετε τα tests:
    - Ανοίγετε το jmeter
    - Πηγαίνετε File -> Open -> /path/to/saas2024-24/testing/CSV Data Set Config.jmx
    - Αφού το ανοίξετε, θα πρέπει αλλάξετε στο Test Plan -> Thread Group -> CSV Data Set Config -> Filename στο /path/to/saas2024-24/testing/generated_messages.csv
    - Τώρα μπορείτε να τρέξετε τα tests
