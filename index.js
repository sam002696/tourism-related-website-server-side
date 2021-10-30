const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yftux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Tourism server');
})

async function run() {
    try {
        await client.connect();
        const database = client.db("tourism");
        const bookingCollection = database.collection("bookings");
        const submitBooking = database.collection("submitbooking");
        // GET API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })
        // Single user api
        app.get('/bookingDetail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result);
        })
        // POST API
        app.post('/submitBooking', async (req, res) => {
            const newUser = req.body;
            const result = await submitBooking.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added new user', result);
            res.send(result);

        })
        // my booking api
        app.get('/submitbookings', async (req, res) => {
            const cursor = submitBooking.find({});
            const mySubmittedBookings = await cursor.toArray();
            res.send(mySubmittedBookings);
        })
        // delete from my booking api
        app.delete('/submitbookings/:id', async (req, res) => {
            const user = req.params.id;
            const query = { _id: ObjectId(user) };
            const result = await submitBooking.deleteOne(query);
            console.log('deleting user', user);
            res.json(result);
        })
        // add tour package
        app.post('/bookings', async (req, res) => {
            const newUser = req.body;
            const result = await bookingCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added new user', result);
            res.send(result);

        })
        // update booking status
        app.put("/submitbookings/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = 'approved';
            console.log(updatedStatus);
            const filter = { _id: ObjectId(id) };
            const updateInfo = {
                $set: {
                    status: updatedStatus,
                },
            };
            const result = await submitBooking.updateOne(filter, updateInfo);
            console.log(result);
            res.send(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('listening to', port);
})
// tourismUser
// gevj1Y6b2kChakFI