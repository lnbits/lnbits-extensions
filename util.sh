#!/bin/sh

# clones all extensions from extensions.json into extensions folder
clone() {
    mkdir -p extensions
    cd extensions
    jq -r '.extensions[] | .repo + " " + .id' ../extensions.json | while read -r line
    do
        repo=$(echo $line | cut -f1 -d" " | sed 's/https:\/\//git@/' | sed 's/\//:/')
        id=$(echo $line | cut -f2 -d" ")
        git clone $repo $id
    done
}

# pulls all extensions from extensions.json
pull() {
    cd extensions
    jq -r '.extensions[] | .repo + " " + .id' ../extensions.json | while read -r line
    do
        # repo=$(echo $line | cut -f1 -d" " | sed 's/https:\/\//git@/' | sed 's/\//:/')
        id=$(echo $line | cut -f2 -d" ")
        cd $id
        git pull
        cd ..
    done
}

# execute functions
$@

# example
# sh util.sh clone
# sh util.sh pull
