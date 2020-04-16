var db = require('./models')

db.article.findOne({
  where: { id: 1 },
  include: [db.comment]
}).then(function(article) {
  console.log(article.comments)
})