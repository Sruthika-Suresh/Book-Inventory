const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
// const cors = require('cors')
const url = 'mongodb://localhost:27017'; // MongoDB connection URL
const dbName = 'bookInventory';
const port = 3004;  // Or any other unused port

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

  
async function requestHandler(req, res) {
  const db = client.db(dbName);
  const collection = db.collection('books');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


  if (req.method === 'OPTIONS') {
    res.writeHead(204); 
    
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/books') {
    try {
      const books = await collection.find({}).toArray();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(books));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error retrieving books');
    }
  } else if (req.method === 'POST' && req.url === '/books') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const book = JSON.parse(body);
        await collection.insertOne(book);
        res.writeHead(201, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Book added');
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error adding book');
      }
    });
  } else if (req.method === 'PUT' && req.url.startsWith('/books/')) {
    const bookId = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const updates = JSON.parse(body);
        const result = await collection.updateOne({ _id: new ObjectId(bookId) }, { $set: updates });
        if (result.matchedCount === 0) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Book not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Book updated');
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error updating book');
      }
    });
  } else if (req.method === 'DELETE' && req.url.startsWith('/books/')) {
    const bookId = req.url.split('/')[2];
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(bookId) });
      if (result.deletedCount === 0) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Book not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Book deleted');
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error deleting book');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Start server
client.connect()
  .then(() => {
    const server = http.createServer(requestHandler);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
