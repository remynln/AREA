#!/bin/bash
ls -la /app/
cp -f /app/area_mobile.apk /usr/src/app/build/client.apk
serve -s build -l 3000