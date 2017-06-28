# nmea0183-to-nmea0183

Signal K Node server plugin to filter and forward NMEA0183 sentences.

## Usage

1. Activate the plugin and add a new configuration block that lists all NMEA0183 
sentences and describes the internal SignalK server `input` and `output` events. 
`nmea0183-signalk` parser emits `nmea0183` event by default.

2. Add SignalK configuration to forward sentences to specific `serialport` configuration with matching `toStdout`:

```
...
  }, {
    "id": "nmea-out",
    "pipeElements": [{
      "type": "providers/serialport",
      "options": {
        "device": "/dev/nmea-digyacht",
        "baudrate": 4800,
        "toStdout": "filteredNmea0183out"
      }
    }, {
...
```

## Contribute

Use [GitHub issues](https://github.com/vokkim/nmea0183-to-nmea0183/issues) and [Pull Requests](https://github.com/vokkim/nmea0183-to-nmea0183/pulls).

## License

MIT
