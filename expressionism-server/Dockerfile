FROM python:3.11

WORKDIR /expressionism-server

COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir

RUN apt-get update && \
    apt-get install -y texlive-latex-base && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y texlive-latex-extra


COPY . .

CMD ["python", "main.py"]
