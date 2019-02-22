#!/bin/bash

BASE_DIR=lib/data
TARGET_DIR=${BASE_DIR}/thrift
OUT_DIR=${BASE_DIR}/dto

[ -d ${OUT_DIR} ] || mkdir ${OUT_DIR}

thrift -r --gen js:node --out ${OUT_DIR} ${TARGET_DIR}/Command.thrift
thrift -r --gen js:node --out ${OUT_DIR} ${TARGET_DIR}/Flink.thrift
thrift -r --gen js:node --out ${OUT_DIR} ${TARGET_DIR}/Pinpoint.thrift
thrift -r --gen js:node --out ${OUT_DIR} ${TARGET_DIR}/Trace.thrift
