import subprocess

services = [
    ["uvicorn", "user_service.app.main:app", "--port", "5001"],
    ["uvicorn", "question_service.app.main:app", "--port", "5002"],
    ["uvicorn", "api_gateway.app.main:app", "--port", "5000"],
]

processes = []

for service in services:
    processes.append(subprocess.Popen(service))

try:
    for p in processes:
        p.wait()
except KeyboardInterrupt:
    for p in processes:
        p.terminate()