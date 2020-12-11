import redisio from 'redisio/internal'
import * as mathjs from 'mathjs'
import moment from 'moment'
import _ from 'lodash'
import DefaultExport from '../exports.default'
import * as AnyExport from '../exports'
import JsonData from '../exports-test.json'
import Logger from '../logger'
import * as Configuration from '../configuration'

const logger = Logger(Configuration)

console.log(AnyExport)
console.log(DefaultExport)
console.log(JsonData)
