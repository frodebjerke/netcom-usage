# netcom-usage - under development, not finished.

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

### Web-server

## TODO
- add metadata (period start, timestamp)
- Slack integration
  - get last measure
  - get warning
  - get message when data bought                  
- Graph
 - continous
 - aggregate week/day/hour
 - seasons
