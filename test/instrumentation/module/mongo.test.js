const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('agent')
const agent = new Agent(fixture.config)

const express = require('express')
const mongoose = require('mongoose')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

// test
const Schema = mongoose.Schema
const bookSchema = new Schema({
  title: String,
  author: String,
  published_date: { type: Date, default: Date.now }
})
const Book = mongoose.model('book', bookSchema);

// close client connection
const testCompletions = new Map()
setInterval(() => {
  if (Array.from(testCompletions.values()).every(v => v)) {
    agent.dataSender.closeClient()
  }
}, 2000)

const testName1 = 'mongodb1'
test.only(`Should record request in basic route`, function (t) {
  const testName = testName1
  testCompletions.set(testName, false)

  const app = new express()

  app.get('/api/books', async (req, res) => {
    await Book.find((err, books) => {
      if (err) return res.status(500).send({error:'failure'})
      res.send('ok get')
    })
  })

  app.get('/api/books/:book_id', async function(req, res){
    await Book.findOne({title: req.params.book_id}, function(err, book){
      console.log('TEST>',req.params.book_id)
      // if(err) return res.status(500).json({error: err})
      // if(!book) return res.status(404).json({error: 'book not found'})
      // res.json(book)
      res.send('KLLL')
    })
  })
  // CREATE BOOK
  app.post('/api/books', async function(req, res){
    var book = new Book();
    book.title = 'testbook2'//req.body.title
    book.author = 'jundol' //req.body.author
    book.published_date = new Date()
    book.save(function(err){
      if(err){
        console.error(err);
        res.json({result: 0});
        return;
      }
      res.json({result: 1});
    });
  });
  // UPDATE THE BOOK
  // app.put('/api/books/:book_id', async function(req, res){
  //   await Book.update({ title: 'notebooke' }, { $set: { title:'notebooke', author:'jundol' }}, function(err, output){
  //     if(err) res.status(500).json({ error: 'database failure' })
  //     console.log(output)
  //     if(!output.n) return res.status(404).json({ error: 'book not found' })
  //     res.json( { message: 'book updated' } )
  //   })
  // })

  app.put('/api/books/:book_id', async function(req, res){
    await Book.findOneAndUpdate({ title: 'notebooke' }, { $set: { title:'notebooke', author:'iforget' }}, function(err, output){
      if(err) res.status(500).json({ error: 'database failure' })
      console.log(output)
      if(!output.n) return res.status(404).json({ error: 'book not found' })
      res.json( { message: 'book updated' } )
    })
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const db = mongoose.connection
    db.on('error', console.error)
    db.once('open', function () {
      console.log("Connected to mongod server")
    })

    await mongoose.connect('mongodb://localhost/mongodb_pinpoint');

    //const rstInsert = await axios.post(getServerUrl('/api/books'))

    //const rstFind = await axios.get(getServerUrl('/api/books'))
    const rstFindOne = await axios.get(getServerUrl('/api/books/iforget1'))
    //const rstUpdate = await axios.put(getServerUrl('/api/books/testbook'))
  })

  testCompletions.set(testName, true)
})

