#!/bin/sh

# clones all extensions from extensions.json into extensions folder
clone() {
    mkdir -p extensions
    cd extensions
    cat ../extensions.json | jq -r '.extensions[].repo' | while read -r line
    do
        git clone $line
    done
}

# pulls all extensions from extensions.json
pull() {
    cd extensions
    cat ../extensions.json | jq -r '.extensions[].id' | while read -r line
    do
        cd $line
        git pull
        cd ..
    done
}

# execute functions
$@

# example
# sh util.sh clone
# sh util.sh pull
