# This script performs a series of automated tests
# Imports
import requests
import sys
import datetime

# Get the filename.txt from the user to save the test results
filename = input("filename=")

# Define the base URLs for the different microservices
# The first will handle the logs. (a)
a = "https://logsservice-ff1k.onrender.com"
# The second will handle all user-related tasks. (b)
b = "https://usersservice-ets0.onrender.com"
# The third will handle all cost-related tasks. (c)
c = "https://costsservice-kyt3.onrender.com"
# The fourth will handle any admin-related tasks (e.g. developers details) (d)
d = "https://adminservice-690p.onrender.com"

# Open the file in write mode and redirect standard output to it
output = open(filename, "w")
sys.stdout = output

# Print the configuration variables to the output file for reference
print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + a) 
print()


print("Logs Service ------------------------------")
# Testing getting all logs (Initial)
print("testing getting the logs")
print("------------------------------")

try:
    text = ""
    
    # Define the API endpoint for getting logs
    url = a + "/api/logs/"
    
    # Send a GET request
    data = requests.get(url)

    # Log the URL and response
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing accessing a non-existent path on the Logs Service
print("testing getting a wrong URL")
print("------------------------------")

try:
    text = ""
    
    # Define a wrong URL (e.g., /costs on the logs service)
    url = a + "/costs"
    
    # Send a GET request
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting all logs again (To verify the 404 error was logged)
print("testing getting the logs - after error")
print("------------------------------")

try:
    text = ""
    
    # Define the API endpoint for getting logs again
    url = a + "/api/logs/"
    
    # Send a GET request
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    
    print("\nPlease check the log list for the error we just triggered")

except Exception as e:
    print("problem")
    print(e)

print("")


print("Admin Service ------------------------------")
# Start testing the 'About' endpoint functionality
print("testing getting the about:")
print("------------------------------")

try:
    text = ""
    
    # Construct the URL for the admin 'about' API
    url = d + "/api/about/"
    
    # Send a GET request to the server and store the response
    data = requests.get(url)

    # Print the request details including URL, status code, and content
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    print("data.text=")
    print(data.text)
    print("data.json=")
    print(data.json())

# Handle any exceptions that might occur during the request
except Exception as e:
    print("problem")
    print(e)

print("")
print()


print("Costs Service ------------------------------")
# Start testing the generation of a monthly report
print("testing getting the report - empty")
print("------------------------------")

try:
    text = ""
    
    # Construct the URL for the report API with specific query parameters
    url = c + "/api/report/?id=123123&year=2026&month=1"
    
    # Execute the HTTP GET request to fetch the report
    data = requests.get(url)

    # Output the results of the request to the file
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    print("data.text=")
    print(data.text)


# Catch and print any errors during the report fetching process
except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing the addition of a new cost item
print("testing adding cost item")
print("------------------------------")

try:
    text = ""
    
    # Define the API endpoint for adding a new item
    url = c + "/api/add/"
    
    # Send a POST request with the cost item data (JSON payload)
    data = requests.post(url, json={'userid': 123123, 'description': 'milk', 'category': 'food', 'sum': 8})

    # Log the URL used and the status code returned by the server
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

# Handle exceptions specifically for the POST request
except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing the report generation to verify the added item
print("testing getting the report - with milk")
print("------------------------------")

try:
    text = ""
    
    # Request the report again for the same user and date to see updates
    url = c + "/api/report/?id=123123&year=2026&month=1"
    
    # Execute the GET request
    data = requests.get(url)

    # Display the final status and content of the report
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    print("data.text=")
    print(data.text)

# Final exception handling for the last test block
except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding cost item with missing parameters
print("testing adding cost item - missing parameter (category)")
print("------------------------------")

try:
    text = ""
    
    # Define the API endpoint
    url = c + "/api/add/"
    
    # Send a POST request with missing 'category'
    data = requests.post(url, json={'userid': 123123, 'description': 'partial info', 'sum': 20})

    # Log the URL used and the status code
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding cost item with negative sum
print("testing adding cost item - negative sum")
print("------------------------------")

try:
    text = ""
    
    url = c + "/api/add/"
    
    # Sending a negative sum (-10)
    data = requests.post(url, json={'userid': 123123, 'description': 'negative test', 'category': 'food', 'sum': -10})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding cost item with a past date (Yesterday)
print("testing adding cost item - date of yesterday")
print("------------------------------")

try:
    text = ""
    
    # Calculate yesterday's date
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    yesterday_str = yesterday.strftime('%Y-%m-%dT%H:%M:%S')

    # Define the API endpoint
    url = c + "/api/add/"
    
    # Send a POST request with explicit creation date
    data = requests.post(url, json={'userid': 123123, 'description': 'yesterday item', 'category': 'food', 'sum': 15, 'created_at': yesterday_str})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding cost item for a non-existent user
print("testing adding cost item - non-existent user")
print("------------------------------")

try:
    text = ""
    
    url = c + "/api/add/"
    
    # Using a userid that likely doesn't exist
    data = requests.post(url, json={'userid': 999999, 'description': 'ghost user', 'category': 'other', 'sum': 100})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting a report with an invalid month (e.g. 13)
print("testing getting the report - invalid month (13)")
print("------------------------------")

try:
    text = ""
    
    # Requesting report for month 13
    url = c + "/api/report/?id=123123&year=2026&month=13"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting a report for a future date
print("testing getting the report - future date")
print("------------------------------")

try:
    text = ""
    
    # Requesting report for year 2030
    url = c + "/api/report/?id=123123&year=2030&month=1"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    print("data.text=")
    print(data.text)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing Computed Pattern: 
# Get report for a past date (should trigger calculation and save to DB)
print("testing getting the report - past date")
print("------------------------------")

try:
    text = ""
    
    # Using a specific past month (e.g., May 2020)
    url = c + "/api/report/?id=123123&year=2020&month=5"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    print("data.text=")
    print(data.text)

    print("\nPlease check that the report was added to the DB")

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Get the same report again from the DB
print("testing getting the report again")
print("------------------------------")

try:
    text = ""
    
    url = c + "/api/report/?id=123123&year=2020&month=5"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)
    print("data.text=")
    print(data.text)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting report for non-existent user
print("testing getting the report - non-existent user")
print("------------------------------")

try:
    text = ""
    
    url = c + "/api/report/?id=999999&year=2026&month=1"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting report with missing parameters (no year/month)
print("testing getting the report - missing parameters")
print("------------------------------")

try:
    text = ""
    
    # URL without year and month
    url = c + "/api/report/?id=123123"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")


print("Users Service ------------------------------")
# Testing getting all users (Initial)
print("testing getting all users")
print("------------------------------")

try:
    text = ""
    
    # Define the API endpoint for getting users
    url = b + "/api/users/"
    
    # Send a GET request
    data = requests.get(url)

    # Log the URL and response
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding a new user
print("testing adding new user")
print("------------------------------")

try:
    text = ""
    
    # Define the API endpoint for adding a user
    url = b + "/api/add/"
    
    # Send a POST request with valid user data
    # Using a unique ID (987654) and a past birthday
    data = requests.post(url, json={'id': 987654, 'first_name': 'New', 'last_name': 'Tester', 'birthday': '1995-05-05'})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting all users again (to verify addition)
print("testing getting all users - after addition")
print("------------------------------")

try:
    text = ""
    
    url = b + "/api/users/"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding user with missing parameter
print("testing adding user - missing parameter")
print("------------------------------")

try:
    text = ""
    
    url = b + "/api/add/"
    
    # Missing 'last_name'
    data = requests.post(url, json={'id': 987655, 'first_name': 'Incomplete', 'birthday': '1990-09-09'})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding user with existing ID (Duplicate)
print("testing adding user - duplicate ID")
print("------------------------------")

try:
    text = ""
    
    url = b + "/api/add/"
    
    # Trying to add a user with ID 987654 which was added previously
    data = requests.post(url, json={'id': 987654, 'first_name': 'Duplicate', 'last_name': 'User', 'birthday': '2000-01-01'})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing adding user with future birthday
print("testing adding user - future birthday")
print("------------------------------")

try:
    text = ""
    
    url = b + "/api/add/"
    
    # Trying to add a user with a future birthday (Year 2050)
    data = requests.post(url, json={'id': 333333, 'first_name': 'Future', 'last_name': 'Baby', 'birthday': '2050-01-01'})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting specific user details (The new user)
print("testing getting specific user - new user")
print("------------------------------")

try:
    text = ""
    
    # Request details for the newly created user
    url = b + "/api/users/987654"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# Testing getting specific user details (The original user)
print("testing getting specific user - original user")
print("------------------------------")

try:
    text = ""
    
    # Request details for user 123123
    url = b + "/api/users/123123"
    
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=")
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")