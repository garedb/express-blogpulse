var async = require('async')
var express = require('express')
var db = require('../models')
var router = express.Router()

// POST /articles - create a new post
router.post('/', function(req, res) {
  let tags = []
  if(req.body.tags) {
    tags = req.body.tags.split(',')
  }
  console.log(tags)

  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(function(article) {
    if (tags.length) {
      console.log('Tags length was greater than 0')
      // Create the tags + associations
      // async.forEach(array, normal forEach function, functino to run at the end)
      async.forEach(tags, (t, done) => {
        console.log('Inside for each, dealing with the tag:', t)
        // This function gets called for every item in the tags array
        db.tag.findOrCreate({
          where: { name: t.trim() }
        })
        .then(([tag, wasCreated]) => {
          console.log('Tag', t, 'was created successfully')
          //tag was found of created successfully, now we need to add to the join table
          // <model1>.add<model2>(model2 instance)
          article.addTag(tag)
          .then(() => {
            console.log('Associated tag', t, 'with the article')
            // All done adding tag and relation in join table, call done to indicate
            // that we are done with this iteration of the forEach loop
            done()
          })
        })
      }, () => {
        // This runs when everything has been resolved, now we safely move on to the next page
      res.redirect('/articles/' + article.id)  
      })
    }
    else {
      // No tags to be created, just redirect as normal
    res.redirect('/articles/' + article.id)  
    }
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

router.post('/:id/comments', function(req, res) {
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.params.id
  }).then(function(post) {
    console.log()
    res.redirect(`/articles/${req.params.id}`)
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('articles/new', { authors: authors })
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment, db.tag]
  })
  .then(function(article) {
    if (!article) throw Error()
    console.log(article.author)
    res.render('articles/show', { article: article })
  })
  .catch(function(error) {
    console.log(error)
    res.status(400).render('main/404')
  })
})

module.exports = router