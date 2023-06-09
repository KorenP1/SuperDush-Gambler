FROM python:alpine

RUN mkdir /app && chmod 777 /app

WORKDIR /app

COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python3", "SuperDushGambler.py"]