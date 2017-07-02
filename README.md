# nmea0183-to-nmea0183

Signal K Node server plugin to filter and forward NMEA0183 sentences.

## Usage


1. Add NMEA0183 provider to SignalK configuration with a `sentenceEvent` option:

```
  },{
    "type": "providers/nmea0183-signalk",
    "options":{
      "sentenceEvent": "myNMEA0183InputEvent"
    },
    "optionMappings": [
      ...
    ]
  }, {
 ```

2. Activate the plugin and add a new configuration block that lists all NMEA0183
sentences and describes the internal SignalK server `input` and `output` events. 

<a href='https://user-images.githubusercontent.com/1435910/27770068-10ba1596-5f41-11e7-8b60-a5c1226208d1.png'><img src='https://user-images.githubusercontent.com/1435910/27770068-10ba1596-5f41-11e7-8b60-a5c1226208d1.png' width='600px'/></a>

3. Add SignalK configuration to forward sentences to specific `serialport` configuration with matching `toStdout`:

```
...
  }, {
    "id": "nmea-out",
    "pipeElements": [{
      "type": "providers/serialport",
      "options": {
        "device": "/dev/nmea-digyacht",
        "baudrate": 4800,
        "toStdout": ["myNMEA0183OutputEvent"]
      }
    }, {
...
```

## Contribute

Use [GitHub issues](https://github.com/vokkim/nmea0183-to-nmea0183/issues) and [Pull Requests](https://github.com/vokkim/nmea0183-to-nmea0183/pulls).

## License

MIT
