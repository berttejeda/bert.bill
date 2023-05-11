#!/bin/bash

set -e

echo "Starting Main Process ..."

if [[ -f .env ]];then
  # Export variables defined in .env file
  # without overwriting any existing environment variables
  source .env
  export $(grep -v -f <(echo -e "$(env)") <(echo -e "$(cut -d= -f1 .env)"))
fi

echo "Startup Command is bill ${@}"
bill $@