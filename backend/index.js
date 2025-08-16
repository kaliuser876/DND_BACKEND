import express from "express"
import {ObjectId } from "mongodb"
import { connectToDb, getDb} from './db.js'
import dotenv from 'dotenv'

// Init
dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.port || 5000

// db connection
const uri = process.env.DATABASE_URL;
let db

connectToDb(uri,(err) => {
    if(!err){
        app.listen(port, ()=>{
            console.log(`Serve at http://localhost:${port}`)
        })
        db = getDb() // Get the db from the db file
    }
})

// routes
app.get("/", (req,res)=> {
    res.send("Server is ready BITCH")
})

    // All Books
app.get("/books", (req, res)=> {
    // current page
    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []
    // Connect to the collection books
    db.collection('books') 
    .find()
    .sort({ author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fetch the documents'})
    })
})

    // Individual Book
app.get("/books/:id", (req, res)=>{

    if( ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error : 'Could not fetch the document'})
        })
    }
    else{
        res.status(500).json({error : 'Not a vaild doc id'})
    }  
})

// Add a book
app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({err : 'Could not create a new document'})
    })
})

// Remove a book
app.delete('/books/:id', (req, res) => {

    if( ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : 'Could not delete the document'})
        })
    }
    else{
        res.status(500).json({error : 'Not a vaild doc id'})
    }
})

// Update a book
app.patch('/books/:id', (req, res) => {
    const updates = req.body

    if( ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : 'Could not update the document'})
        })
    }
    else{
        res.status(500).json({error : 'Not a vaild doc id'})
    }
})


