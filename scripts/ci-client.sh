#!/bin/bash

yarn run test --coverage --verbose --runInBand
yarn run lint
yarn run build
