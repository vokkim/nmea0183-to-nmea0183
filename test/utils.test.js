const { isFunction } = require('lodash/fp')
const { createFilter } = require('../utils')

/* globals describe test expect */

describe('createFilter', () => {
  const nmea = {
    FOO: true,
    HDG: true,
    BAZ: true,
    BAR: false,
  }
  const filterFunc = createFilter(nmea)
  test('returns func that returns true if match active', () => {
    expect(typeof filterFunc).toBe('function')
    expect(filterFunc('$SDHDG,218.7,,,8.7,W*24')).toBe(true)
    expect(filterFunc('$SDDPT,1.4,0.0,*7E')).toBe(undefined)
    // Invalid checksum still returns valid. Do we want that?
    expect(filterFunc('$SDBAZ,1.4,0.0,*7E')).toBe(true)
  })
})
