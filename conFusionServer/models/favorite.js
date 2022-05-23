const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var dishesSchema = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
}, {
    timestamps: true
});

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[dishesSchema]
}, {
    timestamps: true
});
var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;

/*
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const favoriteSchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }]
}, {
    timestamps: true
})

var Favorites = mongoose.model('favorite', favoriteSchema)

module.exports = Favorites;
*/