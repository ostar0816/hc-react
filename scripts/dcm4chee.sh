#!/bin/sh

docker network create dcm4chee_default
docker run --network=dcm4chee_default --name ldap \
           -p 389:389 \
           -v /dcm4che/ldap:/var/lib/ldap \
           -v /dcm4che/ldap_etc:/etc/ldap/slapd.d \
           -d dcm4che/slapd-dcm4chee:2.4.44-13.1

docker run --network=dcm4chee_default --name db \
           -p 5432 \
           -e POSTGRES_DB=pacsdb \
           -e POSTGRES_USER=pacs \
           -e POSTGRES_PASSWORD=pacs \
           -v /dcm4che/postgre:/var/lib/postgresql/data \
           -d dcm4che/postgres-dcm4chee:10.0-13

docker run --network=dcm4chee_default --name arc \
           -p 9080:8080 \
           -p 9443:8443 \
           -p 9990:9990 \
           -p 11112:11112 \
           -p 2575:2575 \
           -e POSTGRES_DB=pacsdb \
           -e POSTGRES_USER=pacs \
           -e POSTGRES_PASSWORD=pacs \
           -e WILDFLY_WAIT_FOR="ldap:389 db:5432" \
           -v /dcm4che/dcm4che:/opt/wildfly/standalone \
           -d dcm4che/dcm4chee-arc-psql:5.13.1
