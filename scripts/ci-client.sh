#!/bin/bash

yarn run jest --coverage --verbose --runInBand
yarn run lint
yarn run build
