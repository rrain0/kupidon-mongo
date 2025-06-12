

prod.pull:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env pull

prod.up:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env up -d --force-recreate

prod.build-up:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env up -d --force-recreate --build

prod.pull-build-up: prod.pull prod.build-up

prod.down:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env down



local.pull:
	docker compose -f docker-compose-local.yml --env-file mongo.local.env pull

local.up:
	docker compose -f docker-compose-local.yml --env-file mongo.local.env up -d --force-recreate

local.build-up:
	docker compose -f docker-compose-local.yml --env-file mongo.local.env up -d --force-recreate --build

local.pull-build-up: local.pull local.build-up

local.down:
	docker compose -f docker-compose-local.yml --env-file mongo.local.env down



dev.pull:
	docker compose -f docker-compose-dev.yml --env-file mongo.dev.env pull

dev.up:
	docker compose -f docker-compose-dev.yml --env-file mongo.dev.env up -d --force-recreate

dev.build-up:
	docker compose -f docker-compose-dev.yml --env-file mongo.dev.env up -d --force-recreate --build

dev.pull-build-up: dev.pull dev.build-up

dev.down:
	docker compose -f docker-compose-dev.yml --env-file mongo.dev.env down
