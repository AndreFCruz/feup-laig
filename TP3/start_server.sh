#!/bin/sh

terminal -e "python -m http.server 8080"
sicstus -l fabrik/server.pl --goal server.
