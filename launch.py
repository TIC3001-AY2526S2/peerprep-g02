import subprocess

services = [
    ["uvicorn", "peerprep_backend.user_service.app.main:app", "--port", "5001", "--reload"],
    ["uvicorn", "peerprep_backend.question_service.app.main:app", "--port", "5002", "--reload"],
    ["uvicorn", "peerprep_backend.api_gateway.app.main:app", "--port", "5000", "--reload"],
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