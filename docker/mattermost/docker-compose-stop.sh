#!/bin/bash
docker-compose -f docker-compose.yml -f docker-compose.without-nginx.yml down
