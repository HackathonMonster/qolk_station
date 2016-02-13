# Qolk - Station
Recieve the humidity, temperature and alcohol of the wine which capped Qolk.

## Recieve
All: 16byte * 3  
each value: 16bytes  
```
humidity temperature alcohol
```

## Post
post Qolk Server the values.  
type: json
```
{
  humidity: 54.03,
  temperature: 24.23,
  alcohol: 50.00
}
```

## Usage
```
node main.js
```
configure Station listening `port` and Server `hostname`.
