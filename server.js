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

        // Templating Engine: EJS
        app.set('view engine', 'ejs')

        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // Accommodate JSON
        app.use(bodyParser.json())

        // clientside javascript, css, etc.
        app.use(express.static('public'))

        // Define routes
        app.get('/', (req, res) => {
            const cursor = db.collection('quotes').find().toArray()
                .then(results => {
                    // console.log(results)
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
            // console.log(cursor);
            // res.writeHead(200, { 'Content-Type': 'text/html' });
            // res.end();
            // res.sendFile(__dirname + '/index.html');


        })

        // Insert new quotes
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    // console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error))
        })

        // Update existing quotes
        app.put('/quotes', (req, res) => {
            console.log(req.body)
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    // console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })
        // Delete Darth Vader quotes
        app.delete('/quotes', (req, res) => {
            // console.log(req.body.name)
            // quotesCollection.findOneAndDelete(
            quotesCollection.deleteOne(
                // { name: 'Darth Vader' }
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        // console.log('go back')
                        return res.json('No quote to delete')

                    }
                    // console.log(result)
                    res.json(`Deleted Darth Vader's quote`)
                })
                .catch(error => console.error(error))
        })


        // Start web server
        app.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        })
    })
    .catch(error => console.error(error))

