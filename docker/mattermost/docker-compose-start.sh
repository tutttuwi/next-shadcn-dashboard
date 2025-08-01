#!/bin/bash
docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up -d
# docker-compose -f docker-compose.yml -f docker-compose.without-nginx.yml up -d
