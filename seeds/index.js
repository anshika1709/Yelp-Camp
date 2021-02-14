const Campground = require('../models/campground');
const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {

    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 5000);
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/collection/357786`,
            desciption: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat repudiandae iste consequatur tempore labore voluptate quaerat quam officiis aspernatur quisquam assumenda explicabo, aut laudantium accusamus nostrum sint amet earum perspiciatis.',
            price: randomPrice,

        });

        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});