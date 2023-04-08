# Personal Budget API

## Description

For this project, you will build an API that allows clients to create and manage a personal budget. Using [Envelope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682) principles, your API should allow users to manage budget envelopes and track the balance of each envelope. Your API should follow best practices regarding REST endpoint naming conventions, proper response codes, etc. Make sure to include data validation to ensure users do not overspend their budget!

You will need to plan out your database design, then use PostgreSQL to create the necessary tables. Once your database is set up, connect your API calls to a database. Once you’ve added and connected your database, you will add a new feature to your server that allows users to enter transactions. This feature will put your envelope system into action!

### Project Objectives:

- Build an API using Node.js and Express
- Be able to create, read, update, and delete envelopes
- Create endpoint(s) to update envelope balances
- Use Git version control to keep track of your work
- Use the command line to navigate your files and folders
- Use Postman to test API endpoints
- Implement a database
- Integrate API endpoints with database layer
- Database implementation for transactions

### Prerequisites:

- Command line and file navigation
- Javascript
- Node.js
- Express
- Git and GitHub
- Postman
- PostgreSQL
- Database relationships and configuration

## Setup

The database connects via _.env_ variables. These are:

**process.env.HOST**
**process.env.DATABASE**
**process.env.USER**

Setup your own values for your own environment. If you want to configure a special port or password add the following to the pool in _db.js_:

    const pool = new Pool({
        process.env.HOST,
        process.env.DATABASE,
        process.env.USER,
        process.env.PORT,
        process.env.PASSWORD,
    });

## Endpoints

Currently the API uses one router to handle requests for envelopes and another router to handle requests for transactions.

### Envelopes

The base url the envelopes endpoint is:

    /envelopes

#### GET

    /

Gets all the envelopes in the envelopes table.

    /:envelopeId

Gets an envelope with a specific ID in _req.params_.

#### POST

    /

Creates a new envelope from _req.body_ (JSON) and adds it to the envelopes table. An envelope must have a _envelope_label_ (String) and a _envelope_limit_ (Integer). The _envelope_limit_ needs to be greater than 0. An ID is generated for the envelope.

#### PUT

    /:envelopeId

Updates an envelope with a specific ID in _req.params_. Requires both _envelope_label_ (String) and _envelope_limit_ (Integer) in _req.body_ (JSON).

#### DELETE

    /:envelopeId

Deletes an envelope with a specific ID in _req.params_.

### Transactions

The base url for the transactions endpoint is:

    /transactions

#### GET

    /

Gets all transactions from the transactions table.

    /:transactionId

Gets a transaction with a specific ID in _req.params_.

#### POST

    /:fromId/:toId

Creates a new transaction from _req.body_ (JSON) and adds it to the transactions table. A transaction must have a _transaction_amount_ (Integer). The _transaction_amount_ needs to be greater than 0. An ID is generated for the envelope and the current date is set for the transaction. The transaction is the moved from and envelope to another envelope with the corresponding ID in _req.params_.

#### PUT

    /:transactionId

Updates a transaction with a specific ID in _req.params_. Requires both _transaction_date_ (String) and _transaction_amount_ (Integer) in _req.body_ (JSON). The _transaction_date_ needs to be formatted to "YYYY-MM-DD" and _transaction_amount_ needs to be greater than 0.

#### DELETE

    /:transactionId

Deletes a transaction with a specific ID in _req.params_.
