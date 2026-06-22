start-docker-api:
    docker compose --env-file .env.dev up api --build

stop-docker-api:
    docker compose --env-file .env.dev down api -v

start-docker-client:
    docker compose --env-file .env.dev up client --build

stop-docker-client:
    docker compose --env-file .env.dev down client -v

start-docker:
    docker compose --env-file .env.dev up --build

stop-docker:
    docker compose --env-file .env.dev down -v

# Completely purge all node_modules to reset the workspace dependency tree
clean-deps:
    rm -rf node_modules
    rm -rf apps/api/node_modules
    rm -rf apps/client/node_modules
    rm -rf .turbo
