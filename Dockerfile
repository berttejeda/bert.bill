FROM node:16.15.1

USER root

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get install -y \
    bash \
    curl \
    python3-pip \
    sshpass git \
    openssh-client \
    vim \
    jq && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean


SHELL ["/bin/bash", "-exo", "pipefail", "-c"] 

WORKDIR /workspace

COPY entrypoint.sh /usr/local/bin

RUN chmod +x /usr/local/bin/entrypoint.sh

ARG SSL_VERIFY=on
ENV SSL_VERIFY=$SSL_VERIFY

RUN if [[ "$SSL_VERIFY" == "off" ]]; then \
      npm config set strict-ssl false -g; \
    fi

RUN npm install --location=global nodemon


ENV NODE_HOME=/home/node

WORKDIR /setup

ADD . .

RUN if [[ "$SSL_VERIFY" == "off" ]]; then \
      yarn config set "strict-ssl" false; \
    fi

RUN yarn install && yarn build

RUN rm -rf node_modules

RUN if [[ "$SSL_VERIFY" == "off" ]]; then \
      pip3 install --trusted-host=pypi.org --trusted-host=github.com \
      --trusted-host=files.pythonhosted.org --upgrade pip; \
      pip3 install --trusted-host=pypi.org --trusted-host=github.com \
      --trusted-host=files.pythonhosted.org --upgrade setuptools; \      
      pip3 install --trusted-host=pypi.org --trusted-host=github.com \
      --trusted-host=files.pythonhosted.org --upgrade .; \
    else \
      python3 -m pip install --upgrade pip; \
      python3 -m pip install --upgrade setuptools; \
      python3 -m pip install .; \
    fi

WORKDIR /home/node

RUN rm -rf /setup

USER node

ENV PATH=$NODE_HOME/bin:$NODE_HOME/.local/bin:$PATH

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]