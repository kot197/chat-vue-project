
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Format hours with leading zero
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Format minutes with leading zero
    return `${hours}:${minutes}`;
}

module.exports = {
    getCurrentTime,
}