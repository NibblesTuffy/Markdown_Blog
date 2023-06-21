const express = require('express')
const articleRouter = require('./routes/articles')

const app = express()
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')

//write all of our views to ejs and ejs turn all ejs code to HTML
mongoose.connect('mongodb://127.0.0.1:27017/blog1', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
app.set(
  'view engine',
  'ejs'
  )

//where articleRouter to be add /articles
app.use(express.urlencoded({ extended: false })) //tell server how to access the req, req.body.title
app.use(methodOverride('_method'))
app.get('/', async (req, res) => {
  //access all articles in mongodb
  const articles = await Article.find().sort({ createAt: 'desc' })
  res.render('articles/index', { articles: articles }) //Home page, '/'
})

app.use('/articles', articleRouter)
app.listen(5000)
