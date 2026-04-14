FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY run_code_service/app .

EXPOSE 3000

CMD ["uvicorn", "app.main:socket_app", "--host", "0.0.0.0", "--port", "5000"]