const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function openDb () {
    return open({
        filename: 'chat.db',
        driver: sqlite3.Database
    });
}

async function initDb(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_offset TEXT UNIQUE,
            content TEXT,
            time TEXT,
            room_id INTEGER,
            user_id INTEGER,

            FOREIGN KEY (room_id) REFERENCES rooms(room_id)
                ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
                ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS rooms (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_code TEXT NOT NULL CHECK (LENGTH(room_code) = 36)
        );

        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT
        );
      `);
}

async function insertMessage(db, msg, clientOffset, msgTime) {
    return await db.run('INSERT INTO messages (content, client_offset, time) VALUES (?, ?, ?)', msg, clientOffset, msgTime);
}

async function insertRoom(db, roomCode) {
    await db.run(`INSERT INTO rooms (room_code)
        VALUES (?)`, roomCode);
}

async function insertUser(db, userName) {
    await db.run(`INSERT INTO users (user_name)
        VALUES (?)`, userName);
}

async function recoverMessages(db, socket) {
    await db.each('SELECT id, content, time FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
            console.log('values to be emitted: ' + row.content + " " + row.time);
          socket.emit('chat message', row.content, row.id, row.time);
        }
    );
}

module.exports = {
    openDb,
    initDb,
    insertMessage,
    recoverMessages,
    insertRoom,
    insertUser,
};