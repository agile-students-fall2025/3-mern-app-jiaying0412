require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all About Page content
app.get('/api/about', (req, res) => {
  const aboutData = {
      title: 'Here is a little about me!',
      body: `Hello! I’m Jiaying, a senior majoring in Interactive Media Arts at Tisch and minoring in Computer Science. 
      I’m from New York, and my favorite color is blue. I enjoy listening to K-pop and R&B music, and in my free time 
      I love drawing, DIYing, and crocheting—a hobby I picked up during the pandemic. At this point, I’ve collected a small 
      mountain of yarn at home and enjoy making little accessories like bags and charms. I’m especially interested in projects 
      that combine art and technology, particularly those that explore storytelling or playful interaction. I’m also a big fan 
      of coffee and anything matcha-flavored.
      
      Over the summer, my family and I took a short trip to Banff, Canada, where we went hiking and saw lots of beautiful 
      lakes and scenery. I also went on a trip to Boston with my friends,it was my first time traveling without my family, 
      and I got to celebrate my birthday right before the new semester began, which made the break even more special.`, 
      imgUrl: "/Jiaying.jpeg"
  };

  res.json(aboutData); // Send JSON response
});


// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})


// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
