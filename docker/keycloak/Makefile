#-----------------------------------
# KeyCloak SPI Template
#-----------------------------------
# PHONY=偽物: Makefileと同じでぃれくとりにコマンド名と同じファイルが存在するとmakeコマンドが落ちるのを防ぐ
.PHONY: help

help:
	@grep "^[a-zA-Z\-]*:" Makefile | grep -v "grep" | sed -e 's/^/make /' | sed -e 's/://'

build:
	mvn clean package dependency:sources
	rm -f ./docker/keycloak/providers/*.jar
	cp -a ./target/keycloak-template-1.0-SNAPSHOT.jar ./docker/keycloak/providers/keycloak-template-1.0-SNAPSHOT.jar
	docker-compose -f docker/keycloak/docker-compose.yml down
	docker-compose -f docker/keycloak/docker-compose.yml -p keycloak up -d --build

log:
	docker logs keycloak_app

log_watch:
	docker logs keycloak_app -f

export:
	docker exec keycloak_app /opt/bitnami/keycloak/bin/kc.sh export --file /tmp/keycloak-realm-export.json
	docker cp keycloak_app:/tmp/keycloak-realm-export.json ./docker/keycloak/keycloak-realm-export.json

