const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller
const registerUser = async (req, res) => {
    try {
        //extract user information from our request body
        const { username, email, password, role } = req.body;

        //check if the user is already exists in our database
        const checkExistingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message:
                    'User is already exists either with same username or same email. Please try with a different username or email'
            });
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user and save in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newlyCreatedUser.save();

        if (newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully!'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Unable to register user! please try again.'
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        });
    }
};

//login controller

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        //find if the current user is exists in database or not
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User doesn't exists`
            });
        }
        //if the password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials!'
            });
        }

        //create user token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '30m'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Logged in successful',
            accessToken
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        //extract old and new password;
        const { oldPassword, newPassword } = req.body;

        //find the current logged in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        //check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Old password is not correct! Please try again.'
            });
        }

        //hash the new password here
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        //update user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        });
    }
};

module.exports = { registerUser, loginUser, changePassword };

/*
registerUser — রেজিস্ট্রেশন কন্ট্রোলার
কাজ:
নতুন ব্যবহারকারীকে ডাটাবেইসে যুক্ত করা।

ধাপসমূহ:
ডেটা রিড: req.body থেকে username, email, password, role নেওয়া হয়।

ব্যবহারকারী আছে কিনা চেক:
একই username অথবা email থাকলে, 400 রেসপন্স দিয়ে জানায়:

"User is already exists..."

পাসওয়ার্ড হ্যাশ:

bcrypt.genSalt(10) দিয়ে সল্ট তৈরি করে

bcrypt.hash(password, salt) দিয়ে হ্যাশ করে

নতুন ইউজার তৈরি:
ইউজার অবজেক্ট তৈরি করে, হ্যাশকৃত পাসওয়ার্ডসহ।

ডাটাবেইসে সংরক্ষণ:
save() দিয়ে মঙ্গোডিবিতে সংরক্ষণ করে।

রেসপন্স পাঠায়:

সফল হলে: 201 (Created)

না হলে: 400 বা 500

🔐 loginUser — লগইন কন্ট্রোলার
কাজ:
ব্যবহারকারী লগইন হলে টোকেন রিটার্ন করে।

ধাপসমূহ:
ইনপুট ডেটা নেয়া: username, password

ইউজার খোঁজা: User.findOne({ username })

না পেলে 400 দিয়ে জানায়:

"User doesn't exist"

পাসওয়ার্ড মিলানো:
bcrypt.compare(password, user.password)

না মিললে:

"Invalid credentials!"

JWT টোকেন তৈরি:

ইউজার আইডি, নাম, ভূমিকা দিয়ে টোকেন

expiresIn: '30m'

সফল রেসপন্স:

"Logged in successful" এবং accessToken রিটার্ন

🔒 changePassword — পাসওয়ার্ড পরিবর্তন
কাজ:
লগইন করা ইউজার তার পাসওয়ার্ড পরিবর্তন করতে পারবে।

ধাপসমূহ:
ইউজার আইডি নেয়া:
req.userInfo.userId (মানে ইউজার আগে থেকে অথেন্টিকেটেড)

পুরানো ও নতুন পাসওয়ার্ড রিড:
req.body.oldPassword, req.body.newPassword

ইউজার খোঁজা:
User.findById(userId)

পুরানো পাসওয়ার্ড মিলানো:
না মিললে, 400 দিয়ে জানায়:

"Old password is not correct!"

নতুন পাসওয়ার্ড হ্যাশ করে আপডেট করা:

নতুন হ্যাশ করে: bcrypt.hash(newPassword, salt)

user.password = newHashedPassword

user.save()

সফল রেসপন্স:

"Password changed successfully"
*/
