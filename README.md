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
