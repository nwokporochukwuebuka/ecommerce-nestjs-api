# First we run the postgres command
.PHONY: postgres-run
postgres-run:
	docker run -d --name postgres-container\
    -v pgdata:/var/lib/postgresql/data \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=nest-commerce \
    -p 5432:5432 \
    postgres:15.6


.PHONY: compose-build
compose-build:
	docker-compose -f docker-compose-dev.yml build

.PHONY: compose-up
compose-up:
	docker-compose -f docker-compose-dev.yml up

.PHONY: compose-down
compose-down:
	docker compose -f docker-compose-dev.yml down