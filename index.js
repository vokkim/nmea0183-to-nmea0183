const Bacon = require('baconjs')
const _ = require('lodash')

module.exports = function(app) {
  const properties = _.reduce(NMEA_SENTENCES, (result, value) => {
    result[value[0]] = {
      title: value.join(' - '),
      type: 'boolean',
      default: true
    }
    return result
  }, {})

  const plugin = {
    id: 'nmea0183-to-nmea0183',
    name: 'Forward and filter any NMEA0183 input to NMEA0183 out',
    description: 'Plugin to forward and filter NMEA0183 sentences to serial port. ',
    schema: {
      type: 'object',
      title: 'Forwarded NMEA0183 sentences',
      description: 'Forward the following raw NMEA0183 input sentences to NMEA0183 output via `nmea0183out` event',
      properties
    },
    unsubscribe: undefined
  }

  plugin.start = function(options) {
    const disabled = _.keys(_.omitBy(options, _.identity))
    const filtered = Bacon.fromEvent(app.signalk, 'nmea0183')
      .filter(val => _.every(disabled, sentence => !val.match('^[\$,\!][A-Z]{2}' + sentence))) //.log('BACON EVENT')

    plugin.unsubscribe = filtered.onValue(val => {
      app.emit('nmea0183out', val)
    })
  }

  plugin.stop = function(a) {
    plugin.unsubscribe && plugin.unsubscribe()
  }
  return plugin
}

// From brilliant explanation by Eric S. Raymond:
// http://catb.org/gpsd/NMEA.html
// http://catb.org/gpsd/AIVDM.html
const NMEA_SENTENCES = [['AAM', 'Waypoint Arrival Alarm'],
['ALM', 'GPS Almanac Data'],
['APA', 'Autopilot Sentence "A"'],
['APB', 'Autopilot Sentence "B"'],
['BOD', 'Bearing - Waypoint to Waypoint'],
['BWC', 'Bearing & Distance to Waypoint - Great Circle'],
['BWR', 'Bearing and Distance to Waypoint - Rhumb Line'],
['BWW', 'Bearing - Waypoint to Waypoint'],
['DBK', 'Depth Below Keel'],
['DBS', 'Depth Below Surface'],
['DBT', 'Depth below transducer'],
['DCN', 'Decca Position'],
['DPT', 'Depth of Water'],
['DTM', 'Datum Reference'],
['FSI', 'Frequency Set Information'],
['GBS', 'GPS Satellite Fault Detection'],
['GGA', 'Global Positioning System Fix Data'],
['GLC', 'Geographic Position, Loran-C'],
['GLL', 'Geographic Position - Latitude/Longitude'],
['GNS', 'Fix data'],
['GRS', 'GPS Range Residuals'],
['GST', 'GPS Pseudorange Noise Statistics'],
['GSA', 'GPS DOP and active satellites'],
['GSV', 'Satellites in view'],
['GTD', 'Geographic Location in Time Differences'],
['GXA', 'TRANSIT Position - Latitude/Longitude'],
['HDG', 'Heading - Deviation & Variation'],
['HDM', 'Heading - Magnetic'],
['HDT', 'Heading - True'],
['HFB', 'Trawl Headrope to Footrope and Bottom'],
['HSC', 'Heading Steering Command'],
['ITS', 'Trawl Door Spread 2 Distance'],
['LCD', 'Loran-C Signal Data'],
['MSK', 'Control for a Beacon Receiver'],
['MSS', 'Beacon Receiver Status'],
['MTW', 'Mean Temperature of Water'],
['MWV', 'Wind Speed and Angle'],
['OLN', 'Omega Lane Numbers'],
['OSD', 'Own Ship Data'],
['R00', 'Waypoints in active route'],
['RMA', 'Recommended Minimum Navigation Information'],
['RMB', 'Recommended Minimum Navigation Information'],
['RMC', 'Recommended Minimum Navigation Information'],
['ROT', 'Rate Of Turn'],
['RPM', 'Revolutions'],
['RSA', 'Rudder Sensor Angle'],
['RSD', 'RADAR System Data'],
['RTE', 'Routes'],
['SFI', 'Scanning Frequency Information'],
['STN', 'Multiple Data ID'],
['TDS', 'Trawl Door Spread Distance'],
['TFI', 'Trawl Filling Indicator'],
['TPC', 'Trawl Position Cartesian Coordinates'],
['TPR', 'Trawl Position Relative Vessel'],
['TPT', 'Trawl Position True'],
['TRF', 'TRANSIT Fix Data'],
['TTM', 'Tracked Target Message'],
['VBW', 'Dual Ground/Water Speed'],
['VDR', 'Set and Drift'],
['VHW', 'Water speed and heading'],
['VLW', 'Distance Traveled through Water'],
['VPW', 'Speed - Measured Parallel to Wind'],
['VTG', 'Track made good and Ground speed'],
['VWR', 'Relative Wind Speed and Angle'],
['WCV', 'Waypoint Closure Velocity'],
['WNC', 'Distance - Waypoint to Waypoint'],
['WPL', 'Waypoint Location'],
['XDR', 'Transducer Measurement'],
['XTE', 'Cross-Track Error, Measured'],
['XTR', 'Cross Track Error - Dead Reckoning'],
['ZDA', 'Time & Date - UTC, day, month, year and local time zone'],
['ZFO', 'UTC & Time from origin Waypoint'],
['ZTG', 'UTC & Time to Destination Waypoint'],
['VDM', 'Automatic Identification System (AIS) payload'],
['VDO', 'Automatic Identification System (AIS) payload']]