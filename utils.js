const _ = require('lodash/fp')

const hasComma = _.overEvery([_.isString, _.includes(',')])
const getHeader = str => hasComma(str) ? str.split(',', 1)[0] : ''
const getHeaderType = str => str.slice(-3)
const getType = _.flow(getHeader, getHeaderType)

const createFilter = _.flow(
  _.propertyOf,
  _.partial(_.flow, [getType])
)

module.exports = {
  createFilter
}
