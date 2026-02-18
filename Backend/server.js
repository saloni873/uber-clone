const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket'); // Import the file we just made
const port = process.env.PORT || 3000;

// 1. Create the HTTP server using the Express app
const server = http.createServer(app);

// 2. Pass this server to our Socket initialization logic
initializeSocket(server);

// 3. IMPORTANT: Change 'app.listen' to 'server.listen'
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});