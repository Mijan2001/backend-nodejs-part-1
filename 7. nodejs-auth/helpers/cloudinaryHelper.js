const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async filePath => {
    try {
        const result = await cloudinary.uploader.upload(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Error while uploading to cloudinary', error);
        throw new Error('Error while uploading to cloudinary');
    }
};

module.exports = {
    uploadToCloudinary
};

/*
 Cloudinary File Upload – ডকুমেন্টেশন
🎯 উদ্দেশ্য:
এই মডিউলটি Cloudinary ক্লাউড সার্ভিসে ফাইল (ছবি, ভিডিও ইত্যাদি) আপলোড করার জন্য তৈরি। এটি লোকাল ফাইলের filePath ইনপুট হিসেবে নিয়ে ক্লাউডে আপলোড করে তার URL এবং public ID রিটার্ন করে।

✅ 1. Cloudinary কনফিগারেশন ইমপোর্ট
js
Copy
Edit
const cloudinary = require('../config/cloudinary');
ব্যাখ্যা:
এখানে আমরা Cloudinary-এর সেটআপ করা কনফিগারেশন ফাইল ইমপোর্ট করেছি।
এ ফাইলের মধ্যে API credentials এবং .config() ফাংশন থাকবে।

🚀 2. Cloudinary-তে আপলোড করার ফাংশন
js
Copy
Edit
const uploadToCloudinary = async filePath => {
ব্যাখ্যা:
uploadToCloudinary() হল একটি asynchronous ফাংশন, যা লোকাল ফাইল পাথ ইনপুট হিসেবে নেয়।

☁️ 3. Cloudinary-তে আপলোড করা
js
Copy
Edit
const result = await cloudinary.uploader.upload(filePath);
ব্যাখ্যা:
Cloudinary-এর uploader.upload() ফাংশন ব্যবহার করে ফাইলটি ক্লাউডে আপলোড করা হয়।
এটি একটি Promise রিটার্ন করে, তাই await ব্যবহার করা হয়েছে।

🔁 4. আপলোড রেজাল্ট থেকে তথ্য রিটার্ন করা
js
Copy
Edit
return {
    url: result.secure_url,
    publicId: result.public_id
};
ব্যাখ্যা:
সফলভাবে আপলোড হলে, ফাংশনটি দুটি তথ্য রিটার্ন করে:

secure_url: ক্লাউডে আপলোড হওয়া ফাইলের https URL।

public_id: Cloudinary এর ভিতরে ফাইলটির unique ID।

⚠️ 5. Error Handling (ভুল ধরার ব্যবস্থা)
js
Copy
Edit
} catch (error) {
    console.error('Error while uploading to cloudinary', error);
    throw new Error('Error while uploading to cloudinary');
}
ব্যাখ্যা:
যদি আপলোড করার সময় কোনো সমস্যা হয়, তাহলে তা catch ব্লকে ধরা হবে।
এখানে console.error দিয়ে error দেখানো হয় এবং throw করে ফাংশন ব্যর্থ বলে ঘোষণা করা হয়।

📦 6. Module Export করা
js
Copy
Edit
module.exports = {
    uploadToCloudinary
};
ব্যাখ্যা:
এই ফাংশনটি অন্য ফাইলে ব্যবহার করার জন্য এক্সপোর্ট করা হচ্ছে।

✅ সারসংক্ষেপ টেবিল:
লাইন	কাজ
require('../config/cloudinary')	Cloudinary কনফিগারেশন ইমপোর্ট করে
uploadToCloudinary(filePath)	লোকাল ফাইল ক্লাউডে আপলোড করার ফাংশন
cloudinary.uploader.upload()	ফাইল ক্লাউডে আপলোড করে
secure_url	ক্লাউড ফাইলের public https লিংক
public_id	Cloudinary তে ফাইলের unique আইডি
catch block	Error হলে তা ধরে এবং মেসেজ দেয়
module.exports	ফাংশনটি বাইরে ব্যবহারের জন্য উন্মুক্ত করে
*/
