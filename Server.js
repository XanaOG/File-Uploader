const express = require('express');
const multer = require('multer');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    const uploadedFile = req.file;
    console.log('File Details:', uploadedFile);
    res.send('File uploaded successfully!');
});

http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('progress', (progress) => {
        io.emit('progress', progress);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
