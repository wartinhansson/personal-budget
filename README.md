# Personal Budget

## Description

For this project, you will build an API that allows clients to create and manage a personal budget. Using [Envelope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682) principles, your API should allow users to manage budget envelopes and track the balance of each envelope. Your API should follow best practices regarding REST endpoint naming conventions, proper response codes, etc. Make sure to include data validation to ensure users do not overspend their budget!

### Project Objectives:

- Build an API using Node.js and Express
- Be able to create, read, update, and delete envelopes
- Create endpoint(s) to update envelope balances
- Use Git version control to keep track of your work
- Use the command line to navigate your files and folders
- Use Postman to test API endpoints

### Prerequisites:

- Command line and file navigation
- Javascript
- Node.js
- Express
- Git and GitHub
- Postman

## Endpoints

Currently the API uses one router to handle requests for envelopes. The base url for the api is:

    /envelopes

### GET

    /

Gets all the envelopes in the envelopes array.

    /:envelopeId

Gets an envelope with a specific ID from _req.params_.

### POST

    /

Creates a new envelope from _req.body_ (JSON) and adds it to the array of envelopes. An envelope must have a _label_ (String) and a _limit_ (Number). An ID is generated for the envelope.

    /transfer/:from/:to

Transfers funds from one envelope to another. Takes a _req.query_, the _amount_ (Number) that should be transferred.

### PUT

    /:envelopeId

Updates an envelope. Requires both _label_ (String) and _limit_ (Number) in _req.body_ (JSON).

### DELETE

    /:envelopeId

Deletes an envelope with a specific ID from _req.params_.
