FROM tecknicos/devops-cli:1.0.0

WORKDIR /setup

RUN sudo apt update 

RUN sudo apt install nginx -y

RUN sudo mkdir -p /var/log/nginx

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

ENV USER=bill
ENV GROUP=bill
ENV USERHOME=/home/$USER
ENV UID=6000

RUN echo "===> Creating service user ..."  &&\
sudo useradd -m -s /bin/bash -G sudo,docker --uid "$UID" "$USER"

USER $USER

WORKDIR $USERHOME

ENTRYPOINT [ "entrypoint.sh" ]