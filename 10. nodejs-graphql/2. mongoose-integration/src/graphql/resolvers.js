const Product = require('../models/Product');

const resolvers = {
    Query: {
        products: async () => await Product.find({}),
        product: async (_, { id }) => await Product.findById(id)
    },

    Mutation: {
        createProduct: async (_, args) => {
            const newlyCreatedProduct = new Product(args);

            return await newlyCreatedProduct.save();
        },

        updateProduct: async (_, { id, ...updatedFields }) => {
            return await Product.findByIdAndUpdate(id, updatedFields, {
                new: true
            });
        },

        deleteProduct: async (_, { id }) => {
            const deletedProduct = await Product.findByIdAndDelete(id);

            return !!deletedProduct;
        }
    }
};

module.exports = resolvers;

/*
 GraphQL Resolvers: Product CRUD API
📦 ইমপোর্ট সেকশন
js
Copy
Edit
const Product = require('../models/Product');
ব্যাখ্যা:
MongoDB-এর সাথে সংযুক্ত একটি Product মডেল ইমপোর্ট করা হয়েছে, যা Mongoose স্কিমা ব্যবহার করে ডেটাবেজে ডাটা সংরক্ষণ/পাওয়া/পরিবর্তন করার কাজ করে।

🧠 Resolvers অবজেক্ট তৈরি
js
Copy
Edit
const resolvers = {
ব্যাখ্যা:
এটা মূল GraphQL রিজলভার অবজেক্ট, যেখানে Query এবং Mutation ফাংশনগুলো সংজ্ঞায়িত করা হয়েছে।

🔍 Query Section
1. products Query
js
Copy
Edit
products: async () => await Product.find({})
ব্যাখ্যা:
সমস্ত প্রোডাক্ট ডেটা ডেটাবেজ থেকে রিটার্ন করে।

Product.find({}): কোন শর্ত ছাড়াই সব প্রোডাক্ট রিটার্ন করে।

2. product Query (by ID)
js
Copy
Edit
product: async (_, { id }) => await Product.findById(id)
ব্যাখ্যা:
নির্দিষ্ট id অনুযায়ী একটি প্রোডাক্ট খুঁজে রিটার্ন করে।

_ হচ্ছে parent, যেটা এখানে ব্যবহার হয়নি।

✍️ Mutation Section
1. createProduct Mutation
js
Copy
Edit
createProduct: async (_, args) => {
    const newlyCreatedProduct = new Product(args);
    return await newlyCreatedProduct.save();
}
ব্যাখ্যা:

args এর মাধ্যমে ক্লায়েন্ট থেকে আসা ইনপুট দিয়ে নতুন একটি প্রোডাক্ট তৈরি করা হয়।

new Product(args): ইনপুট ডেটা দিয়ে Mongoose ডকুমেন্ট তৈরি।

.save(): ডেটাবেজে সেই ডেটা সংরক্ষণ করে।

2. updateProduct Mutation
js
Copy
Edit
updateProduct: async (_, { id, ...updatedFields }) => {
    return await Product.findByIdAndUpdate(id, updatedFields, {
        new: true
    });
}
ব্যাখ্যা:

নির্দিষ্ট id অনুসারে একটি প্রোডাক্ট আপডেট করে।

{ new: true } মানে আপডেট হওয়ার পরের নতুন ডেটা রিটার্ন করবে।

3. deleteProduct Mutation
js
Copy
Edit
deleteProduct: async (_, { id }) => {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return !!deletedProduct;
}
ব্যাখ্যা:

প্রোডাক্ট id দিয়ে খুঁজে মুছে ফেলা হয়।

!!deletedProduct: যদি ডিলিট সফল হয়, তাহলে true রিটার্ন করবে, নাহলে false।

📤 মডিউল এক্সপোর্ট
js
Copy
Edit
module.exports = resolvers;
ব্যাখ্যা:

resolvers অবজেক্টটি এক্সপোর্ট করা হয়েছে যাতে এটা অন্য ফাইলে যেমন ApolloServer বা schema.js ফাইলে ব্যবহৃত হতে পারে।

✅ সংক্ষিপ্ত সারাংশ:
আপনার কোডটি একটি সম্পূর্ণ GraphQL API যেখানে একটি Product মডেল ব্যবহার করে:

✅ সব প্রোডাক্ট দেখানো (products)

✅ নির্দিষ্ট প্রোডাক্ট দেখানো (product)

✅ প্রোডাক্ট তৈরি (createProduct)

✅ প্রোডাক্ট আপডেট (updateProduct)

✅ প্রোডাক্ট ডিলিট (deleteProduct)
*/
