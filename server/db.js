const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


let db;

async function openDb() {
    if(db) {
        return;
    }

    db = await open({
        filename: 'chat.db',
        driver: sqlite3.Database
    });
}

async function initDb() {
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

async function insertMessage(msg, clientOffset, msgTime, userId) {
    return await db.run('INSERT INTO messages (content, client_offset, time, user_id) VALUES (?, ?, ?, ?)', msg, clientOffset, msgTime, userId);
}

async function insertRoom(roomCode) {
    await db.run(`INSERT INTO rooms (room_code)
        VALUES (?)`, roomCode);
}

async function insertUser(userName) {
    return await db.run(`INSERT INTO users (user_name)
        VALUES (?)`, userName);
}

async function recoverMessages(socket) {
    await db.each(`SELECT messages.id, messages.content, messages.time, users.user_name
                    FROM messages
                    JOIN users ON messages.user_id = users.user_id
                    WHERE messages.id > ?`,
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
            console.log('values to be emitted: ' + row.content + " " + row.time);
          socket.emit('chat message', row.content, row.id, row.time, row.user_name);
        }
    );
}

async function checkRoomCode(roomCode) {
    console.log("roomCode " + roomCode);

    return await db.get(`SELECT room_code FROM rooms WHERE room_code = ?`, [roomCode]);
}

module.exports = {
    openDb,
    initDb,
    insertMessage,
    recoverMessages,
    insertRoom,
    insertUser,
    checkRoomCode,
};