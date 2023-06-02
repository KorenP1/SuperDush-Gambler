FROM python:3.8
RUN mkdir /app && chmod 777 /app
WORKDIR /app
COPY . /app
RUN pip3 install -r requirements.txt
EXPOSE 8080
CMD ["python3", "SuperDushGambler.py"]