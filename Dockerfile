FROM mysql:latest

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* $ && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
RUN apt-get update && apt-get install -y procps
ENV LANG=C.UTF-8

COPY ./sql/ /docker-entrypoint-initdb.d/
COPY ./my.cnf /etc/mysql/my.cnf
EXPOSE 3306
