#-----------------------------------
# KeyCloak SPI Template
#-----------------------------------
# PHONY=偽物: Makefileと同じディレクトリにコマンド名と同じファイルが存在するとmakeコマンドが落ちるのを防ぐ
.PHONY: help

help:
	@grep "^[a-zA-Z\-]*:" Makefile | grep -v "grep" | sed -e 's/^/make /' | sed -e 's/://'

build:
	docker-compose -f docker-compose.yml -f docker-compose.nginx.yml down
	docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up -d

up:
	docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up -d

down:
	docker-compose -f docker-compose.yml -f docker-compose.nginx.yml down

export:
	docker exec keycloak_app /opt/bitnami/keycloak/bin/kc.sh export --file /tmp/keycloak-realm-export.json
	docker cp keycloak_app:/tmp/keycloak-realm-export.json ./docker/keycloak/keycloak-realm-export.json

