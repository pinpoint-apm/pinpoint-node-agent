#!/bin/bash

AGENT_PATH=~/Downloads/pinpoint-agent-2.5.1
SPRING_BOOT_OPT="-javaagent:$AGENT_PATH/pinpoint-bootstrap-2.5.1.jar -Dpinpoint.agentId=express-spring-sampleid -Dpinpoint.applicationName=express-spring-sample"

# echo $AGENT_PATH
# echo $GRADLE_OPTS
# export $GRADLE_OPTS

# CATALINA_OPTS="-javaagent:$AGENT_PATH/pinpoint-bootstrap-2.1.0.jar -Dpinpoint.agentId=express-spring-sampleid -Dpinpoint.applicationName=express-spring-sample"
# export CATALINA_OPTS=$CATALINA_OPTS
# echo $CATALINA_OPTS

./gradlew clean build
java $SPRING_BOOT_OPT -jar build/libs/springboot-0.0.1-SNAPSHOT.jar