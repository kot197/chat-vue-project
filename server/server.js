const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { availableParallelism } = require('node:os');
const cluster = require('node:cluster');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');
const { openDb, initDb, insertMessage, recoverMessages, insertRoom, insertUser } = require('./db');
const { v4: uuidv4 } = require('uuid');
const router = require('./router');

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }
  
  // set up the adapter on the primary thread
  return setupPrimary();
}

async function main() {
  await openDb();
  await initDb();

  const app = express();
  // Middleware to set CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Respond with 204 No Content for OPTIONS requests
    }

    next();
  });
  app.use('/', router);
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://localhost:5173"
    },
    // set up the adapter on each worker thread
    adapter: createAdapter()
  });

  io.on('connection', async (socket) => {
    console.log(`connect ${socket.id}`);
    io.emit('user connect', socket.id);
  
    socket.on('disconnect', (reason) => {
      console.log(`disconnect ${socket.id} due to ${reason}`);
    });
  
    socket.on('chat message', async (msg, clientOffset, msgTime, userId, username, callback) => {
      let result;

      try {
        // store the message in the database
        console.log(msg + " " + clientOffset + " " + userId);
        result = await insertMessage(msg, clientOffset, msgTime, userId);
      } catch (e) {
        // TODO handle the failure
        if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
          // the message was already inserted, so we notify the client
          callback();
        } else {
          // nothing to do, just let the client retry
        }
        return;
      }

      console.log("before emit chat message");
      // include the offset with the message
      io.emit('chat message', msg, result.lastID, msgTime, username);
      // acknowledge the event
      callback();
    });

    socket.on('create room', async (callback) => {
      const roomCode = uuidv4();
      console.log('Generated room code:', roomCode);

      try {
        console.log('Inserting room...');
        await insertRoom(roomCode);
        console.log('Room inserted');
      } catch(error) {
        console.error('Error inserting room:', error);
        return;
      }
      socket.emit('room created', roomCode); // Sent to the user
      console.log(`Room created: ${roomCode}`);
      callback();
    });

    socket.on('join room', async (roomCode, callback) => {
      socket.join(roomCode)
      io.to(roomCode).emit('new user joined the room'); // Sent to all users of different sockets
      callback();
    });

    socket.on('create user', async (userName, callback) => {
      try {
        result = await insertUser(userName);
      } catch(error) {
        console.error('Error inserting room:', error);
        return;
      }
      console.log(userName + " | " + result.lastID);
      socket.emit('user created', userName, result.lastID);
      callback();
    });

    // FOR TESTING
    socket.on('dummy test', async (callback) => {
      console.log("socket.on testing...");
      callback();
    });

    if (!socket.recovered) {
      // if the connection state recovery was not successful
      try {
        recoverMessages(socket);
      } catch (e) {
        // something went wrong
      }
    }
  });
  
  // each worker will listen on a distinct port
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}

main();