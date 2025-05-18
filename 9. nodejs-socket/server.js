const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const server = http.createServer(app);

//initiate socket.io and attch this to the http server
const io = socketIo(server);

app.use(express.static('public'));

const users = new Set();

io.on('connection', socket => {
    console.log('A user is now connected');

    //handle users when they will join the chat
    socket.on('join', userName => {
        users.add(userName);
        socket.userName = userName;

        //broadcast to all clients/users that a new user has joined
        io.emit('userJoined', userName);

        //Send the updated user list to all clients
        io.emit('userList', Array.from(users));
    });

    //handle incoming chat message
    socket.on('chatMessage', message => {
        //broadcast the received message to all connected clients
        io.emit('chatMessage', message);
    });

    //handle user disconnection
    socket.on('disconnect', () => {
        console.log('An User is disconnected', socket.userName);

        users.forEach(user => {
            if (user === socket.userName) {
                users.delete(user);

                io.emit('userLeft', user);

                io.emit('userList', Array.from(users));
            }
        });
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
});

/*
প্রকল্পের ডকুমেন্টেশন: রিয়েল-টাইম চ্যাট অ্যাপ (Node.js + Socket.IO)
🔧 প্রাথমিক সেটআপ
js
Copy
Edit
const express = require('express');
ব্যাখ্যা: Express.js ফ্রেমওয়ার্ক ইমপোর্ট করা হয়েছে যাতে HTTP সার্ভার তৈরি করা সহজ হয়।

js
Copy
Edit
const http = require('http');
ব্যাখ্যা: Node.js এর নেটিভ HTTP মডিউল ইমপোর্ট করা হয়েছে, যা দিয়ে কাস্টম সার্ভার তৈরি করা যাবে।

js
Copy
Edit
const socketIo = require('socket.io');
ব্যাখ্যা: socket.io লাইব্রেরি ইমপোর্ট করা হয়েছে রিয়েল-টাইম, ইভেন্ট-ভিত্তিক ওয়েবসকেট কমিউনিকেশনের জন্য।

🛠️ অ্যাপ এবং সার্ভার ইনিশিয়ালাইজেশন
js
Copy
Edit
const app = express();
ব্যাখ্যা: Express অ্যাপ অবজেক্ট তৈরি করা হয়েছে, যাতে API বা স্ট্যাটিক ফাইল সার্ভ করা যায়।

js
Copy
Edit
const server = http.createServer(app);
ব্যাখ্যা: Express অ্যাপ দিয়ে একটি HTTP সার্ভার তৈরি করা হয়েছে যা Socket.io এর সাথে কাজ করতে পারবে।

js
Copy
Edit
const io = socketIo(server);
ব্যাখ্যা: Socket.io কে HTTP সার্ভারে সংযুক্ত করা হয়েছে, যাতে সকল ইনকামিং ও আউটগোয়িং রিয়েল-টাইম কমিউনিকেশন হ্যান্ডল করা যায়।

🧱 স্ট্যাটিক ফাইল সার্ভ করা
js
Copy
Edit
app.use(express.static('public'));
ব্যাখ্যা: public ফোল্ডারে থাকা HTML/CSS/JS ফাইলগুলো ক্লায়েন্ট সাইডে সার্ভ করার জন্য ব্যবহৃত হয়েছে।

👥 ইউজার ম্যানেজমেন্টের জন্য সেট ব্যবহার
js
Copy
Edit
const users = new Set();
ব্যাখ্যা: সক্রিয় ইউজারদের ট্র্যাক করার জন্য একটি Set ব্যবহার করা হয়েছে, যাতে ডুপ্লিকেট ইউজার এন্ট্রি না হয়।

🔁 রিয়েল-টাইম ইভেন্ট হ্যান্ডলিং (Socket.IO)
js
Copy
Edit
io.on('connection', socket => {
ব্যাখ্যা: যখন নতুন কোনো ইউজার কানেক্ট হবে তখন এই কলব্যাক ফাংশন এক্সিকিউট হবে।

js
Copy
Edit
    console.log('A user is now connected');
ব্যাখ্যা: নতুন ইউজার কানেকশন লগ করা হয়েছে।

✅ ইউজার চ্যাটে জয়েন করলে
js
Copy
Edit
    socket.on('join', userName => {
        users.add(userName);
        socket.userName = userName;
ব্যাখ্যা:

ইউজার নাম Set-এ যোগ করা হয়েছে।

socket.userName দিয়ে ইউজারের নাম সংরক্ষণ করা হয়েছে, যাতে ডিসকানেকশনের সময় জানা যায় কে ছিল।

js
Copy
Edit
        io.emit('userJoined', userName);
        io.emit('userList', Array.from(users));
ব্যাখ্যা:

সব ক্লায়েন্টকে জানানো হয়েছে যে একজন ইউজার জয়েন করেছে।

সব ইউজারকে আপডেটেড ইউজার লিস্ট পাঠানো হয়েছে।

💬 চ্যাট মেসেজ হ্যান্ডলিং
js
Copy
Edit
    socket.on('chatMessage', message => {
        io.emit('chatMessage', message);
    });
ব্যাখ্যা: ইউজার চ্যাট করলে সেই মেসেজ সব কানেক্টেড ক্লায়েন্টকে পাঠিয়ে দেয়া হয়।

🔌 ডিসকানেকশন হ্যান্ডলিং
js
Copy
Edit
    socket.on('disconnect', () => {
        console.log('An User is disconnected', socket.userName);
ব্যাখ্যা: ইউজার ডিসকানেক্ট হলে সেটা লগ করা হয়।

js
Copy
Edit
        users.forEach(user => {
            if (user === socket.userName) {
                users.delete(user);
                io.emit('userLeft', user);
                io.emit('userList', Array.from(users));
            }
        });
ব্যাখ্যা:

ইউজারের নাম মিলে গেলে তাকে ইউজার লিস্ট থেকে বাদ দেয়া হয়।

সব ক্লায়েন্টকে জানানো হয় যে ইউজার চলে গেছে।

আপডেটেড ইউজার লিস্ট পাঠানো হয়।

🌐 সার্ভার চালু করা
js
Copy
Edit
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
});
ব্যাখ্যা:

সার্ভার PORT 3000-এ চালু করা হয়েছে।

সফলভাবে রান করলে URL সহ কনসোলে মেসেজ দেখায়।

✅ সারাংশ:
এই অ্যাপটি একটি রিয়েল-টাইম চ্যাটিং সিস্টেম, যেখানে ইউজাররা জয়েন করতে পারে, চ্যাট করতে পারে, এবং বের হয়ে গেলে অন্যদের জানানো হয়। এতে ইউজার তালিকা রিয়েল-টাইমে আপডেট হয় এবং সব ক্লায়েন্ট সিঙ্ক থাকে।

*/
