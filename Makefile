build:
	docker-compose build

down:
	docker-compose down

DCD=docker-compose -f docker-compose.yml -f docker-compose.dev.yaml
dev:
	${DCD} up

dback:
	bash ./devback

dfront:
	bash ./devfront

