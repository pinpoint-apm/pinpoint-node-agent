#!/bin/bash

# 1. Load environment variables for the Pinpoint agent, which starts before Next.js loads .env
set -a
source .env
set +a

# 2. Run Next.js with Pinpoint agent
NODE_OPTIONS=--require=pinpoint-node-agent next start
