const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message:
                'Access denied. No token provided. Please login to continue'
        });
    }

    //decode this token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);

        req.userInfo = decodedTokenInfo;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                'Access denied. No token provided. Please login to continue'
        });
    }
};

module.exports = authMiddleware;

/*
JWT Authentication Middleware Documentation
🔐 উদ্দেশ্য:
এই Middleware টি ইনকামিং রিকুয়েস্টের Authorization হেডার থেকে JWT টোকেন যাচাই করে, এবং টোকেন বৈধ হলে ইউজারের ইনফো req.userInfo এ সংরক্ষণ করে next() দিয়ে পরবর্তী middleware বা route handler এ যাওয়ার অনুমতি দেয়।

📦 1. JWT লাইব্রেরি ইমপোর্ট
js
Copy
Edit
const jwt = require('jsonwebtoken');
ব্যাখ্যা:
jsonwebtoken লাইব্রেরি ইমপোর্ট করা হয়েছে, যা JWT encode/decode বা verify করার জন্য ব্যবহৃত হয়।

🔁 2. Middleware ফাংশন সংজ্ঞা
js
Copy
Edit
const authMiddleware = (req, res, next) => {
ব্যাখ্যা:
Express এর একটি কাস্টম middleware, যেটা req, res, ও next প্যারামিটার গ্রহণ করে।

📥 3. Token রিড করা
js
Copy
Edit
const authHeader = req.headers['authorization'];
console.log(authHeader);
const token = authHeader && authHeader.split(' ')[1];
ব্যাখ্যা:

ক্লায়েন্ট থেকে আসা Authorization হেডারটি রিড করা হচ্ছে।

সাধারণত টোকেন "Bearer TOKEN_STRING" ফর্মেটে আসে, তাই split(' ')[1] দিয়ে শুধু TOKEN_STRING নেওয়া হয়েছে।

🚫 4. Token না থাকলে রিজেক্ট করা
js
Copy
Edit
if (!token) {
    return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please login to continue'
    });
}
ব্যাখ্যা:

যদি টোকেন না পাওয়া যায়, তাহলে 401 Unauthorized রেসপন্স পাঠানো হয়।

🔍 5. Token যাচাই ও ডিকোড করা
js
Copy
Edit
try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo;
    next();
ব্যাখ্যা:

jwt.verify() ব্যবহার করে টোকেন যাচাই করা হচ্ছে।

সফল হলে decodedTokenInfo এ ইউজারের ইনফো (যেমন id, email ইত্যাদি) পাওয়া যাবে।

req.userInfo তে সেই ইনফো সংরক্ষণ করা হয়, যা পরবর্তী রাউট বা middleware ব্যবহার করতে পারবে।

next() কল করে পরবর্তী স্টেপে পাঠানো হয়।

❌ 6. যদি টোকেন ভ্যালিড না হয় (catch block)
js
Copy
Edit
} catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Access denied. No token provided. Please login to continue'
    });
}
ব্যাখ্যা:

যদি jwt.verify() এ কোনো error আসে (যেমন invalid token, expired token), তাহলে 500 error সহ access deny করা হয়।

📤 7. Middleware এক্সপোর্ট
js
Copy
Edit
module.exports = authMiddleware;
ব্যাখ্যা:
অন্য ফাইল থেকে এই middleware ফাংশন ইমপোর্ট করে ব্যবহার করার জন্য এক্সপোর্ট করা হয়েছে।

✅ সারাংশ (Summary):
কাজ	ব্যাখ্যা
JWT Token verify	Authorization হেডার থেকে টোকেন বের করে যাচাই করে
Token না থাকলে	401 Access Denied রিটার্ন করে
Token ঠিক থাকলে	ডিকোড করা ইউজার ইনফো req.userInfo তে রেখে next() করে
Middleware Export	অন্যান্য ফাইলে ব্যবহারের জন্য
*/
