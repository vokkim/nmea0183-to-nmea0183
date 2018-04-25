const { isFunction, isObject } = require('lodash/fp')
const getPlugin = require('./index')
const app = {
  emit: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
}
const options = {
  inputs: [
    { input: 'nmea', output: 'nmeaout', nmea: { HDG: true, BAR: false, BAZ: true } },
  ]
}
describe('plugin', () => {
  const plugin = getPlugin(app)
  test('hasPluginProps', () => {
    expect(plugin.id).toBe('nmea0183-to-nmea0183')
    expect(isObject(plugin.schema))
    expect(isFunction(plugin.start))
    expect(isFunction(plugin.stop))
    expect(plugin.unsubscribe.length).toBe(0)
    expect(app.on.mock.calls.length).toBe(0)
  })
  test('accepts options, register event handler', () => {
    plugin.start(options)
    const eventReg = app.on.mock.calls[0]
    expect(app.on.mock.calls.length).toBe(1)
    expect(eventReg[0]).toBe('nmea')
    expect(isFunction(eventReg[1])).toBe(true)
    expect(plugin.unsubscribe.length).toBe(1)
    expect(isFunction(plugin.unsubscribe[0])).toBe(true)
  })
  test('call handler should emit new event', () => {
    const input = app.on.mock.calls[0][1]
    input('$SDHDG,218.7,,,8.7,W*24')
    expect(app.emit.mock.calls.length).toBe(1)
    const output = app.emit.mock.calls[0]
    expect(output[0]).toBe('nmeaout')
    expect(output[1]).toBe('$SDHDG,218.7,,,8.7,W*24')
    input('$SDBAR,218.7,,,8.7,W*24')
    input('$SDHDG')
    expect(app.emit.mock.calls.length).toBe(1)
  })
  test('plugin stop removes handlers', () => {
    plugin.stop()
    const input = app.on.mock.calls[0][1]
    input('$SDHDG,218.7,,,8.7,W*24')
    expect(app.emit.mock.calls.length).toBe(1)
    // const unsubscribed = app.removeListener.mock.calls
    // console.log(unsubscribed)
    // expect(unsubscribed.length).toBe(1)
    expect(plugin.unsubscribe.length).toBe(0)
  })
})
