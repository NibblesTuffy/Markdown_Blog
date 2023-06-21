const express = require('express')
const Article = require('./../models/article')
const router = express.Router() //give us router

//everything here is related to this path, relative to /articles
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article === null) {
    res.redirect('/')
  } else {
    // console.log('show page');
    // console.log('show page article');
    // console.log(article);
    res.render('articles/show', { article: article })
  }
})

router.post(
  '/',
  async (req, res, next) => {
    req.article = new Article()
    next()
    // console.log('post...............')
    // console.log(article)
    // try {
    //   article = await article.save()
    //   res.redirect(`/articles/${article.slug}`)
    //   console.log('save successfully!')
    // } catch (error) {
    //   // console.log(error)
    //   res.render('articles/new', { article: article })
    // }
  },
  saveArticleAndRedirect('new')
)

router.put(
  '/:id',
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  },
  saveArticleAndRedirect('edit')
)

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    //   console.log('post...............')
    // console.log(article)
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
      // console.log('save successfully!')
    } catch (error) {
      // console.log(error)
      res.render(`articles/${path}`, { article: article })
    }
  }
}
module.exports = router
