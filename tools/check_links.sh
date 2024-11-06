#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <html_file>"
    exit 1
fi

HTML_FILE="$1"

if [ ! -f "$HTML_FILE" ]; then
    echo "File not found: $HTML_FILE"
    exit 1
fi

links=$(grep -oP 'href="\K[^"]+' "$HTML_FILE")

for link in $links; do
    http_status=$(curl -o /dev/null -s -w "%{http_code}\n" "$link")

    if [ "$http_status" -eq 200 ]; then
        echo "Valid link: $link"
    else
        echo "Invalid link: $link (HTTP status: $http_status)"
    fi
done

