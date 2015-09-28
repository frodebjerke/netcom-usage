## !!Not longer usable
Netcom changed their system, making this tool useless. However I found pretty much the same overview over data usage as this tool provides in their app 'Mitt Netcom'.

# netcom-usage
Schematic overview over the entire system:
```
+------------------------------------+         +---------------------------+
|System on 4G network                |         |Arbitrary server           |
| +--------------------------+       |         |     +-------------------+ |
| |CRON                      |       |         |     |Web application    | |
| |                          |       |         |     |                   | |
| |  +----------------+      |       |         |     +- support multiple | |
| |  |Scraper         |      |       |         |     |networks           | |
| |  |                +----------------------------> |                   | |
| |  |                |      |       |         |     +- Stores data      | |
| |  +-----+----------+      |       |         |     |                   | |
| |        |                 |       |         |     +- Open API         | |
| +--------------------------+       |         |     |                   | |
|          |                         |         |     +- Some predefined  | |
|          |                         |         |     +views              | |
|          |                         |         |     |                   | |
|          v                         |         |     +-------------------+ |
|                                    |         |                           |
|    +----------------+              |         |                           |
|    | Local log file |              |         |                           |
|    |                |              |         |                           |
|    |                |              |         |                           |
|    |                |              |         |                           |
|    |                |              |         |                           |
|    +----------------+              |         |                           |
+------------------------------------+         +---------------------------+
```

## Usage
There are two main components a data-scraper and a web-server.

### Scraper
The scraper is a script defined by the `scrape.js` file. It is intended to be ran as a cron-job. On each execution this script will try to scrape data about current data left, log this to file and post this data to your web-server.

#### Run
1. Make sure `node: ^v0.12.4` is installed on your system :one:
2. Install :two:
    - Run the following commands from the root of this repo
    - `npm install`
    - `npm install -g .`
    - netcom-usage-scraper should now be available on your path
3. Setup cron-job
    - `crontab -e` to add a new cron-job
    - `42 * * * * netcom-usage-scraper` :three:
        - This creates a cron-job that runs on the 42 minute of every hour.
        - Could be wise to use the full path to the executable i.e `/usr/local/bin/netcom-usage-scraper`
        - Full example :four:
        ````
        42 * * * * /usr/local/bin/netcom-usage-scraper --server netcom-usage.com --network yoloville --usageLog '/usr/local/var/log/netcom-usage/usage.log' --logFile '/usr/local/var/log/netcom-usage/job.log' --logLevel 'debug'
        ````
    - `crontab -l` displays current jobs
    
:one: osx: `brew install node`, ubuntu/debian: `sudo apt-get install node`, [nodejs.org](https://nodejs.org/download/)

:two: We install the program such that any changes you make locally would not alter the behaviour of the running cron-job.

:three: Remember to set your config

:four: Your node installation might not be on the PATH used by cron. You can set environment variables for a cron-job the following way
````
PATH=$PATH:/usr/local/bin

* * * * * netcom-usage-scraper
````

#### Configurations
Configurations can either be applied as environment variables or command line arguments. Arguments have higher priority than the environment.

##### SERVER_URL / --server
`default: localhost:3000`

##### NETCOM_NETWORKID / --network
The identity of your network.
`default: 'test'`

##### TARGET_SITE / --target
`default: http://netcom.no/mbb-refill`

##### USAGE_LOG_FILE / --usageLog
Full path to usage log file placement.
`default: 'usage.log'`

#### LOG_FILE / --logFile
Full path to the application log file.
`default: application.log`

#### LOG_LEVEL / --logLevel
Application log level.
`default: info`
Options: 'debug', 'info', 'error'

### Web-server
#### Requires
1. Node.js
2. Rethinkdb

#### Run
1. Make sure Rethinkdb is running
2. `npm install`
3. Set environment variables :one:
4. Start server
    - `npm run server` :two:

:one: See the following configurations section for available environment configurations

:two: A Procfile is already created that means it will run nicely on platforms such as Heroku, Dokku or Foreman.

#### Configurations
All configurations are defined in the config.js file.

##### PORT
`default: 3000`

##### RETHINKDB_HOST
`default: localhost`

##### RETHINKDB_PORT
`default: 28015`

##### RETHINKDB_NAME
`default: netcom_usage`

## TODO
- add metadata (period start, timestamp)
- Slack integration
  - get last measure
  - get warning
  - get message when data bought
- Graph
 - continous
 - aggregate week/day/hour
 - seasons
