#!/bin/bash

# 1. Load environment variables
export PINPOINT_TRACE_EXCLUSION_URL_PATTERN="/favicon.ico"

# 2. Run Next.js with Pinpoint agent
NODE_OPTIONS=--require=pinpoint-node-agent next start