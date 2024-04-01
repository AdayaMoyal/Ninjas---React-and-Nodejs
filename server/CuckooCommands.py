import requests
import time
import sys
import json

REPORT_NOT_FOUND = "Report not found"
FILE_REQUEST = "File"
URL_REQUEST = "URL"
CUCKOO_URL = "192.168.63.129:8095"
HEADERS = {
    'Authorization': 'Bearer 3R2HiVwRjEg_OvvPSEc-mg'
    }
def submitFunctionFile():
    filePath = sys.argv[1]
    url = 'http://'+CUCKOO_URL+'/tasks/create/file'
    with open(filePath, 'rb') as file:
        files = {'file': (filePath, file)}
        response = requests.post(url, headers=HEADERS, files=files)

    if response.status_code == 200:
        task_id = response.json()['task_id']
        getReport(task_id)

def saveResultInFile(data):
    data = saveData(data)
    with open('./result.txt', 'w') as file:
        file.write(data)

def organizeData(data):
    data = data.replace("{", "")
    data = data.replace("}", "")
    data = data.replace("u'", "")
    data = data.replace("'", "")
    return data

def saveData(data):
    organizedData = ""
    data = json.loads(data)
    for key, value in data.items():
        organizedData += str(key) + ":" + str(value) + "\n" 
    organizedData = organizeData(organizedData)
    return organizedData

def submitFunctionURL():
    report_data = ""
    URLPath = sys.argv[1]
    url = 'http://'+CUCKOO_URL+'/tasks/create/url'
    urlParam = {
    'url': URLPath
    }
    
    response = requests.post(url, headers=HEADERS, data=urlParam)
    if response.status_code == 200:
        task_id = response.json()['task_id']
        getReport(task_id)

def getReport(task_id):
    url = 'http://'+CUCKOO_URL+'/tasks/summary/'
    report_url = url + str(task_id)
    time.sleep(180)
    response = requests.get(report_url, headers=HEADERS)
    report_data = response.text
    saveResultInFile(report_data)
    
def main():
    request = sys.argv[2]
    if FILE_REQUEST == request:
        submitFunctionFile()
    else:
        submitFunctionURL()

if __name__ == "__main__":
    main()
