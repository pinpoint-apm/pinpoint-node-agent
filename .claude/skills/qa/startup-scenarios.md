# QA startup validation scenarios

A release QA runs these on one app (`apps/express.js`) with no databases, no target and no
requests. Judge by the DEV agent list and the collector connections of the app process.

```text
1. Valid v4 names
   app      PINPOINT_SERVICE_NAME, PINPOINT_APPLICATION_NAME, PINPOINT_AGENT_NAME set
   expect   agent list   the agent name is listed, state Running

2. v4 without a service name
   app      PINPOINT_SERVICE_NAME unset
   expect   agent list   the agent name is not listed
            connections  none to the collector ports
            app          answers requests

3. Service name shorter than 3 characters
   app      PINPOINT_SERVICE_NAME=ab
   expect   the same as scenario 2

4. Service name longer than 254 characters
   app      PINPOINT_SERVICE_NAME of 255 characters
   expect   the same as scenario 2

5. Application name with an invalid character
   app      PINPOINT_APPLICATION_NAME=node~agent
   expect   the same as scenario 2

6. Agent disabled by configuration
   app      PINPOINT_ENABLE=false
   expect   the same as scenario 2

7. v4 with a configured agent ID
   app      PINPOINT_AGENT_ID=qa-fixed-id
   expect   agent list   the agent name is listed with a generated 22-character agent ID

8. v3
   app      PINPOINT_PROTOCOL_VERSION=v3, PINPOINT_AGENT_ID set
   expect   agent list   service DEFAULT lists the agent with that agent ID
```
