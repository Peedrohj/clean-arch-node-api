FROM node:14.17.0-slim

# Install base dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    wget \
    openssh-client

# Install GCC, Make, libpq-dev (for psicopg) and procps
RUN apt-get install -y gcc libpq-dev make graphviz procps gettext-base

# Install Postgres Client
RUN mkdir -p /usr/share/man/man1 \
    && mkdir -p /usr/share/man/man7 \
    && apt-get install -y postgresql-client

# Create node user 
RUN usermod -u 1002 node
USER node
WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]