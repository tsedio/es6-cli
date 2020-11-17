import DefaultExport from '../exports.default'
import AnyExport from '../exports'
import JsonData from '../exports-test.json'
import Logger from '../logger'
import Configuration from '../configuration'
import {
  hello
} from "../configuration"

const logger = Logger(Configuration)

const someVar = 'var'

console.log(AnyExport)
console.log(DefaultExport)
console.log(JsonData)

function test(){
  const inline = require('./inline')
}