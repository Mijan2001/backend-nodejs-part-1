function delayFn(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function delayedGreet(name) {
    await delayFn(2000);
    console.log(name);
}

delayedGreet('Sangam');

async function division(num1, num2) {
    try {
        if (num2 === 0) throw new Error('Can not divide by 0');
        return num1 / num2;
    } catch (error) {
        console.error('error', error);
        return null;
    }
}

async function mainFn() {
    console.log(await division(10, 2));
    console.log(await division(10, 0));
}

mainFn();

// Bangla Expalnation step by step each line of this code
/*
1. function delayFn(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
    // এই ফাংশনটি নির্দিষ্ট সময় (মিলিসেকেন্ডে) অপেক্ষা করার জন্য একটি প্রমিস রিটার্ন করে।

2. async function delayedGreet(name) {
    await delayFn(2000);
    console.log(name);
}
    // এই ফাংশনটি ২ সেকেন্ড অপেক্ষা করে, তারপর নামটি কনসোলে দেখায়।

3. delayedGreet('Sangam');
    // delayedGreet ফাংশনটি কল করা হয়েছে, 'Sangam' নামটি ২ সেকেন্ড পরে দেখাবে।

4. async function division(num1, num2) {
    try {
        if (num2 === 0) throw new Error('Can not divide by 0');
        return num1 / num2;
    } catch (error) {
        console.error('error', error);
        return null;
    }
}
    // এই ফাংশনটি দুইটি সংখ্যার ভাগফল রিটার্ন করে। যদি দ্বিতীয় সংখ্যা ০ হয়, তাহলে এরর দেখায় এবং null রিটার্ন করে।

5. async function mainFn() {
    console.log(await division(10, 2));
    console.log(await division(10, 0));
}
    // এই ফাংশনটি division ফাংশন দুইবার কল করে, প্রথমবার ১০/২ এবং দ্বিতীয়বার ১০/০ দিয়ে। প্রথমবার সঠিক ফলাফল, দ্বিতীয়বার error ও null দেখাবে।

6. mainFn();
    // mainFn ফাংশনটি কল করা হয়েছে, ফলে উপরের দুইটি division অপারেশন চালু হবে।
*/
