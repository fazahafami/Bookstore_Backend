const books = require("../model/bookModel");
const stripe = require('stripe')('sk_test_51S0utpC3xX0ojiphZWhYnYYqVqmffTje6Ey7RD7G5W5bY3YpzOdrZbZjXUHLLuuHvvbp3Kw8Qa0nJADeuGSwjP3S00fJxGavy0')

//add books
exports.addBookControlller = async (req, res) => {
    console.log('inside addbookcontroller');

    const { title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category);


    uploadedImg = []
    req.files.map((item) => uploadedImg.push(item.filename))
    console.log(uploadedImg);

    const userMail = req.payload
    console.log(userMail);


    try {

        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json('You have already uploaded the book!')
        }
        else {
            const newBook = new books({
                title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }

    } catch (error) {
        res.status(500).json(error)
    }

}

//get home books only the latest 4 added
exports.getHomeBookController = async (req, res) => {
    try {
        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all books
exports.getAllBooksController = async (req, res) => {
    // console.log(req.query);
    const searchKey = req.query.search
    const email = req.payload

    try {
        const query = {
            title: {
                $regex: searchKey, $options: "i"
            },
            userMail: { $ne: email }
        }

        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to get a particular book

exports.getABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);


    try {
        const aBook = await books.findOne({ _id: id })
        res.status(200).json(aBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books added by a user
exports.getAllUserBookController = async (req, res) => {
    const email = req.payload
    try {
        const allUserBook = await books.find({ userMail: email })
        res.status(200).json(allUserBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books bought by a user
exports.getAllUserBroughtBookController = async (req, res) => {
    const email = req.payload
    try {
        const allUserBroughtBook = await books.find({ broughtBy: email })
        res.status(200).json(allUserBroughtBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to delet a user book
exports.deleteUserBookController = async (req, res) => {
    const { id } = req.params
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('Delete Successfull!')
    } catch (error) {
        res.status(500).json(error)
    }
}

//payment 
exports.makePayementController = async (req, res) => {
    const { booksDetails } = req.body
    const brought = req.payload
    try {
        const existingBook = await books.findByIdAndUpdate
            ({ _id: booksDetails._id }, {
                _id: booksDetails._id,
                title: booksDetails.title,
                author: booksDetails.author,
                noofpages: booksDetails.noofpages,
                imageUrl: booksDetails.imageUrl,
                price: booksDetails.price,
                dprice: booksDetails.dprice,
                abstract: booksDetails.abstract,
                publisher: booksDetails.publisher,
                language: booksDetails.language,
                isbn: booksDetails.isbn,
                category: booksDetails.category,
                uploadedImg: booksDetails.uploadedImg,
                status: 'sold',
                userMail: booksDetails.userMail,
                broughtBy: brought
            }, { new: true })

        //create stripe checkout session
        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: booksDetails.title,
                    description: `${booksDetails.author} | ${booksDetails.publisher}`,
                    images: [booksDetails.imageUrl],
                    metadata: {
                        title: booksDetails.title,
                        author: booksDetails.author,
                        noofpages: `${booksDetails.noofpages}`,
                        imageUrl: booksDetails.imageUrl,
                        price: `${booksDetails.price}`,
                        dprice: `${booksDetails.dprice}`,
                        abstract: booksDetails.abstract.slice(0,20), 
                        publisher: booksDetails.publisher,
                        language: booksDetails.language,
                        isbn: booksDetails.isbn,
                        category: booksDetails.category,
                        status: 'sold',
                        userMail: booksDetails.userMail,
                        broughtBy: brought
                    }
                },
                unit_amount:Math.round(booksDetails.dprice*100)
            },
            quantity:1
        }]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: "https://bookstore-frontend-three-beta.vercel.app/payment-success",
            cancel_url: "https://bookstore-frontend-three-beta.vercel.app/payment-error"
        })
        console.log(session);

        res.status(200).json({ sessionId: session.id})

    } catch (error) {
        res.status(500).json(error)
    }
}

//--------------------------------ADMIN-----------------------------------//

//to get all books for admin

exports.getAllBookAdminController = async (req, res) => {
    try {
        const allExistingBooks = await books.find()
        res.status(200).json(allExistingBooks)

    } catch (error) {
        res.status(500).json(error)
    }
}

//to approve a book
exports.approveBookController = async (req, res) => {

    const { _id, title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status, userMail, broughtBy } = req.body

    console.log(_id, title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status, userMail, broughtBy);

    try {

        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status: 'approved', userMail, broughtBy }, { new: true })

        // await existingBook.save()
        res.status(200).json(existingBook)

    } catch (error) {
        res.status(500).json(error)
    }
}