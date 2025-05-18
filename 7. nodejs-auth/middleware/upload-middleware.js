const multer = require('multer');
const path = require('path');

//set our multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(
            null,

            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

//file filter function
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images'));
    }
};

//multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB file size limit
    }
});

/*
Multer Configuration for Image Upload — Documentation
🎯 উদ্দেশ্য:
এই কোডটি Node.js অ্যাপে ইমেজ ফাইল আপলোড করার জন্য multer লাইব্রেরি ব্যবহার করে ফাইলের গন্তব্য, নামকরণ পদ্ধতি, ফাইল ফিল্টার ও সাইজ লিমিট কনফিগার করে।

✅ 1. প্রয়োজনীয় প্যাকেজ ইমপোর্ট
js
Copy
Edit
const multer = require('multer');
const path = require('path');
multer: ফাইল আপলোড হ্যান্ডল করার জন্য ব্যবহৃত middleware।

path: ফাইলের এক্সটেনশন বের করার জন্য ব্যবহৃত Node.js এর বিল্ট-ইন মডিউল।

🗂️ 2. স্টোরেজ কনফিগারেশন সেট করা
js
Copy
Edit
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});
🔹 destination
ব্যাখ্যা: ফাইল কোথায় সংরক্ষণ করা হবে সেটা নির্ধারণ করে।

এখানে 'uploads/' ফোল্ডারে ফাইল সেভ করা হবে।

🔹 filename
ব্যাখ্যা: কাস্টম ফাইলনেম সেট করে।

নাম হবে: fieldname-timestamp.extension, যেমন: image-1716011122334.jpg

🔍 3. ফাইল ফিল্টার ফাংশন
js
Copy
Edit
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images'));
    }
};
ব্যাখ্যা:
ফাইল আপলোডের সময় এটি যাচাই করে ফাইলটি ইমেজ কিনা।

file.mimetype যদি image দিয়ে শুরু হয়, তাহলে অনুমোদন দেওয়া হয়।

অন্য যেকোনো ফাইল হলে error রিটার্ন করে।

⛔ 4. ফাইল সাইজ সীমা
js
Copy
Edit
limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
}
ব্যাখ্যা:
আপলোডকৃত ফাইলের সর্বোচ্চ সাইজ ৫MB নির্ধারণ করা হয়েছে।

🚀 5. Multer Middleware এক্সপোর্ট করা
js
Copy
Edit
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
ব্যাখ্যা:
কনফিগার করা multer middleware টি এক্সপোর্ট করা হচ্ছে, যাতে রাউট ফাইলে এটি ব্যবহার করা যায়।

✅ সারসংক্ষেপ টেবিল:
বিষয়	কাজ
multer.diskStorage()	লোকেশন ও নামকরণ কনফিগার করে
destination	ফাইল কোথায় জমা হবে
filename	ফাইলের কাস্টম নাম নির্ধারণ
fileFilter	ইমেজ না হলে ব্লক করে
limits.fileSize	সর্বোচ্চ ফাইল সাইজ ৫MB
module.exports	middleware এক্সপোর্ট
*/
