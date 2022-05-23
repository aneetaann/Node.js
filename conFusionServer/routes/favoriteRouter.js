const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');



const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorite.findOne({ 'user': req.user._id })
  .populate('user')
  .populate('dishes')
  .then((favorite) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    

}, (err) => next(err))
.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorite.findOne({'user':req.user._id})
  .then((favorite) => {
      if (favorite != null) {
        for(i=0;i<req.body.length;i++){
            if(favorite.indexOf(req.body.dishes[i]._id) !== -1)
              favorite.dishes.push(req.body.dishes[i]._id)
          }
        favorite.save()
        .then((favorite) => {
          Favorite.findById(favorite._id)
          .populate('user')
          .populate('dishes')
          .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
          })            
      }, (err) => next(err));


      }
      else {
        Favorite.create({'user':req.user._id,'dishes':req.body})
        .then((favorite) => {
            console.log('Dish Created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Favorite.remove({})
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));    
});
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
  res.statusCode = 403;
  res.end('GET operation not supported on /favorite/'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Favorite.findOne({'user':req.user._id})
  .then((favorite) => {
      if (favorite != null) {
        if(favorite.indexOf(req.params.dishId) !== -1)
          favorite.dishes.push(req.params.dishId)
      favorite.save()
      .then((favorite) => {
        Favorite.findById(favorite._id)
        .populate('user')
        .populate('dishes')
        .then((favorite) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
          })            
      }, (err) => next(err));
      }
      else {
        Favorite.create({'user':req.user._id,'dishes':req.params.dishId})
        .then((favorite) => {
            console.log('favorite created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = favoriteRouter;


/*
favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs)
    }, (err) => {
        next(err)
    })
    .catch((err) => {
        next(err)
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        var user = favs.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
        
        if (!user) {
            user = new Favorites({user: req.user._id});
        }
        for (let i of req.body) {
            if (user.dishes.find((d) => {
                if (d._id) {
                    return d._id.toString() === i._id.toString();
                }
            }))
            continue;
            user.dishes.push(i._id);
        }
        user.save()
            .then((u) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(u);
            }, (err) => {
                next(err)
            })
            .catch((err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        var user = favs.filter(fav => fav.user._id.toString() === req.user._id.toString())[0]
        Favorites.findByIdAndDelete(user._id)
        .then((u) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(u);        
        })
    }, (err) => next(err))
    .catch((err) => next(err))
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        var user = favs.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
        if (!user) {
            user = new Favorites({user: req.user._id});
            user.dishes.push(req.params.dishId)
        } else {
            var checkDishToAdd = user.dishes.filter(dish => dish._id.toString() === req.params.dishId.toString())[0];
            if (!checkDishToAdd) {
                user.dishes.push(req.params.dishId)
            }
        }
        user.save()
        .then((u) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(u)
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        var user = favs.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
        if (!user) {
            var err = new Error('You do not have any favourites');
            err.status = 404;
            return next(err);            
        } else {
            user.dishes = user.dishes.filter(dish => dish._id.toString() !== req.params.dishId.toString());
        }
        user.save()
        .then((u) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(u)
        }, (err) => next(err))
        .catch((err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = favoriteRouter;
*/