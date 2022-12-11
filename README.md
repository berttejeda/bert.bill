<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [BILL - Bert's Interactive Lesson Loader](#bill---berts-interactive-lesson-loader)
- [Overview](#overview)
    - [What is this and why did you make it?](#what-is-this-and-why-did-you-make-it)
    - [How did you make this?](#how-did-you-make-this)
    - [What's it look like?](#whats-it-look-like)
- [Features](#features)
- [Quick Start](#quick-start)
    - [Step 1 - Install](#step-1---install)
    - [Step 2 - Create your configuration file](#step-2---create-your-configuration-file)
    - [Step 3 - Launch!](#step-3---launch)
        - [Usage](#usage)
- [Building the app](#building-the-app)
- [Building the installer](#building-the-installer)
- [Developing the app](#developing-the-app)
- [Configuration File](#configuration-file)
    - [Configuration File - Defaults](#configuration-file---defaults)
    - [Storing credentials - OS Keyring](#storing-credentials---os-keyring)
        - [Windows](#windows)
- [Lessons](#lessons)
    - [Jinja Templating](#jinja-templating)
- [WebTerminal](#webterminal)
- [Appendix](#appendix)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

BILL - Bert's Interactive Lesson Loader
===================

<a name="top"></a>
<a name="overview"></a>
# Overview

<a name="what-is-this-and-why-did-you-make-it"></a>    
## What is this and why did you make it? 

Think [Katacoda](https://www.katacoda.com/), but instead of a website with learning examples, 
you have a web app that creates hands-on lessons from markdown-formatted, jina-templated documents, 
complete with a web terminal for interactive practice.

<a name="how-did-you-make-this"></a>    
## How did you make this?

- The UI is written in [ReactJS](https://reactjs.org/)
- The API is using [Flask](https://flask.palletsprojects.com/en/2.1.x/) 

<a name="whats-it-look-like"></a>    
## What's it look like?

Here's a screenshot:

![webterminal](res/webterminal.gif)

Notice the menu dropdown for _Available Lessons_.
The entries are generated dynamically as defined in the app's [configuration file](#configuration-file).

<a name="features"></a>
# Features

* Define your lessons catalog in a YAML-formatted configuration file, e.g. [lessons.yaml.example](lessons.yaml.example)
* [Lessons](#Lessons) are Markdown-formatted files
  1. First rendered as [jinja](https://jinja.palletsprojects.com/en/3.0.x/) templates
  1. Then rendered as HTML<br />
* Web-based terminals via [xtermjs](https://github.com/xtermjs/xterm.js/) component<br />
  See section on [WebTerminal](#WebTerminal)
* Local Webterminal websocket is also available
  * Utilizes [spyder-terminal](https://github.com/spyder-ide/spyder-terminal) component
  * You can practice the lesson material with your own OS/system
    * Simply **click** on a command, and it will be executed in the underlying shell via web terminal!
    * Default shell is bash (for now)

<a name="quick-start"></a>
# Quick Start
  
<a name="step-1---install"></a>
## Step 1 - Install

**Note** You'll need a minimum python version of 3.7 for the app to work

You can install the app in any of the following ways:

* Install pip package from pypi.org: `pip install bertdotbill`
* Install pip package from locally cloned repo: <br />
```
git clone https://github.com/berttejeda/bert.bill.git
cd bert.bill
nvm install
npm install -g parcel yarn
yarn install --frozen-lockfile
yarn compile:ui:dev
pip install .
```
  * From the above, [nvm](https://github.com/nvm-sh/nvm) is used to install 
  [nodejs](https://nodejs.org/en/), and we use [yarn](https://yarnpkg.com/) for installing package dependencies,
  and [parcel](https://parceljs.org/) for the web build.
  * [.nvmrc](.nvmrc) is set to use node v16.5.0
  * To install from the locally cloned repo in development mode, do the same as above, but with `pip install -e .` instead
* You can install the pip package directly from git repo `pip install git+http://www.github.com/berttejeda/bert.bill.git`,<br />
  but you'll need to obtain the HTML assets and point the app to them, see the [Appendix](#appendix)

<a name="step-2---create-your-configuration-file"></a>
## Step 2 - Create your configuration file

Using the provided sample config [lessons.yaml.example](lessons.yaml.example),
you can create your own default configuration file, ensuring the following:
- If no config name is explicitly specified:
    - The file name should be _lessons.yaml_
    - The file should be located in one of the app's search paths,<br />
      see the section on [Configuration File](#configuration-file)
- To specify a config file explicitly from the cli you can use either of `--config-file` or `-f` flag, as with `bill -f path/to/your/config.yaml`
- HTTP(S) web paths are also valid, as with `bill -f http://some.website.com/path/to/your/config.yaml`  

<a name="step-3---launch"></a>
## Step 3 - Launch!

* If installed via pip, launch the app from your terminal: `bill`
* If installed via pip as a [development instance](#step-1---install), launch via python with `python ./bertdotbill/app.py`<br />

<a name="usage"></a>
### Usage

Usage information can be obtained by invoking the executable with the `--help` flag, as with: `bill --help` or `python ./bertdotbill/app.py --help`.

The help output should be similar to:

```
usage: bill   [-h] [--username USERNAME] [--password PASSWORD]
              [--lesson-url LESSON_URL]
              [--static-assets-folder STATIC_ASSETS_FOLDER]
              [--config-file CONFIG_FILE] [--cors-origin CORS_ORIGIN]
              [--logfile-path LOGFILE_PATH] [--host-address HOST_ADDRESS]
              [--port PORT]
              [--webterminal-listen-host WEBTERMINAL_LISTEN_HOST]
              [--webterminal-listen-port WEBTERMINAL_LISTEN_PORT]
              [--webterminal-host WEBTERMINAL_HOST]
              [--webterminal-shell WEBTERMINAL_SHELL]
              [--webterminal-shell-command WEBTERMINAL_SHELL_COMMAND]
              [--open-browser-delay OPEN_BROWSER_DELAY]
              [--logfile-write-mode {a,w}] [--config-file-templatized]
              [--api-only] [--webterminal-only] [--all-in-one] [--debug]
              [--no-verify-tls] [--no-render-markdown]

Bert's Interactive Lesson Loader (BILL)

positional arguments:
  run

optional arguments:
  -h, --help            show this help message and exit
  --username USERNAME, -U USERNAME
                        Username, if the URL requires authentication
  --password PASSWORD, -P PASSWORD
                        Password, if the URL requires authentication
  --lesson-url LESSON_URL, -url LESSON_URL
                        The URL for the lesson definition
  --static-assets-folder STATIC_ASSETS_FOLDER, -S STATIC_ASSETS_FOLDER
                        Explicity specify the folder for static HTML assets
  --config-file CONFIG_FILE, -f CONFIG_FILE
                        Path to app configuration file
  --cors-origin CORS_ORIGIN, -o CORS_ORIGIN
                        Override CORS origin pattern
  --logfile-path LOGFILE_PATH, -L LOGFILE_PATH
                        Path to logfile
  --host-address HOST_ADDRESS, -l HOST_ADDRESS
                        Override default host address
  --port PORT, -p PORT  Override default listening port
  --webterminal-listen-host WEBTERMINAL_LISTEN_HOST, -wlh WEBTERMINAL_LISTEN_HOST
                        Override default listening host address for the
                        webterminal socket
  --webterminal-listen-port WEBTERMINAL_LISTEN_PORT, -wlp WEBTERMINAL_LISTEN_PORT
                        Override default listening port for the webterminal
                        socket
  --webterminal-host WEBTERMINAL_HOST, -wh WEBTERMINAL_HOST
                        Override the webterminal socket address to which the
                        UI initially connects
  --webterminal-shell WEBTERMINAL_SHELL, -wS WEBTERMINAL_SHELL
                        Override default shell for the webterminal session
  --webterminal-shell-command WEBTERMINAL_SHELL_COMMAND, -wSc WEBTERMINAL_SHELL_COMMAND
                        Override default shell command for the webterminal
                        session
  --open-browser-delay OPEN_BROWSER_DELAY, -bd OPEN_BROWSER_DELAY
                        Override default time in seconds to delay when opening
                        the system's web browser
  --logfile-write-mode {a,w}, -w {a,w}
                        File mode when writing to log file, 'a' to append, 'w'
                        to overwrite
  --config-file-templatized, -fT
                        Render configuration via jinja2 templating
  --api-only            Don't serve static assets, only start API
  --webterminal-only    Don't serve static assets or start API, only invoke
                        Webterminal Websocket
  --all-in-one, -aio    Run the shell websocket process alongside app
  --debug
  --no-verify-tls, -notls
                        Verify SSL cert when downloading web content
  --no-render-markdown, -nomarkdown
```

<a name="building-the-app"></a>
# Starting the development instance of the app

* Install Python 3.7+
* Install this project's required version of [nodejs](https://nodejs.org/en/) (v16.5.0): `nvm install`<br />
  Note that this command implicitly reads the local [.nvmrc](.nvmrc)
* Install yarn & parcel: `npm install -g yarn parcel`
* Install node modules: `yarn install --frozen-lockfile`
* Install python prerequisites: `pip3 install -e .`
* Launch the development instance of the UI: `yarn start:dev:ui`<br />
* Launch the api and local webterminal process: `yarn start:api`<br />
  Under the hood, this launches `python bertdotbill/app.py --debug --api-only -aio`, 
  see [package.json](package.json)

[Back to Top](#top)
<a name="developing-the-app"></a>
# Developing the app

Starting the development instance of the UI will cause it to reload
whenever you make changes to any of the UI 
files under the [src](src) folder.

This functionality helps increase UI development velocity.

I have not yet implemented similar functionality for the API files under [bertdotbill](bertdotbill),
so you'll have to kill and reload the API whenever you make changes.

<a name="configuration-file"></a>
# Configuration File

The configuration file is read by the Flask API process, 
and is a YAML-formatted file.

As mentioned above, a sample configuration file is provided: 
[lessons.yaml.example](lessons.yaml.example)

If no configuration is specified via the cli, 
the web app will attempt to find the config file in the 
following locations:

- Under ~/lessons.yaml
- Adjacent to the app, i.e. ./lessons.yaml
- Under ~/.bill/lessons.yaml
- Under /etc/lessons.yaml

Do review the comments in the sample file, as these explain how the sections are interpreted/handled by the UI.

<a name="configuration-file---defaults"></a>
## Configuration File - Defaults

If no settings can be found, the app will resort to its defaults, 
see [defaults.py](bertdotbill/defaults.py) 

As such, the defaults settings call for the import of an external config, hosted in my [bert.lessons](https://github.com/berttejeda/bert.lessons) repo: <br />
see [bert.lessons/lessons.yaml](https://raw.githubusercontent.com/berttejeda/bert.lessons/main/lessons.yaml)

This external config is where I am listing all of my (mostly) hand-crafted tutorials and learning materials.

<a name="lessons"></a>
# Lessons

As already mentioned, lessons are Markdown-formatted 
files interpreted as [jinja](https://jinja.palletsprojects.com/en/3.0.x/) 
templates.

You can define a lesson catalog in the 
[configuration file](lessons.yaml.example).

If these files are stored in a password-protected web location, 
you'll need to specify credentials via the cli with `--username` and `--password`<br />
or via environmental variables `GLOBAL_USERNAME` and `GLOBAL_PASSWORD`

## TODO 

Implement per-lesson credentials

<a name="jinja-templating"></a>
## Jinja Templating

To add to the templating goodies provided by the Jinja library,
I've exposed the OS Environment via the _environment_ key of a
special variable named _session_.

This means you should be able to dynamically load any OS-level environment 
variable into your lesson material, e.g. 

```markdown
# Overview

{% set USERNAME = session['environment'].get('USER') or session['environment'].get('USERNAME')  %}
Hello {{ USERNAME }}, welcome to Lesson 1
```

<a name="webterminal"></a>
# WebTerminal

Every lesson rendered through the app includes a web-based terminal 
emulator component that allows for practicing the lesson material.

These web terminals are embedded in the user interface, 
available at its footer.

As mentioned before, the underlying technology for these web 
terminals is [xterm.js](https://github.com/xtermjs/xterm.js/).

As such, the xterm.js component requires a websocket to a bash process.

By [default](bertdotbill/defaults.py), the bert.bill web app 
will attempt to connect to a local instance of the websocket via _http://127.0.0.1:10000/_.

You can get this websocket running either by:

- Installing bertdotbill with `pip install bertdotbill` and running `bill -aio` or by installing all requirements and running `python bertdotbill/app.py -aio`<br />
  Doing so will launch a local websocket that forwards keystrokes to a bash process on your system
- Running the pre-built docker image: `docker run -it --name webterminal --rm -p 10001:10001 berttejeda/bill-webterminal`

Either of the commands above will start the websocket 
and bash process on localhost:10001.

Feel free to adjust either approach to your need.

Read more [bert.bill.webterminal github project](https://github.com/berttejeda/bert.bill.webterminal)

# Appendix