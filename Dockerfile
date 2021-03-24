#
# ---- Base meio/php ----
# https://hub.docker.com/r/meio/php/tags?page=1&ordering=last_updated
FROM meio/php:8.0.3

ARG BUILD_NR
ENV BUILD_NR=${BUILD_NR}

ARG BUILD_DATE
ENV BUILD_DATE=${BUILD_DATE}

ARG BUILD_BRANCH
ENV BUILD_BRANCH=${BUILD_BRANCH}

ARG BUILD_COMMIT
ENV BUILD_COMMIT=${BUILD_COMMIT}

ENV NODE_OPTIONS="--max_old_space_size=8192"

# set working directory
WORKDIR /var/www/app

COPY . .

# Install latest nginx and supervisor
RUN apt-get update && apt-get install -y curl gnupg2 ca-certificates lsb-release vim procps supervisor && \
  echo "deb http://nginx.org/packages/mainline/debian `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list && \
  curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add - && \
  apt-get update && apt-get install -y nginx

COPY ./.scripts/supervisord.conf /supervisord.conf
COPY ./.scripts/default.conf /etc/nginx/conf.d/default.conf
COPY .scripts/cors.conf /var/nginx-config/cors.conf

# expose port and define CMD

EXPOSE 9000 80

CMD ["supervisord", "-c", "/supervisord.conf"]
