


dev--up:
	docker-compose -f docker-compose-dev-mongo.yaml --env-file mongo.dev.env pull
	docker-compose -f docker-compose-dev-mongo.yaml --env-file mongo.dev.env up -d --force-recreate

dev--build-up:
	docker-compose -f docker-compose-dev-mongo.yaml --env-file mongo.dev.env pull
	docker-compose -f docker-compose-dev-mongo.yaml --env-file mongo.dev.env up -d --force-recreate --build

dev--down:
	docker-compose -f docker-compose-dev-mongo.yaml --env-file mongo.dev.env down
