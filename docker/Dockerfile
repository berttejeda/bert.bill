FROM tecknicos/devops-cli:1.0.1

RUN sudo apt update 

RUN sudo apt install nginx -y

RUN sudo mkdir -p /var/log/nginx

WORKDIR /setup

ADD . .

RUN pip install .

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
ENV USER_PYTHON_LOCAL=/opt/python/.local
ENV USER_PYTHON_LIB=$USER_PYTHON_LOCAL/lib
ENV USER_PYTHON_BIN=$USER_PYTHON_LOCAL/bin
ENV PATH="$USER_PYTHON_BIN:$PATH"

RUN echo "===> Creating service user ..."  &&\
sudo useradd -m -s /bin/bash -G sudo,docker --uid "$UID" "$USER"

USER $USER

WORKDIR $USERHOME

RUN ecli plugins.install -R -r https://github.com/berttejeda/bert.dashboard.plugins.git

ENTRYPOINT [ "entrypoint.sh" ]