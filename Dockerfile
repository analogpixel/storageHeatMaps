from centos

RUN mkdir /app

COPY src/main.py  /app
COPY src/static/  /app/static/
COPY src/templates/ /app/templates/

run yum -y install epel-release
run yum install -y python python-pip python-devel
run yum groupinstall -y "Development Tools"

run pip install flask
run pip install pandas
run pip install elasticsearch 

expose 5000

WORKDIR /app
ENTRYPOINT ["python"]
CMD ["main.py"]

