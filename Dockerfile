FROM tecknicos/devops-cli:1.0.0

WORKDIR /setup

ADD . .

RUN pip install .

RUN pip install btecli

RUN ecli plugins.install -R -r https://github.com/berttejeda/bert.ecli.plugins.git

RUN ecli plugins.install -R -r https://github.com/berttejeda/bert.dashboard.plugins.git

WORKDIR /app

RUN sudo rm -rf /setup

RUN mkdir etc

ADD etc/ etc/

ADD entrypoint.sh /usr/local/bin

RUN sudo chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "entrypoint.sh" ]