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
    - [OS Commands](#os-commands)

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
- Markdown rendering rendering the optimized HTML assets.

<a name="whats-it-look-like"></a>    
## What's it look like?

Here's a screenshot:

![webterminal](res/webterminal.gif)

Notice the menu dropdown for _Available Lessons_.
The entries are generated dynamically as defined in the app's [configuration file](#configuration-file).

<a name="features"></a>
# Features

* Define your lessons catalog in a YAML-formatted configuration file, e.g. [bill.config.yaml.example](bill.config.yaml.example)
* [Lessons](#Lessons) are Markdown-formatted files
  1. First rendered as [jinja](https://jinja.palletsprojects.com/en/3.0.x/) templates
  1. Then rendered as HTML<br />
* Web-based terminals via [xtermjs](https://github.com/xtermjs/xterm.js/) component<br />
  See section on [WebTerminal](#WebTerminal)
* Local Webterminal websocket is also available
  * On Windows, via [spyder-terminal](https://github.com/spyder-ide/spyder-terminal) component
  * On Posix-compliant systems (e.g. OSX, Linux), via [aiohttp](https://github.com/aio-libs/aiohttp)
  * As such, you can practice the lesson material with your own OS/system
    * Simply click on a command, and it will be executed in the underlying shell via web terminal!
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
yarn compile:ui:dev
pip install .
```
  * As you'll notice, [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) are also required in this case
  * The HTML assets were built using node v16.5.0
  * To install from the locally cloned repo in development mode, do the same as above, but with `pip install -e .` instead
* You can install the pip package directly from git repo `pip install git+http://www.github.com/berttejeda/bert.bill.git`,<br />
  but you'll need to obtain the HTML assets and point the app to them, see the [Appendix](#appendix)

<a name="step-2---create-your-configuration-file"></a>
## Step 2 - Create your configuration file

Using the provided sample config [bill.config.yaml.example](bill.config.yaml.example),
you can create your own default configuration file, ensuring the following:
- The file name is _bill.config.yaml_
- The file is located in one of the app's search paths, 
  see the section on [Configuration File](#configuration-file)
- You can always specify the config file explicitly from the cli, as with `bill -f path/to/your/config.yaml`
- HTTP(S) are also valid, as with `bill -f http://some.website.com/path/to/your/config.yaml`  

<a name="step-3---launch"></a>
## Step 3 - Launch!

* If installed via pip, launch the app from your terminal: `bill`
* If installed via pip as a [development instance](#step-1---install), launch via python with `python ./bertdotbill/app.py`<br />

<a name="usage"></a>
### Usage

Usage information can be obtained by invoking the executable with the `--help` flag, as with: `bill --help` or `python ./bertdotbill/app.py --help`.

The help output should be similar to:

```
usage: app.py [-h] [--username USERNAME] [--password PASSWORD]
              [--lesson-url LESSON_URL]
              [--static-assets-folder STATIC_ASSETS_FOLDER]
              [--config-file CONFIG_FILE] [--cors-origin CORS_ORIGIN]
              [--logfile-path LOGFILE_PATH] [--host-address HOST_ADDRESS]
              [--port PORT]
              [--webterminal-host-address WEBTERMINAL_HOST_ADDRESS]
              [--webterminal-port WEBTERMINAL_PORT]
              [--open-browser-delay OPEN_BROWSER_DELAY]
              [--logfile-write-mode {a,w}] [--config-file-templatized]
              [--api-only] [--all-in-one] [--debug] [--verify-tls]
              [--no-render-markdown]
              [run]

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
  --webterminal-host-address WEBTERMINAL_HOST_ADDRESS, -wh WEBTERMINAL_HOST_ADDRESS
                        Override default listening host address for the
                        webterminal socket
  --webterminal-port WEBTERMINAL_PORT, -wp WEBTERMINAL_PORT
                        Override default listening port for the webterminal
                        socket
  --open-browser-delay OPEN_BROWSER_DELAY, -bd OPEN_BROWSER_DELAY
                        Override default time in seconds to delay when opening
                        the system's web browser
  --logfile-write-mode {a,w}, -w {a,w}
                        File mode when writing to log file, 'a' to append, 'w'
                        to overwrite
  --config-file-templatized, -fT
                        Render configuration via jinja2 templating
  --api-only            Don't serve static assets, only start API
  --all-in-one, -aio    Run the shell websocket process alongside app
  --debug
  --verify-tls          Verify SSL cert when downloading web content
  --no-render-markdown, -nomarkdown
```

<a name="building-the-app"></a>
# Building the development instance of the app

* Install and configure prerequisites:
  * Python 3.7+
  * Nodejs (tested with version 16.5.0)
* Install yarn: `npm install yarn`
* Install modules: `yarn install`
* Install python prerequisites: `pip install -r requirements.txt`
* Build: `yarn clean && yarn compile:ui:dev`
* Launch the development instance of the desktop app: `yarn start:dev`<br />
  Under the hood, this recompiles the HTML and launches [bertdotbill/app.py](bertdotbill/app.py)

[Back to Top](#top)
<a name="developing-the-app"></a>
# Developing the app

If you want to make changes to the UI, you'll need to launch the 
web instance with `yarn start:dev:parcel`.

Once parcel begins serving up the HTML assets, you 
can make changes to UI components and they will re-render on-the-fly.

<a name="configuration-file"></a>
# Configuration File

The configuration file is read by the Flask API process, 
and is a YAML-formatted file.

As mentioned above, a sample configuration file is provided: 
[bill.config.yaml.example](bill.config.yaml.example)

If no configuration is specified via the cli, 
the web app will attempt to find the config file in the 
following locations:

- Under ~/bill.config.yaml
- Adjacent to the app, i.e. in the same folder as the app's script
- Under ~/.bill/bill.config.yaml
- Under /etc/bill.config.yaml

Do review the comments in the sample file, as these explain how the sections are interpreted/handled by the UI.

<a name="configuration-file---defaults"></a>
## Configuration File - Defaults

If no settings can be found, the app will resort to its defaults, 
see [defaults.py](bertdotbill/defaults.py) 

As such, the defaults settings call for the import of an external config, hosted in my [bert.lessons](https://github.com/berttejeda/bert.lessons) repo: <br />
see [bert.lessons/bill.config.yaml](https://raw.githubusercontent.com/berttejeda/bert.lessons/main/bill.config.yaml)

This external config is where I am listing all of my (mostly) hand-crafted tutorials and learning materials.

<a name="lessons"></a>
# Lessons

As already mentioned, lessons are Markdown-formatted 
files interpreted as [jinja](https://jinja.palletsprojects.com/en/3.0.x/) 
templates.

You can define a lesson catalog in the 
[configuration file](bill.config.yaml.example).

If these files are stored in a password-protected web location, 
you'll need to specify credentials in the auth.global section 
of the config file.

Per-lesson credentials are not yet implemented, but will 
be in a future version.

<a name="jinja-templating"></a>
## Jinja Templating

To add to the templating goodies provided by the Jinja library,
I've exposed the OS Environment via the _environment_ key of 
the _sessions_ object.

This means you should be able to reference any OS-level environment 
variable in your lesson content, e.g. 

```markdown
# Overview

Hello {{ session['environment']['USERNAME'] }}, welcome to Lesson 1
```

<a name="webterminal"></a>
# WebTerminal

Every lesson rendered through the app includes a web-based terminal 
emulator component that allows for practicing the lesson material.

These web terminals are embedded in the user interface, 
available at its footer and as a slide-in from the right 
(click Utils to reveal).

As mentioned before, the underlying technology for these web 
terminals is [xterm.js](https://github.com/xtermjs/xterm.js/).

As such, the xterm.js component requires a websocket to a bash process.

By [default](bertdotbill/defaults.py), the bert.bill desktop app 
will attempt to connect to a local instance of the websocket via _http://127.0.0.1:10000/_.

You can get this websocket running either by:

- Running the `bill` or `bertdotbill/app.py` scripts with the `-aio` flag passed in<br />
  Doing so will launch a local websocket that forwards keystrokes to a bash process on your system
- Running the pre-built docker image: `docker run --rm -it --name aiohttp -p 10000:10000 berttejeda/aiohttp-websocket-bash`

Either of the commands above will start the websocket 
and bash process on the target platform on port 10001 by default.

Feel free to adjust either approach to your need.

# Appendix


