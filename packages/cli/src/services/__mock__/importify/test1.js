'use strict'
const _ = require('lodash')
const moment = require('moment')
const mathjs = require('mathjs')
const redisio = require('redisio/internal')
const DefaultExport = require('../exports.default')
const AnyExport = require('../exports')
const JsonData = require('../exports-test.json')
const logger = require('../logger')(require('../configuration'))

console.log(AnyExport)
console.log(DefaultExport)
console.log(JsonData)