const Bacon = require('baconjs')
const _ = require('lodash/fp')
const { schema, validate } = require('./schema')
const { createFilter } = require('./utils')

module.exports = function(app) {
  const plugin = {
    id: 'nmea0183-to-nmea0183',
    name: 'Forward and filter NMEA0183 input to NMEA0183 out',
    description: 'Plugin to forward and filter NMEA0183 sentences to serial port.',
    schema,
    unsubscribe: []
  }

  plugin.start = function(options) {
    if (!validate(options)) {
      throw 'Plugin nmea0183-to-nmea0183 sent invalid props. Check schema.'
    }
    _.each(options => {
      const input = _.trim(options.input)
      const output = _.trim(options.output)
      if (input === output) {
        throw 'Can not have same input and output: ' + input
      }
      const unsub = Bacon.fromEvent(app, input)
        .filter(createFilter(options.nmea))
        .onValue(val => app.emit(output, val))
      plugin.unsubscribe.push(unsub)
    }, options.inputs)
  }

  plugin.stop = function() {
    _.over(plugin.unsubscribe)()
    plugin.unsubscribe = []
  }
  return plugin
}
