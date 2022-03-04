const express = require('express')
const { insertObject } = require('../databaseHandler')
const router = express.Router()
const { ObjectId } = require('mongodb')

const {getDatabase, deleteProduct, getAllDocumentsFromCollection,
    getDocumentById, insertObjectToCollection, updateCollection} = require('../databaseHandler')
const async = require('hbs/lib/async')
    
router.get('/',(req,res)=>{
    res.render('admin/adminIndex')
})
router.get('/infor',(req,res)=>{
    res.render('admin/infor')
})

router.get('/addUser',(req,res)=>{
    res.render('admin/addUser')
})
router.get('/managerCustomer',async (req,res)=>{
    const orders = await getAllDocumentsFromCollection('Order')
    res.render("admin/managerCustomer", {orders:orders})
})

router.get('/orderDetail', async (req,res)=>{
    const idOrder = req.query.id
    const dbo = await getDatabase();
    const collectionName = 'Order'
    const order = await dbo.collection(collectionName).findOne({_id: ObjectId(idOrder)});
    
    const books = order.books
    const books2 = order.books
    
    var arrBook = new Array(books.length)
    var book
    for(var i =0;i<books.length;i++){
        book = await dbo.collection('Book').findOne({_id: ObjectId(books[i].productId)});
        books[i].productId = book;
        books[i].statusOrder = order.statusOrder
        books[i].price = books[i].quantity * books[i].price
        books[i].date = order.date

    }
    console.log(books)
    
    res.render("admin/orderDetail", {books:books, totalBill: order.totalBill})
})
router.get('/allOrder', async (req,res)=>{
    const email = req.query.email
    const dbo = await getDatabase();
    const orders = await dbo.collection('Order').find({email: email}).toArray();
    res.render("admin/allOrder", {orders:orders})
})
router.get('/allOrder2', async (req,res)=>{
    const email = req.query.email
    const dbo = await getDatabase();
    const orders2 = await dbo.collection('Order').find({email: email}).toArray();
    res.render("admin/allOrder2", {orders2 :orders2})
})

router.get('/idOrder', (req,res)=>{
    res.render("admin/idOrder")
})
router.get('/idOrder2', (req,res)=>{
    res.render("admin/idOrder2")
})
router.get('/feedbacks', async (req, res) =>{
    const email = req.query.email
    const dbo = await getDatabase();
    const feedbacks = await dbo.collection('Feedback').find({email: email}).toArray();
    res.render('admin/feedbacks', {feedbacks: feedbacks})
})

router.get('/deleteBook', async (req,res)=>{
    const id = req.query.id
    const collectionName = 'Book'
    await deleteProduct(collectionName, id)
    
    res.redirect("/admin/viewProduct")

})

router.get('/editBook', async (req,res)=>{
    const id = req.query.id
    const collectionName = 'Book'
    // await updateCollection(id, collectionName,)
    
    res.get("/admin/editProduct")

})

router.get('/listUser', (req,res)=>{
    res.render("admin/listUser")
})


router.get('/updateProfile', (req, res) =>{
    res.render('admin/managerBook/updateProfile')
})

router.post('/addProduct', async (req,res)=>{
    const name = req.body.txtName
    const price= req.body.txtPrice
    const picture= req.body.txtPicture
    const category= req.body.txtCategory
    const author= req.body.txtAuthor
    const description= req.body.txtDescription
    const collectionName = 'Book'
    
    const newP = {
        name: name, price: Number.parseFloat(price), imgURL: picture, author: author, description: description, category: category}
        
    await insertObjectToCollection(collectionName, newP);
    const notify = "Add book successful"

    res.render('admin/managerBook/addProduct', {notify: notify})
    })

router.post('/addCategory', async (req,res)=>{
    const name = req.body.txtName
    const description = req.body.txtDescription
    const collectionName = 'Category'
    
    const newP = {name: name, description: description}
        
    await insertObjectToCollection(collectionName, newP);
    const notify = "Add category successful"

    res.render('admin/managerBook/addCategories', {notify: notify})
    })
// router.post('/addCategories',async (req,res)=>{
//     const name = req.body.txtaddCategory
//     const newC = {
//         name: name, description: txt.parseFloat(description)

//     }
//     await insertObjectToCollection(collectionName, newC);
// //     res.render('admin/managerBook/addCategories')
// }
//      )

router.get('/insert',(req,res)=>{
        res.render('newProduct');
    })

router.get('/viewProduct', async (_req, res) => {

        const collectionName = 'Book'
        const dbo = await getDatabase();
        const products = await getAllDocumentsFromCollection(collectionName);
        // await changeIdToCategoryName(products, dbo);
    
        res.render('admin/managerBook/viewProduct', { products: products })
    })

router.get('/addProduct',(req,res)=>{
        res.render('admin/managerBook/addProduct');
    })
router.get('/editproduct', (req,res)=> {
    res.render('admin/managerBook/editProduct')
})
router.get('/addCategories', (req,res)=> {
    res.render('admin/managerBook/addCategories')
})
router.get('/viewCategories',async (_req,res)=> {
    const collectionName = 'Category'
    
    const category = await getAllDocumentsFromCollection(collectionName);
    res.render('admin/managerBook/viewCategories', {category: category })

})




module.exports = router;