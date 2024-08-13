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
            room_id INTEGER,
            FOREIGN KEY (room_id) REFERENCES rooms(room_id)
        );
        
        CREATE TABLE IF NOT EXISTS rooms (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_code TEXT NOT NULL CHECK (LENGTH(room_code) = 36)
        );
      `);
}

async function insertMessage(db, msg, clientOffset) {
    return await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
}

async function insertRoom(db, roomCode) {
    await db.run(`INSERT INTO rooms (room_code)
        VALUES (?)`, roomCode);
}

async function recoverMessages(db, socket) {
    await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
    );
}

module.exports = {
    openDb,
    initDb,
    insertMessage,
    recoverMessages,
    insertRoom,
};