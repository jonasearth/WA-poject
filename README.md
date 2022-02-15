# clinic-core

## Starting the application

First we need to create an external network with Docker. This is necessary for your service to see and be seen by other services.
Because of that it is important that your services have unique hostnames across the project.

```bash
docker network create services
```

Then you can copy the `.env.example` file to `.env` and fill the appropriate values

This repository differs from others due to the fact that it contains a single service. This is due to the fact that this is an entrypoint service and will likely grow and have the need to scale individually.

```bash
docker-compose run --rm node npm i
```

To start the project, install the dependencies and run

```bash
docker-compose up
```

## Running tests

Just run the commands bellow (you can pass --service-ports if you want to attach a debugger)

```bash
docker-compose run --rm node npm run test # Run tests normally

docker-compose run --rm node npm run test:watch # Run tests in watch mode

docker-compose run --rm node npm run test:debug # Run tests in debug mode

docker-compose run --rm node npm run test:cov # Run tests with coverage report
```

Coverage reports are displayed on terminal, as a json file in `coverage/coverage-final.json` and as html.
To open html coverage run:

```bash
firefox coverage/lcov-report/index.html
```
## Knex cli commands

We provide the following knex commands.

```bash
docker-compose run --rm node npm run ts-knex # for typescript

docker-compose run --rm node npm run knex # for plain javascript
```

These commands accept the same options as knex commands, for example:

```bash
    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts migrate:make -x ts migration-name # Create a migration in typescript

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts seed:make -x ts seed-name # Create a seed in typescript

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts migrate:latest # Run all migrations in typescript

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts migrate:rollback # Rollback a single migration in typescript
    # example: docker-compose run --rm node npm run ts-knex -- --knexfile=src/juridical-person/database/knexfile.ts migrate:rollback

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts seed:run # Run all seeds in typescript
    # To run a specific seed, add --specific=seed-file.ts to the end of the command

    docker-compose run --rm node npm run knex -- --knexfile=my-knexfile.js migrate:latest # Run all migrations in javascript

    docker-compose run --rm node npm run knex -- --knexfile=my-knexfile.js migrate:rollback # Rollback a single migration in javascript

    docker-compose run --rm node npm run knex -- --knexfile=my-knexfile.js seed:run # Run all seeds in javascript
```

It is important to not mix typescript and javascript commands. Always use typescript for development to avoid corrupt directory errors and so you can seed an run migrations in your tests.


## Running eslint

The command bellow will autofix every eslint/prettier problem in src files

```bash
docker-compose run --rm node npm run lint
```

## Openapi

Openapi docs are available at the openapi folder. You can see the docs by starting the containers using:

```bash
docker-compose -f docker-compose.swagger.yml up
```

After that go to `localhost:8081/swagger` and type `/swagger/api.yaml` in the explore input to see your docs. Changes to the docs are made in real-time.

### Validate docs

```bash
docker-compose -f docker-compose.swagger.yml run --rm swagger-tools swagger-cli validate api.yaml
```

### Generate bundle for production

```bash
docker-compose -f docker-compose.swagger.yml run --rm swagger-tools swagger-cli bundle -t yaml -o bundle.yaml api.yaml
```
