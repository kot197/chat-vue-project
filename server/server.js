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
  const db = await openDb();
   // create our 'messages' table (you can ignore the 'client_offset' column for now)
  initDb(db);

  const app = express();
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
  
    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result;

      try {
        // store the message in the database
        console.log(msg + " " + clientOffset);
        result = await insertMessage(db, msg, clientOffset);
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
      io.emit('chat message', msg, result.lastID);
      // acknowledge the event
      callback();
    });

    socket.on('create room', async (callback) => {
      const roomCode = uuidv4();
      console.log('Generated room code:', roomCode);

      try {
        console.log('Inserting room...');
        await insertRoom(db, roomCode);
        console.log('Room inserted');
      } catch(error) {
        console.error('Error inserting room:', error);
        return;
      }
      socket.join(roomCode);
      socket.emit('room created', roomCode);
      console.log(`Room created: ${roomCode}`);
      io.to(roomCode).emit('new user joined the room');
      callback();
    });

    socket.on('create user', async (userName, callback) => {
      try {
        await insertUser(db, userName);
      } catch(error) {
        console.error('Error inserting room:', error);
        return;
      }
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
        recoverMessages(db, socket);
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