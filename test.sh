#!/bin/bash
files=$( ls ./integration/*.jmx)
echo "Files: $files"
for file in $( ls ./integration/*.jmx); do
    echo "Cleaning logs"
    rm -r reports logs
    echo "Running test with $file"
    filename=$(basename "$file" ".jmx")
    ./apache-jmeter-5.6.2/bin/jmeter -n -t $file -l logs/$filename.log -e -o reports ;
    error_count=$(cat jmeter.log | grep -m 1 "summary =" | awk '{print $19}')
    echo "Error count: '$error_count'"
    echo "##########"
    echo "$error_count" == "0"
    echo "###########$error_count ###########"
    if [ "$error_count" = "0" ]; then
        echo "Test $filename OK."
        rm -r reports/*
    else
        echo "Test $filename failed. Error count: '$error_count'."
        exit 1
    fi
done
