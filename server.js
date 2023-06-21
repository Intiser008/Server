// Require the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const sip = require('sip');

// Create an express app and a sip stack
const app = express();
const stack = sip.create({});

// Use body-parser middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Define a port for the server
const port = 3000;

// Define a route for receiving calls
app.post('/call', (req, res) => {
  // Get the call details from the request body
  const {from, to, sdp} = req.body;

  // Create a sip invite message
  const invite = sip.makeRequest({
    method: 'INVITE',
    uri: to,
    headers: {
      to: {uri: to},
      from: {uri: from, params: {tag: Math.floor(Math.random() * 1e6)}},
      'call-id': Math.floor(Math.random() * 1e6),
      cseq: {method: 'INVITE', seq: Math.floor(Math.random() * 1e5)},
      'content-type': 'application/sdp',
      contact: [{uri: from}],
      'user-agent': 'linphone'
    },
    content: sdp
  });

  // Send the invite message to the sip stack
  stack.send(invite);

  // Respond with a success message
  res.send('Call initiated successfully');
});

// Start the server and listen on the port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
