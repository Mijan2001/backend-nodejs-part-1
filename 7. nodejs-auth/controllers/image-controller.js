const Image = require('../models/Image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadImageController = async (req, res) => {
    try {
        //check if file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image'
            });
        }

        //upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        //store the image url and public id along with the uploaded user id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newlyUploadedImage.save();

        //delete the file from local stroage
        // fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'Imaged uploaded successfully',
            image: newlyUploadedImage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if (images) {
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        //check if this image is uploaded by the current user who is trying to delete this image
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: `You are not authorized to delete this image because you haven't uploaded it`
            });
        }

        //delete this image first from your cloudinary stroage
        await cloudinary.uploader.destroy(image.publicId);

        //delete this image from mongodb database
        await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
};

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
};

/*
Image Upload, Fetch এবং Delete Controller – ডকুমেন্টেশন
🔁 1. uploadImageController
এই কন্ট্রোলারটি ইউজার কর্তৃক আপলোড করা লোকাল ইমেজ ফাইলকে Cloudinary তে আপলোড করে এবং তার URL ও Public ID MongoDB তে সংরক্ষণ করে।

✅ ধাপে ধাপে ব্যাখ্যা:
js
Copy
Edit
if (!req.file) {
ব্যাখ্যা:
যদি ক্লায়েন্ট কোনো ফাইল পাঠাতে ব্যর্থ হয়, তাহলে তা চেক করে error রিটার্ন করা হয়।

js
Copy
Edit
const { url, publicId } = await uploadToCloudinary(req.file.path);
ব্যাখ্যা:
ফাইলটি Cloudinary তে আপলোড করা হয় এবং তার থেকে secure URL ও publicId পাওয়া যায়।

js
Copy
Edit
const newlyUploadedImage = new Image({
    url,
    publicId,
    uploadedBy: req.userInfo.userId
});
ব্যাখ্যা:
ইমেজের তথ্য (url, publicId ও ইউজারের ID) নিয়ে নতুন একটি ডকুমেন্ট তৈরি করা হয়।

js
Copy
Edit
await newlyUploadedImage.save();
ব্যাখ্যা:
MongoDB তে ডেটা সেভ করা হয়।

js
Copy
Edit
// fs.unlinkSync(req.file.path);
ব্যাখ্যা:
Cloudinary তে সফলভাবে আপলোড করার পর লোকাল ফাইলটি মুছে ফেলার জন্য এই লাইনটি ব্যবহার করা হয় (কমেন্ট আকারে রাখা হয়েছে)।

📥 Response:
json
Copy
Edit
{
  "success": true,
  "message": "Image uploaded successfully",
  "image": { ... }
}
🔍 2. fetchImagesController
ইমেজগুলো Pagination এবং Sorting সহকারে ফেচ করে ইউজারকে রিটার্ন করে।

✅ ধাপে ধাপে ব্যাখ্যা:
js
Copy
Edit
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 2;
const skip = (page - 1) * limit;
ব্যাখ্যা:
পেইজ নম্বর এবং প্রতিপেইজ কতটি ছবি দেখাতে হবে তা নির্ধারণ করা হচ্ছে।

js
Copy
Edit
const sortBy = req.query.sortBy || 'createdAt';
const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
ব্যাখ্যা:
ইউজার চাইলে sortBy এবং sortOrder দিয়ে ইমেজগুলো কিভাবে সাজানো হবে তা নির্ধারণ করতে পারে।

js
Copy
Edit
const totalImages = await Image.countDocuments();
const totalPages = Math.ceil(totalImages / limit);
ব্যাখ্যা:
মোট কতগুলো ছবি আছে এবং সেই অনুযায়ী মোট কয়টি পেইজ হবে তা গণনা করা হয়।

js
Copy
Edit
const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
ব্যাখ্যা:
ডেটাবেজ থেকে সঠিক page অনুযায়ী নির্দিষ্ট পরিমাণ ছবি ফেচ করা হয়।

📥 Response:
json
Copy
Edit
{
  "success": true,
  "currentPage": 1,
  "totalPages": 5,
  "totalImages": 10,
  "data": [...]
}
🗑️ 3. deleteImageController
এই কন্ট্রোলার ইউজার কর্তৃক আপলোডকৃত ইমেজটি মুছে ফেলে Cloudinary এবং MongoDB উভয় জায়গা থেকে।

✅ ধাপে ধাপে ব্যাখ্যা:
js
Copy
Edit
const getCurrentIdOfImageToBeDeleted = req.params.id;
const userId = req.userInfo.userId;
ব্যাখ্যা:
URL এর মাধ্যমে ইমেজের ID পাওয়া হয় এবং লগইনকৃত ইউজারের ID চেক করা হয়।

js
Copy
Edit
const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
ব্যাখ্যা:
ডেটাবেজ থেকে সেই ID অনুযায়ী ইমেজ পাওয়া হয়।

js
Copy
Edit
if (image.uploadedBy.toString() !== userId) {
ব্যাখ্যা:
ইউজার যে ইমেজটি ডিলিট করতে চাইছে সেটি তার নিজের আপলোডকৃত কিনা তা যাচাই করা হয়।

js
Copy
Edit
await cloudinary.uploader.destroy(image.publicId);
ব্যাখ্যা:
Cloudinary থেকে সেই ইমেজটি মুছে ফেলা হয়।

js
Copy
Edit
await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted);
ভুল:
এখানে .findByIdAndDelete() হওয়া উচিত, নয়তো ডেটাবেজ থেকে ছবি ডিলিট হবে না।

📌 সঠিক কোড:

js
Copy
Edit
await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);
📥 Response:
json
Copy
Edit
{
  "success": true,
  "message": "Image deleted successfully"
}
📘 সংক্ষিপ্ত রেফারেন্স টেবিল
ফাংশন	কাজ	HTTP Method
uploadImageController	ফাইল Cloudinary তে আপলোড করে এবং MongoDB তে সংরক্ষণ করে	POST
fetchImagesController	Pagination সহ ইমেজ রিটার্ন করে	GET
deleteImageController	Image এর মালিকানা যাচাই করে, Cloudinary এবং MongoDB থেকে ডিলিট করে	DELETE
*/
