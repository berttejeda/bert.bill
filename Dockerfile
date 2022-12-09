FROM node:18.0.0 as build

SHELL ["/bin/bash", "-exo", "pipefail", "-c"] 

ARG SSL_VERIFY=on
ENV SSL_VERIFY=$SSL_VERIFY

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

RUN if [[ "$SSL_VERIFY" == "off" ]]; then \
      npm config set strict-ssl false -g; \
      yarn config set "strict-ssl" false; \
    fi

RUN npm install -g nodemon

# ENV NODE_HOME=/home/node

WORKDIR /setup

ADD . .

RUN yarn install --frozen lockfile 

RUN yarn build

RUN if [[ "$SSL_VERIFY" == "off" ]]; then \
      pip3 install --trusted-host=pypi.org --trusted-host=github.com \
      --trusted-host=files.pythonhosted.org --upgrade pip; \
      pip3 install --trusted-host=pypi.org --trusted-host=github.com \
      --trusted-host=files.pythonhosted.org --upgrade setuptools 'pyinstaller>=5.7.0<6.0.0'; \      
      pip3 install --trusted-host=pypi.org --trusted-host=github.com \
      --trusted-host=files.pythonhosted.org --upgrade .; \
    else \
      python3 -m pip install --upgrade pip; \
      python3 -m pip install --upgrade setuptools 'pyinstaller>=5.7.0<6.0.0'; \
      python3 -m pip install .; \
    fi

RUN mv lessons.yaml.example lessons.yaml && pyinstaller -n bill \
--distpath dist \
--add-data bill.gui:bill.gui \
--add-data lessons.yaml:lessons.yaml \
$(sed -n '/^install_requires/,/^$/p' setup.cfg | sed  -e 's/ //g' -e '1d;$d' -e 's/>.*//g' -e 's/=.*//g' -e 's/^\(.*\)/--hidden-import "\1"/g') \
--onedir bertdotbill/app.py

RUN pip install -t dist/bill .

FROM python:3.9-slim

COPY --from=build /setup/dist/bill /app

COPY entrypoint.sh /usr/local/bin

RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app

# ENV PATH=$NODE_HOME/bin:$NODE_HOME/.local/bin:$PATH

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]