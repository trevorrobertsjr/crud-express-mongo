const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const PORT = 3000;
const connectionString = `mongodb+srv://mongo:${process.env.MONGOPW}@cluster0.ooihwh0.mongodb.net/?retryWrites=true&w=majority`

// Establish DB connection with Callback
// MongoClient.connect(connectionString, (err, client) => {
//     if (err) return console.error(err);
//     console.log('Connected to Database');
// })

// Establish DB connection with Promises
MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // Define routes
        app.get('/', (req, res) => {
            const cursor = db.collection('quotes').find().toArray()
                .then(results => {
                    console.log(results)
                })
                .catch(error => console.error(error))
            console.log(cursor);
            // res.writeHead(200, { 'Content-Type': 'text/html' });
            res.sendFile(__dirname + '/index.html');
            // res.end();

        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    // console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error))
        })

        // Start web server
        app.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        })
    })
    .catch(error => console.error(error))

