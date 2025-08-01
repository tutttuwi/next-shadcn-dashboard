#-----------------------------------
# KeyCloak SPI Template
#-----------------------------------
# PHONY=偽物: Makefileと同じでぃれくとりにコマンド名と同じファイルが存在するとmakeコマンドが落ちるのを防ぐ
.PHONY: help

help:
	@grep "^[a-zA-Z\-]*:" Makefile | grep -v "grep" | sed -e 's/^/make /' | sed -e 's/://'

up:
	docker-compose -f docker/keycloak/docker/keycloak/docker-compose.yml up -d
	docker-compose -f docker/limesurvey/docker-compose.yml up -d
	docker-compose -f docker/mattermost/docker-compose.yml -f docker/mattermost/docker-compose.nginx.yml up -d

down:
	docker-compose -f docker/keycloak/docker/keycloak/docker-compose.yml down
	docker-compose -f docker/limesurvey/docker-compose.yml down
	docker-compose -f docker/mattermost/docker-compose.yml -f docker/mattermost/docker-compose.nginx.yml down

