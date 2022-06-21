#!/usr/bin/env bash
script_dir=${0%/*}
script_name=${0##*/}
script_base_name=${script_name%%.*}
script_dir_name=${script_dir##*/}
command_name="${script_base_name}"
remote_name=origin
setup_file_path=setup.iss

EXAMPLES="""
e.g.
  * Create the InnoSetup Installer, bumping up major version
    ${script_name} build release major
  * Create the InnoSetup Installer, bumping up minor version
    ${script_name} build release minor
  * Create the InnoSetup Installer, bumping up patch version
    ${script_name} build release patch
  * Update the HISTORY.md change file, bumping up the major version number, starting from git commit f8476d7
    ${script_name} history major -s f8476d7
  * Update the HISTORY.md change file, bumping up the major version number, starting from git tag v1.0
    ${script_name} history major -s v1.0
    * Update the HISTORY.md change file, bumping up the minor version number, starting from git tag v1.0
    ${script_name} history minor -s v1.0
  * Update the HISTORY.md change file, bumping up the patch version number, starting from git tag v1.0
    ${script_name} history patch -s v1.0
  * Do as above examples, except instruct to not bump up the any version number
    ${script_name} build release --no-bump OR
    ${script_name} history --no-bump
"""

USAGE="""
Usage: ${script_name}
param: [--innosetup-path|-I] <override_innosetup_installation_path>
param: [--setup-file-path|-S] <override_setup_file_path>
param: [--start-tag-or-commit|-s] <start_tag_or_commit>
param: [--end-tag-or-commit|-s] <end_tag_or_commit>
param: [--remote-name|-r] <git_repo_remote_name>
param: [--pypi-username|-pU] <pypi_username>
param: [--pypi-password|-pW] <pypi_password>
param: [--dry-run|--dry] <Do nothing except echo the underlying commands>
param: [--no-bump] <Skip incrementing of any version numbers>
param: [--help-extended] <Display Usage Information w/ Examples>
"""

numargs=$#
allargs=$*

#BEGINCLI
while (( "$#" )); do
  if [[ "$1" =~ ^release$|^history$|^pip$ ]]; then action=$1;release=$2;shift;fi
  if [[ "$1" =~ ^--innosetup-path$|^-I$ ]]; then innosetupdir=$2;shift;fi
  if [[ "$1" =~ ^--setup-file-path|^-S$ ]]; then setup_file_path=$2;shift;fi
  if [[ "$1" =~ ^--remote-name$|^-r$ ]]; then remote_name=$2;shift;fi
  if [[ "$1" =~ ^--app-version$|^-V$ ]]; then APP_VERSION=$2;shift;fi
  if [[ "$1" =~ ^--pypi-username$|^-pU$ ]]; then pypi_username=$2;shift;fi
  if [[ "$1" =~ ^--pypi-password$|^-pW$ ]]; then pypi_password=$2;shift;fi
  if [[ "$1" =~ ^--start-tag-or-commit$|^-s$ ]]; then start_tag_or_commit=$2;shift;fi
  if [[ "$1" =~ ^--end-tag-or-commit$|^-e$|^-s$ ]]; then end_tag_or_commit=$2;shift;fi    
  if [[ "$1" =~ ^--keep-spec-files$ ]]; then keep_spec=true;fi
  if [[ "$1" =~ ^--no-bump$ ]]; then no_bump=true;fi
  if [[ "$1" =~ ^--help$ ]]; then help=true;fi
  if [[ "$1" =~ ^--help-extended$ ]]; then help_extended=true;fi
  if [[ "$1" =~ ^--dry$ ]]; then exec_action=echo;fi
  shift
done
#ENDCLI

unmatched_args=${allargs##*---}

if [[ (($numargs -lt 1) && (-z $no_bump)) || (-n $help) ]]; then 
  echo -e "${USAGE}"
  exit 0
elif [[ (($numargs -lt 1) && (-z $no_bump)) || (-n $help_extended) ]]; then 
  echo -e """${USAGE}
Examples:
${EXAMPLES}
""" 
  exit 0
fi

if ! test "${setup_file_path}";then
  echo "Could not find ${setup_file_path}"
  echo "Are you in the project root?"
  exit 1
fi

RE='[^0-9]*\([0-9]*\)[.]\([0-9]*\)[.]\([0-9]*\)\([0-9A-Za-z-]*\)'

VERSION_FILE="${script_dir}/VERSION.txt"

if [[ -z $APP_VERSION ]];then

  if [ -z "$base" ];then
    if [[ -f $VERSION_FILE ]];then
      base=$(cat $VERSION_FILE)
    else
      base=0.0.0
    fi
  fi

  if [ -z $no_bump ];then
    MAJOR=`echo $base | sed -e "s#$RE#\1#"`
    MINOR=`echo $base | sed -e "s#$RE#\2#"`
    PATCH=`echo $base | sed -e "s#$RE#\3#"`

    case "$release" in
    major)
      let MAJOR+=1
      ;;
    minor)
      let MINOR+=1
      ;;
    patch)
      let PATCH+=1
      ;;
    esac
    export APP_VERSION="${MAJOR}.${MINOR}.${PATCH}"
  else
    export APP_VERSION="${base}"
  fi
fi

function build() {
  

  if [[ "$OSTYPE" =~ .*darwin.* ]];then
    os_is_osx=true
    os_arch=macos
  elif [[ "$OSTYPE" =~ .*linux.* ]];then
    os_is_linux=true
    os_arch=linux
  elif [[ "$OSTYPE" =~ .*msys.* ]];then
    os_is_windows=true
    os_arch=windows
  fi  

  echo "Building Release ..."

  yes | pyinstaller -i src/assets/logo_setup.ico \
  --add-data 'bill.gui;bill.gui' \
  -n bill \
  --hidden-import clr \
  --onedir bertdotbill/app.py

  if [[ -z $keep_spec ]];then
    echo 'Cleaning up .spec files'
    rm -f build*.spec
  fi

  echo "Building Installer ..."

  if [[ -n $os_is_windows ]];then
    default_innosetupdir="/c/Program Files (x86)/Inno Setup 6"
    innosetupdir="${innosetupdir-${default_innosetupdir}}"
    if [ ! -d "$innosetupdir" ]; then
        echo "ERROR: Couldn't find innosetup which is needed to build the installer. We suggest you install it using chocolatey. Exiting."
        exit 1
    fi
    ${exec_action} "$innosetupdir/iscc.exe" $PWD/setup.iss || exit 1
  elif [[ -n $os_is_osx ]];then
    echo "Building OSX installer is not yet implemented ..."
  elif [[ -n $os_is_linux ]];then
    echo "Building Linux installer is not yet implemented ..."
  else
    echo "Building an installer for this platform is not yet implemented ..."
  fi

  if [ -z $no_bump ];then
    APP_VERSION=${APP_VERSION} ${0} history "${APP_VERSION}"
  fi

  if [ -z $no_bump ];then
    existing_tag=$(git tag -l "${APP_VERSION}")
    if [[ -z $existing_tag ]];then 
      echo "Adding git tag for ${APP_VERSION}"
      echo "Bumping up version"
      echo ${APP_VERSION} > $VERSION_FILE
      git add HISTORY.md $VERSION_FILE
      git commit -m "Bumped version to ${APP_VERSION}"
      ${exec_action} git tag "${APP_VERSION}";
    fi
  fi

}

if [[ $action == "release" ]];then
  build
elif [[ $action == "pip" ]];then
  python setup.py sdist && python setup.py bdist_wheel
  twine upload dist/* -u ${pypi_username} -p ${pypi_password} $unmatched_args
elif [[ $action == "history" ]];then
    echo "Generating HISTORY ..."
    git_branch=$(git rev-parse --abbrev-ref HEAD);
    if [[ -z $start_tag_or_commit ]];then
      if [[ -n $(git tag -l) ]];then
        latest_tag=$(git tag | sort -V | tail -1)
        start_commit=$(git rev-list -n 1 ${latest_tag})
      else
        start_commit=$(git log --reverse  --pretty=format:'%h' | head -1)
      fi
    fi
    end_commit=$(git log --pretty=format:'%h' -n 1)
    repo_url=$(git config --get remote.${remote_name}.url | sed 's/\.git//' | sed 's/:\/\/.*@/:\/\//');
    if [[ $exec_action != "echo" ]];then
      changes=$(git log --no-merges ${start_tag_or_commit-${start_commit}}..${end_tag_or_commit-${end_commit}} --format="* %s [%h]($repo_url/commit/%H)" | sed 's/      / /')
      if [[ -n $changes ]];then
        changes_header="## Release $(date +%Y-%m-%d) ${APP_VERSION}\n"
        change_body="\n${changes_header}\n${changes//\*/-}"
        if [[ -f HISTORY.md ]];then
          new_content=$(awk -v body="${change_body}" 'NR==4{print body}1' HISTORY.md)
          echo -e "${new_content}" | grep -vi bumped | tee HISTORY.md
        else
          echo -e "${change_body}" | grep -vi bumped | tee HISTORY.md
        fi
      else
        echo "No changes detected ..."
        echo "Not generating release info for HISTORY.md"
      fi
    fi
fi