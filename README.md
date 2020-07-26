# Card Fraud Detector

Consider the following credit card fraud detection algorithm:
A credit card transaction is comprised of the following elements;
hashed credit card number
timestamp - of format 'year-month-dayThour:minute:second'
price - of format 'dollars.cents'

Transactions are to be received as a comma separated string of elements eg. '10d7ce2f43e35fa57d1bbf8b1e2, 2014-04-29T13:15:54, 10.00'

A credit card will be identified as fraudulent if the sum of amounts for a unique hashed credit
card number over a 24-hour sliding window period exceeds the price threshold.

The file passed to your app will contain a sequence of transactions in chronological order.

## Getting Started

This NodeJS application has been built with Typescript for type safety, InversifyJS for Dependency Injection and Jest for tests.

### Prerequisites

NPM > 6

Node > 12.13


### Build

open a command console into the current folder and run the following to download dependencies
```
npm install
```



### Running the tests

All test can be run using 
```
npm run test
```

## Running the application

Run the following

npx ts-node ./src/index.ts  {{ threshold amount}} {{ csv file location }}

```
npx ts-node ./src/index.ts 1000assets/transactions.csv
```


## Improvements

* Improved error handling with parsing command line arguments
* Improved error handling with parsing CSV file
* Separate file reader and fraud detection into seperate modules
* Add indexing to improve speed for large transaction files
