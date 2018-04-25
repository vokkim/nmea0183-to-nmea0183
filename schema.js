const _ = require('lodash')
const Ajv = require('ajv')
const NMEA_SENTENCES = require('./nmea0183')

const ajv = new Ajv()

const input = {
  title: 'Input event (internal)',
  type: 'string',
  default: 'myNMEA0183InputEvent'
}
const output = {
  title: 'Output event (internal)',
  type: 'string',
  default: 'myNMEA0183OutputEvent'
}
const nmeaProperties = _.reduce(_.orderBy(NMEA_SENTENCES, v => v[0]), (result, value) => {
  result[value[0]] = {
    title: value.join(' - '),
    type: 'boolean',
    default: false
  }
  return result
}, {})
const nmea = {
  title: 'NMEA0183 Sentences',
  default: {},
  description: 'The following sentence types will be emitted on the output event above.',
  type: 'object',
  properties: nmeaProperties,
}
const nmeaEventItem = {
  title: 'NMEA0183 to NMEA0183',
  description: 'Forward the following NMEA0183 input events to NMEA0183 output.',
  type: 'object',
  properties: { input, output, nmea },
  required: ['input', 'output', 'nmea'],
}
const schema = {
  title: 'Forwarded NMEA0183 sentences',
  type: 'object',
  properties: {
    inputs: {
      type: 'array',
      title: 'Input Events',
      items: nmeaEventItem,
    }
  }
}
const validate = ajv.compile(schema)

module.exports = {
  validate,
  schema,
}
// console.log(JSON.stringify(schema, null, 2))
