


prod.up:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env pull
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env up   -d --force-recreate

prod.build-up:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env pull
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env up   -d --force-recreate --build

prod.down:
	docker compose -f docker-compose-prod.yml --env-file mongo.prod.env down



local.up:
	docker compose -f docker-compose.yml --env-file mongo.local.env pull
	docker compose -f docker-compose.yml --env-file mongo.local.env up   -d --force-recreate

local.build-up:
	docker compose -f docker-compose.yml --env-file mongo.local.env pull
	docker compose -f docker-compose.yml --env-file mongo.local.env up   -d --force-recreate --build

local.down:
	docker compose -f docker-compose.yml --env-file mongo.local.env down
