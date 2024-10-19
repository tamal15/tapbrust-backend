
const express= require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
// const SSLCommerzPayment = require('sslcommerz')
const { v4: uuidv4 } = require("uuid");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");

const app=express();
const port = process.env.PORT || 5000;
const SSLCommerzPayment = require('sslcommerz')
// app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utq7asn.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var uri = "mongodb://e-commerce-site:jxjFr9MI4pLrJS0s@ac-32bm4ox-shard-00-00.utq7asn.mongodb.net:27017,ac-32bm4ox-shard-00-01.utq7asn.mongodb.net:27017,ac-32bm4ox-shard-00-02.utq7asn.mongodb.net:27017/?ssl=true&replicaSet=atlas-1mjf8p-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('e-commerce');
        const buyerCollection = database.collection('buyerProduct');
        const potterCollection = database.collection('buyerPotter');
        const userCollection = database.collection('users');
        const likeCollection = database.collection('like');
        const paymentCollection = database.collection('payment'); 
        const adminPaymentCollection = database.collection('Adminpaymentdata');
        const featuresCollection = database.collection('features');
        const fashionCollection = database.collection('fashion');
        const userReviewCollection = database.collection('reviewCollected');
        const adminUploadProductCollection = database.collection('adminProducts');
        const adminUploadPotterCollection = database.collection('adminPotter');
        const feedbacksCollection = database.collection('userfeedbacks');
        const DesignCollection = database.collection('designUser');
        const PotterServiceCollection = database.collection('potterService');
        const bkashCollection = database.collection('bkashcollection');
        const withdrawsCollection = database.collection('withdrawCollection');
        const supportTicketCollection = database.collection('supportTicket');
        const loveproductCollection = database.collection('loveproduct');
        const walletTotalCollection = database.collection('walletTotal');
        const noticeCollection = database.collection('Notice');
        const countCollection = database.collection('count');





        /*--------------------------------------------------------------
        -----------------------------------------------------------------------
        -------------------------------------------------------------------
        ------------------------TapBrust project start----------------------
        -----------------------------------------------------------------
        ---------------------------------------------------------------------- */


          // notice 
          
          
          app.patch('/update-count', async (req, res) => {
            try {
              // Increment the count and update timestamp
              const result = await countCollection.findOneAndUpdate(
                {},
                { 
                  $inc: { count: 1 }, // Increment the count by 1
                  $set: { timestamp: new Date() } // Set the current timestamp
                },
                { returnDocument: 'after' } // Return the updated document
              );
          
              if (result.value) {
                res.status(200).json({ count: result.value.count, timestamp: result.value.timestamp });
              } else {
                res.status(404).send('Count document not found');
              }
            } catch (error) {
              console.error('Error updating count:', error);
              res.status(500).send('Error updating count');
            }
          });
          
          // Route to get current count and timestamp
          app.get('/get-count', async (req, res) => {
            try {
              const countDocument = await countCollection.findOne({});
              if (countDocument) {
                res.status(200).json({
                  count: countDocument.count,
                  timestamp: countDocument.timestamp,
                });
              } else {
                res.status(404).send('Count document not found');
              }
            } catch (error) {
              console.error('Error fetching count:', error);
              res.status(500).send('Error fetching count');
            }
          });









         /*--------------------------------------------------------------
        -----------------------------------------------------------------------
        -------------------------------------------------------------------
        ------------------------TapBrust project end----------------------
        -----------------------------------------------------------------
        ---------------------------------------------------------------------- */

        
    //    post product seller
        app.post('/postBuyer', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await buyerCollection.insertOne(user);
            res.json(result)
        });
        app.post('/potterservice', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await PotterServiceCollection.insertOne(user);
            res.json(result)
        });

        app.get('/shownotice', async (req, res) => {
          try {
            const result = await noticeCollection.find({}).toArray();
            res.json(result);
          } catch (error) {
            console.error('Error fetching notices:', error);
            res.status(500).send('Server error');
          }
        });

        app.patch('/update-wallet', async (req, res) => {
          const { email, amount } = req.body;
        
          try {
            // Fetch the user data to check if they've already joined Telegram
            const user = await userCollection.findOne({ email: email });
        
            if (user && !user.telegramJoined) {
              // If the user hasn't joined Telegram before, update the wallet
              const result = await userCollection.updateOne(
                { email: email },
                {
                  $inc: { wallet: amount },  // Increment the wallet balance by the specified amount
                  $set: { telegramJoined: true }  // Mark the user as having joined Telegram
                }
              );
        
              if (result.modifiedCount > 0) {
                res.status(200).send('Wallet updated and telegramJoined marked as true');
              } else {
                res.status(404).send('User not found');
              }
            } else {
              // User has already joined Telegram or doesn't exist
              res.status(400).send('Wallet update failed: User already joined Telegram or user not found');
            }
          } catch (error) {
            console.error('Error updating wallet:', error);
            res.status(500).send('Error updating wallet');
          }
        });
        
        
        
        

        app.get('/potterservicedetails/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await PotterServiceCollection.findOne(query)
            res.json(result)
        });

        app.get('/postBuyer', async(req,res)=>{
            const result=await buyerCollection.find({}).toArray()
            res.json(result)
        });
        app.get('/potterservice', async(req,res)=>{
            const result=await PotterServiceCollection.find({}).toArray()
            res.json(result)
        });

        // admin post product to database 
        //    post product buye
        app.post('/postadminProduct', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await adminUploadProductCollection.insertOne(user);
            res.json(result)
        });

        app.get('/getpostadmin', async(req,res)=>{
          const result=await adminUploadProductCollection.find({}).toArray()
          res.json(result)
      });

      app.get("/editproduct/:id", async (req, res) => {
        try {
          const id = req.params.id;
      
          // Validate and convert the ID to ObjectId
          if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
          }
      
          const query = { _id: new ObjectId(id) };
          const product = await adminUploadProductCollection.findOne(query);
      
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
      
          res.json(product);
        } catch (error) {
          console.error("Error fetching product:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      });


      // delete 
     
      
      app.delete('/productdelete/:parentId/:index', async (req, res) => {
        const { parentId, index } = req.params;
    
        try {
            // Validate parentId is a valid ObjectId
            if (!ObjectId.isValid(parentId)) {
                return res.status(400).json({ error: 'Invalid product ID format' });
            }
    
            const productId = new ObjectId(parentId);
    
            // Ensure index is an integer
            const serviceIndex = parseInt(index);
            if (isNaN(serviceIndex)) {
                return res.status(400).json({ error: 'Invalid service index format' });
            }
    
            // Perform the update operation to remove the service by its index
            const result = await adminUploadProductCollection.updateOne(
                { _id: productId }, // Find the product by its _id
                { $unset: { [`services.${serviceIndex}`]: "" } } // Unset the service at the given index
            );
    
            // Clean up the array to remove any null or undefined values left by $unset
            await adminUploadProductCollection.updateOne(
                { _id: productId },
                { $pull: { services: null } } // Remove null values resulting from $unset
            );
    
            if (result.modifiedCount > 0) {
                res.status(200).json({ deletedCount: result.modifiedCount });
            } else {
                res.status(404).json({ message: 'Product or service not found' });
            }
        } catch (err) {
            console.error('Error deleting service:', err);
            res.status(500).json({ error: 'An error occurred while deleting the service' });
        }
    });
      

      
      

app.put("/productupdate/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Validate and convert the ID to ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const query = { _id: new ObjectId(id) };
    const updatedProduct = req.body;

    const updateDoc = {
      $set: updatedProduct,
    };

    const result = await adminUploadProductCollection.updateOne(query, updateDoc);

    if (result.modifiedCount > 0) {
      res.json({ message: "Product updated successfully", modifiedCount: result.modifiedCount });
    } else {
      res.status(400).json({ message: "No changes made" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




      app.get('/category/:category', async (req, res) => {
        const category = req.params.category;
        console.log('Requested Category:', category);
        
        try {
            // Query the database for products where the 'services' array contains an object with the desired category
            const products = await adminUploadProductCollection.find({
                'services.categories': category
            }).toArray();
            
            // Transform the data to ensure it fits the frontend expectations
            const formattedProducts = products.map(product => ({
                ...product,
                services: product.services
                    .filter(service => service.categories === category) // Filter services based on category
                    .map(service => ({
                        types: service.types,
                        ProductPrice: service.ProductPrice,
                        img: service.img,
                        categories: service.categories,
                        description: service.description,
                        Fabric: service.Fabric,
                        size: service.size,
                        multipleimg: service.multipleimg,
                    })) // Map to the required fields
            }));
            
            res.json(formattedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    
    
  
    
    
    
    
    
    
        app.put('/service', async (req, res) => {
          console.log(req.body);
          const query = { types: req.body.types };
          const options = { upsert: true };
          
          const updateDoc = { $push: { services: req.body } };
          const result = await adminUploadProductCollection.updateOne(query, updateDoc, options);
          
          res.json(result);
        });
        

        // admin all product show to ui 
        // get sharee 
    app.get("/adminShowproduct", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });

        if (Object.keys(query).length) {
            const cursor = adminUploadProductCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allQuestions, count
            });
        } else {
            const cursor = adminUploadProductCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()

            res.json({
                allQuestions, count
            });
        }

    });



    // love product post the database 

    // Route to handle "like" and product information
  


        // potter post 

        app.post('/postPotter', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await potterCollection.insertOne(user);
            res.json(result)
        });

        

       

        // get potter 

        app.get("/getPotter", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });
    
            if (Object.keys(query).length) {
                const cursor = potterCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allQuestions, count
                });
            } else {
                const cursor = potterCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
    
                res.json({
                    allQuestions, count
                });
            }
    
        });


        // admin potter product upload 
        // potter post 

        app.post('/adminsPotter', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await adminUploadPotterCollection.insertOne(user);
            res.json(result)
        });


        // feedback 
        app.post('/feedbacks', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await feedbacksCollection.insertOne(user);
            res.json(result)
        });
        // feedback 
        app.get('/feedback', async(req,res)=>{
            const result=await feedbacksCollection.find({}).toArray()
            res.json(result)
        });


      

        // Route to submit payment data
app.post('/api/payments', async (req, res) => {
    try {
      const { bkashNumber, refCode, userId } = req.body;
      
      // Create a new payment record with an initial balance of 0 if not exists
      const newPayment = {
        bkashNumber,
        refCode,
        isVerified: false,
        amount: 0,
        userId,
        mainBalance: 0 // Initialize balance to 0
      };
  
      // Insert payment record
      await bkashCollection.insertOne(newPayment);
      res.json({ success: true, message: 'Payment submitted.' });
    } catch (error) {
      console.error('Error submitting payment:', error);
      res.status(500).json({ success: false, message: 'Error submitting payment.' });
    }
  });
  

        // Route for admin to verify payment
app.post('/api/payments/verify', async (req, res) => {
    try {
      const { id } = req.body; // Payment ID
      const payment = await bkashCollection.findOne({ _id: new ObjectId(id) });
  
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found.' });
      }
  
      // Verify the payment and update the balance
      if (!payment.isVerified) {
        // Verify the payment and add 100 taka to main balance
        await bkashCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: { isVerified: true, amount: 100 },
            $inc: { mainBalance: 100 } // Increment main balance by 100 taka
          }
        );
  
        // Fetch the updated record
        const updatedPayment = await bkashCollection.findOne({ _id: new ObjectId(id) });
  
        res.json({
          success: true,
          message: 'Payment verified and balance updated.',
          mainBalance: updatedPayment.mainBalance
        });
      } else {
        res.json({ success: false, message: 'Payment is already verified.' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ success: false, message: 'Error verifying payment.' });
    }
  });

//   Route to get all payments (for admin panel)
app.get('/api/payments', async (req, res) => {
    try {
      const payments = await bkashCollection.find().toArray();
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ success: false, message: 'Error fetching payments.' });
    }
  });

  

  // Route to get user's main balance
app.get('/api/users/:userId/balance', async (req, res) => {
    try {
      const { userId } = req.params;
      const payment = await bkashCollection.findOne({ userId: userId });
  
      if (!payment) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      res.json({ success: true, mainBalance: payment.mainBalance });
    } catch (error) {
      console.error('Error fetching user balance:', error);
      res.status(500).json({ success: false, message: 'Error fetching user balance.' });
    }
  });
  
  

       
        

        

    app.put("/updateProduct/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                productName:updateUser.productName,
                ProductPrice:updateUser.ProductPrice
            }
        }
        const result=await buyerCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    })

    app.get('/update/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await buyerCollection.findOne(query)
        res.json(user)
    })
   


     // buyerpottery update 

     app.put("/updatePotter/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                productName:updateUser.productName,
                ProductPrice:updateUser.ProductPrice
            }
        }
        const result=await potterCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    });
     // schedule update 

     app.put("/updatesSchedules/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                schedules:updateUser.schedules,
                // purchase:updateUser.purchase
            }
        }
        const result=await paymentCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    })
     // schedule update 

     app.put("/updatesPurchase/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                // schedules:updateUser.schedules,
                purchase:updateUser.purchase
            }
        }
        const result=await paymentCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    })

    app.get('/potter/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await potterCollection.findOne(query)
        res.json(user)
    })
   
    app.get('/showpay/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await paymentCollection.findOne(query)
        res.json(user)
    })
   
     

        // details show product 
        app.get('/product/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await buyerCollection.findOne(query)
            res.json(result)
        });
        app.get('/adminpotterdetails/:categories', async(req,res)=>{
            // const id=req.params.id
            const filter = { _id: ObjectId(req.params.id) };
            console.log(filter)
            const post = await PotterServiceCollection.findOne(filter);
            console.log(post)
            const check = post?.services?.filter(like => like?._id === req?.params?._id)
           
            
            
            console.log(check)
            // const query={_id:ObjectId(id)}
            // const result=await PotterServiceCollection.findOne(query)
            // res.json(result)
        });
        // details show admin product 
        app.get('/details/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await adminUploadProductCollection.findOne(query)
            res.json(result)
        });
        // details show admin product 
        app.get('/potterdetails/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await potterCollection.findOne(query)
            res.json(result)
        });


         // Add a route for user registration
         const { v4: uuidv4 } = require('uuid'); // Import uuidv4

         app.post('/users', async (req, res) => {
           const newUser = req.body; // Get the new user's data from the request body
         
           // Generate a unique transaction ID
           newUser.tran_id = uuidv4(); // Add tran_id to the newUser object
         
           const refCode = newUser.refCode; // Extract the reference code from the new user
         
           try {
             // Insert the new user into the users collection
             const result = await userCollection.insertOne(newUser);
             console.log(result)
             // If a reference code is provided, find the previous user who has this reference code
             if (refCode) {
               const previousUser = await userCollection.findOne({ tran_id: refCode });
         
               // If a previous user with this reference code exists, update their reference field
               if (previousUser) {
                 await userCollection.updateOne(
                   { _id: previousUser._id },
                   { $inc: { reference: 5 } } // Increment the reference field by 50 Taka
                 );
               }
             }
         
             res.json(result); // Return the response for user registration success
           } catch (error) {
             console.error('Error registering user:', error);
             res.status(500).json({ message: 'Error registering user' });
           }
         });
         


       

  // Endpoint to get user details by email
app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    // console.log(query)
    const user = await userCollection.findOne(query);
  
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
app.get('/usersnewdata/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    console.log(query)
    const user = await userCollection.findOne(query);
  
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  app.get('/review', async(req,res)=>{
    const result=await userReviewCollection.find({}).toArray()
    res.json(result)
})
  // Endpoint to get pending users
app.get('/usersdata/pending', async (req, res) => {
    try {
      const pendingUsers = await userCollection.find({ status: 'pending' }).toArray();
      res.json(pendingUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Endpoint to verify user payment and add balance
app.put('/verify-payment/:email', async (req, res) => {
    const email = req.params.email;
    try {
     
      const result = await userCollection.updateOne(
        { email: email },
        { 
          $set: { status: 'verified' },
          $inc: { balance: 0 } // Increment balance by 100
        }
      );
      if (result.modifiedCount > 0) {
        res.sendStatus(200);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

        app.get('/users', async(req,res)=>{
            const result=await userCollection.find({}).toArray()
            res.json(result)
        });
          // add database user collection 
          app.get('/users', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        })

        

        app.put('/users', async(req,res) =>{
            const user=req.body;
            console.log(user)
            const filter= {email:user.email}
            const option = {upsert:true}
            const updateDoc= {$set : user}
            const result= await userCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        });

        // database searching check buyer
    app.get('/users/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isbuyer=false;
        if(user?.client==='buyer'){
          isbuyer=true;
        }
        res.json({buyer:isbuyer})
    });
        // database searching check buyers
    app.get('/user/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isbuyers=false;
        if(user?.client==='buyers'){
          isbuyers=true;
        }
        res.json({buyers:isbuyers})
    });
       
    // database admin role 
    app.put('/userLogin/admin', async(req,res)=>{
        const user=req.body;
        console.log('put',user)
        const filter={email:user.email}
        const updateDoc={$set:{role:'admin'}}
        const result=await userCollection.updateOne(filter,updateDoc)
        res.json(result)
    });

       // database searching check admin 
       app.get('/userLogin/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isAdmin=false;
        if(user?.role==='admin'){
          isAdmin=true;
        }
        res.json({admin:isAdmin})
    });

    // update profile 

    app.put('/updateUser', async(req,res)=>{
        const user=req.body;
        const query={email:user.email}
        const updateDoc={
            $set:{
                address:user.address,
                mobile:user.mobile
            }
        }
        const result=await userCollection.updateOne(query,updateDoc);
        res.json(result)
    })
    // update schedule

    app.put('/updateSchedule', async(req,res)=>{
        const user=req.body;
        console.log(user)
        const query={email:user.email}
        const updateDoc={
            $set:{
                schedules:user.schedules,
                // mobile:user.mobile
            }
        }
        const result=await paymentCollection.updateOne(query,updateDoc);
        res.json(result)
    })

      // user profile email 
      app.get('/updateUser/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
        const result=await userCollection.findOne(query)
        res.json(result)
    });
      // user profile email 
      app.get('/userupdateUser/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
        const result=await userCollection.findOne(query)
        res.json(result)
    });
    // design part 
    // post review part 

        //  post review the database 
    app.post("/review", async (req, res) => {
        const review = req.body;
        const result = await userReviewCollection.insertOne(review);
        res.json(result);
    });
   


        // get resview 
    app.get('/review', async(req,res)=>{
        const result=await userReviewCollection.find({}).toArray()
        res.json(result)
    })


    // update schedule data 
      // database admin role 
      app.put('/schedule/:id', async(req,res)=>{
        const users=req.body.date;
        console.log('put',users)
        const id=(req.params.id)
        console.log(id)
       
    });


    // get sharee 
    app.get("/sharee", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });

        if (Object.keys(query).length) {
            const cursor = buyerCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allQuestions, count
            });
        } else {
            const cursor = buyerCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()

            res.json({
                allQuestions, count
            });
        }

    });


    app.get("/buyerproducts/:email", async (req, res) => {
        // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
        console.log(req.params.email);
        const email = req.params.email;
        const result = await buyerCollection
          .find({ buyerEmail: email })
          .toArray();
          console.log(result)
        res.send(result);
      });


    //   potter upload 
    app.get("/potterproducts/:email", async (req, res) => {
        // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
        console.log(req.params.email);
        const email = req.params.email;
        const result = await potterCollection
          .find({ buyerEmail: email })
          .toArray();
          console.log(result)
        res.send(result);
      });







    // delete book 
    app.delete('/deleteProduct/:id',async(req,res)=>{
        const result= await buyerCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });

    // delete potter 
    // delete book 
    app.delete('/deletePotter/:id',async(req,res)=>{
        const result= await potterCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });

    // delete admin product
    // delete admin product
    app.delete('/deleteadmin/:id',async(req,res)=>{
        const result= await adminUploadProductCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });


    app.put("/BlogStatusUpdate/:id", async (req, res) => {
     console.log(req.body.date)
        const filter = { _id: ObjectId(req.params.id) };

        const result = await buyerCollection.updateOne(filter, {
            $set: {
                schedule: req.body.date,
            },
        });
        res.send(result);
    });


    // app.put("/updatesPurchase/:id", async (req, res) => {

    //     const id=req.params.id;
    //     const updateUser=req.body
    //     console.log(updateUser)
    //     const filter={_id: ObjectId(id)};
    //     const options={upsert:true};

    //     const updateDoc={
    //         $set:{
    //             // schedules:updateUser.schedules,
    //             purchase:updateUser.purchase
    //         }
    //     }
    //     const result=await paymentCollection.updateOne(filter,updateDoc,options);
    //     console.log('uodateinf',id);
    //     res.json(result)

    // })

    // app.put("/service/:id", async (req, res) => {
    //     console.log(req.body)
    //     const filter = { _id: ObjectId(req.params.id) };
    //     console.log(filter)
    //     const options={upsert:true};
    //             const updateDoc={
    //            $push:{
    //                // schedules:updateUser.schedules,
    //                services: req.body,
    //            }
    //        }
   
      
    //    const result=await PotterServiceCollection.updateMany(filter,updateDoc,options);
           
    //        res.send(result);
    //    });
    


    //sslcommerz init


    // const likes=[{type:ObjectId}]
    // app.put('/buyer/:id',async(req,res)=>{
    //     const id=req.params.id;
    //     const like=req.body;
    //     const query={_id:ObjectId(id)}
        
    //     const updateDoc=[{
    //       $set:{
    //        {like:req.user._id}
    //       }
    //     }]
    //     const result=await buyerCollection.updateOne(query,updateDoc)
    //     res.json(result)
    //   })
    // app.put('/updateUser', async(req,res)=>{
    //     const user=req.body;
    //     const query={email:user.email}
    //     const updateDoc={
    //         $set:{
    //             address:user.address,
    //             mobile:user.mobile
    //         }
    //     }
    //     const result=await userCollection.updateOne(query,updateDoc);
    //     res.json(result)
    // })
    app.put('/service', async (req, res) => {
        
            console.log(req.body)
            // const filter = { _id: ObjectId(req.params.id) };
            const query={
                categories:req.body.categories}
            const options = { upsert: true };
            // const data=req.body
           
               
                    const updateDoc = { $push: { services: req.body } };
                    const result = await PotterServiceCollection.updateOne(query, updateDoc, options);
                    res.json(result)
                
              


    })

   


     // ================================Like in post====================================================
        //Link post----------------------------------------------------------------------------------------
        app.put('/like/:id', async (req, res) => {
            try {
                // console.log(req.body)
                const filter = { _id: ObjectId(req.params.id) };
                const post = await buyerCollection.findOne(filter);
                const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                if (!check) {
                    const options = { upsert: true };
                    const updateDoc = { $push: { likes: req.body } };
                    const result = await buyerCollection.updateOne(filter, updateDoc, options);
                    res.status(200).json(result)
                } else {
                    return res.status(400).json({ massage: "Post has not yet been liked" });
                }

            } catch (err) {
                res.status(500).send('Server Error')
            }

        })




            //unLink post-----------------------------------------------------------------------------------------
            app.put('/unlike/:id', async (req, res) => {
                try {
                    const filter = { _id: ObjectId(req.params.id) };
                    const post = await buyerCollection.findOne(filter);
                    const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                    if (check) {
                        const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                        const options = { upsert: true };
                        const updateDoc = { $set: { likes: removeIndex } };
                        const result = await buyerCollection.updateOne(filter, updateDoc, options);
                        res.status(200).json(result,)
                    } else {
                        return res.status(400).json({ massage: "Post has not yet been liked" });
                    }
                } catch (err) {
                    res.status(500).send('Server Error')
                }
            })
    
    // =======================================================================================================================
    
    //   like post potter 
    //Link post----------------------------------------------------------------------------------------
    app.put('/potterlike/:id', async (req, res) => {
        try {
            // console.log(req.body)
            const filter = { _id: ObjectId(req.params.id) };
            const post = await potterCollection.findOne(filter);
            const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
            if (!check) {
                const options = { upsert: true };
                const updateDoc = { $push: { likes: req.body } };
                const result = await potterCollection.updateOne(filter, updateDoc, options);
                res.status(200).json(result)
            } else {
                return res.status(400).json({ massage: "Post has not yet been liked" });
            }

        } catch (err) {
            res.status(500).send('Server Error')
        }

    })


    app.put('/potterunlike/:id', async (req, res) => {
        try {
            const filter = { _id: ObjectId(req.params.id) };
            const post = await potterCollection.findOne(filter);
            const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
            if (check) {
                const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                const options = { upsert: true };
                const updateDoc = { $set: { likes: removeIndex } };
                const result = await potterCollection.updateOne(filter, updateDoc, options);
                res.status(200).json(result,)
            } else {
                return res.status(400).json({ massage: "Post has not yet been liked" });
            }
        } catch (err) {
            res.status(500).send('Server Error')
        }
    })


     // ================================Like in post admin====================================================
        //Link post----------------------------------------------------------------------------------------


        const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

        app.put('/adminlike/:id', async (req, res) => {
            try {
                const postId = req.params.id;
        
                // Validate if the provided ID is a valid ObjectId
                if (!ObjectId.isValid(postId)) {
                    console.error(`Invalid ID format: ${postId}`);
                    return res.status(400).json({ message: "Invalid post ID format" });
                }
        
                const filter = { _id: new ObjectId(postId) };
                const userLike = { email: req.body.email, userId: req.body.userId };
        
                // Find the post
                const post = await adminUploadProductCollection.findOne(filter);
                if (!post) {
                    return res.status(404).json({ message: "Post not found" });
                }
        
                // Check if the user has already liked the post
                const alreadyLiked = post.likes.some(like => like.email === req.body.email);
        
                if (alreadyLiked) {
                    return res.status(400).json({ message: "Post already liked by this user" });
                }
        
                // Add the like
                const updateDoc = { $push: { likes: userLike } };
                const result = await adminUploadProductCollection.updateOne(filter, updateDoc);
                if (result.modifiedCount === 0) {
                    return res.status(400).json({ message: "Failed to update like" });
                }
        
                // Fetch and return the updated post
                const updatedPost = await adminUploadProductCollection.findOne(filter);
                res.status(200).json(updatedPost);
        
            } catch (err) {
                console.error('Error in PUT /adminlike/:id', err);
                res.status(500).send('Server Error');
            }
        });
        
        
      
      
      
      
      
        app.delete('/adminlike/:id', async (req, res) => {
          try {
              const postId = req.params.id;
      
              // Validate if the provided ID is a valid ObjectId
              if (!ObjectId.isValid(postId)) {
                  console.error(`Invalid ID format: ${postId}`);
                  return res.status(400).json({ message: "Invalid post ID format" });
              }
      
              const filter = { _id: new ObjectId(postId) };
              const userEmail = req.body.email;
      
              // Remove the like
              const updateDoc = { $pull: { likes: { email: userEmail } } };
              const result = await adminUploadProductCollection.updateOne(filter, updateDoc);
      
              if (result.modifiedCount === 0) {
                  return res.status(400).json({ message: "Like not found or already removed" });
              }
      
              // Fetch and return the updated post
              const updatedPost = await adminUploadProductCollection.findOne(filter);
              res.status(200).json(updatedPost);
      
          } catch (err) {
              console.error('Error in DELETE /adminlike/:id', err);
              res.status(500).send('Server Error');
          }
      });
      
      
    
    
      
      
      
      
      

          //admin unLink post-----------------------------------------------------------------------------------------
          app.put('/adminunlike/:id', async (req, res) => {
            try {
                const filter = { _id: ObjectId(req.params.id) };
                const post = await adminUploadProductCollection.findOne(filter);
                const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                if (check) {
                    const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                    const options = { upsert: true };
                    const updateDoc = { $set: { likes: removeIndex } };
                    const result = await adminUploadProductCollection.updateOne(filter, updateDoc, options);
                    res.status(200).json(result,)
                } else {
                    return res.status(400).json({ massage: "Post has not yet been liked" });
                }
            } catch (err) {
                res.status(500).send('Server Error')
            }
        })

// =======================================================================================================================


// Route to handle 'like' (saving the product)
app.post('/addLikedProductdata', async (req, res) => {
  const { categories, size, img, description,ProductPrice, userEmail } = req.body;
  console.log(req.body)
  
 

  try {
    
    
    const newProduct = {
      categories,
      size,
      img,
      description,
      ProductPrice,
      userEmail,
      likedAt: new Date(), // Optional: add a timestamp
    };

    const result = await loveproductCollection.insertOne(newProduct);
    console.log(result)
    res.status(201).send({ message: 'Product liked successfully', data: result.ops });
  } catch (error) {
    console.error('Error adding liked product:', error);
    res.status(500).send({ message: 'Server error', error });
  }
});


app.get("/getlovesproduct", async (req, res) => {
  const page = req.query.page;
  const size = parseInt(req.query.size);
  const query = req.query;
  delete query.page
  delete query.size
  Object.keys(query).forEach(key => {
      if (!query[key])
          delete query[key]
  });

  if (Object.keys(query).length) {
      const cursor = loveproductCollection.find(query, status = "approved");
      const count = await cursor.count()
      const allQuestions = await cursor.skip(page * size).limit(size).toArray()
      res.json({
          allQuestions, count
      });
  } else {
      const cursor = loveproductCollection.find({
          // status: "approved"
      });
      const count = await cursor.count()
      const allQuestions = await cursor.skip(page * size).limit(size).toArray()

      res.json({
          allQuestions, count
      });
  }

});


app.post('/update-balance', async (req, res) => {
  const { email, amount } = req.body;

  try {
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newBalance = user.balance + amount;
    await userCollection.updateOne(
      { email },
      { $set: { balance: newBalance } }
    );

    res.status(200).send({ balance: newBalance });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});



    //sslcommerz init
    app.post('/init', async (req, res) => {
      try {
        const { cartProducts, total_amount, select_courier, product_name, product_profile, cus_name, cus_email, date, status, address, Thana, Area_Bazar, cus_postcode, District, payment_number, schedules, purchase,courier_id,wallet_amount,phone } = req.body;
        
        if (!cartProducts || !cus_name || !cus_email) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const email = cartProducts.map((data) => data.buyerEmail);
        const adminemail = cartProducts.map((data) => data.adminEmail);
        
        // Calculate total income
        const totalIncome = cartProducts.reduce((acc, data) => acc + (data.totalIncome || 0), 0);
    
        const data = {
          emails: email,
          admindata: adminemail,
          total_amount: total_amount || 0,
          Totalincome: totalIncome,
          tran_id: uuidv4(),
          ipn_url: 'http://yoursite.com/ipn',
          shipping_method: 'Courier',
          product_name: product_name || 'Default Product Name',
          product_category: 'Electronic',
          product_profile: product_profile || 'Default Product Profile',
          cus_name,
          cus_email,
          wallet_amount,
          phone,
          date,
          select_courier,
          status,
          courier_id,
          cartProducts,
          product_image: 'https://i.ibb.co/t8Xfymf/logo-277198595eafeb31fb5a.png',
          address,
          cus_add2: 'Dhaka',
          Thana,
          schedules,
          purchase,
          Area_Bazar,
          cus_postcode,
          District,
          payment_number,
         
        };
    
        const order = await paymentCollection.insertOne(data);
        console.log(data);
        res.status(200).json({ message: 'Order successfully inserted', orderId: order.insertedId });
      } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });
    


    // Endpoint to get total income
  app.get('/totalIncome/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const orders = await paymentCollection.find({ cus_email: email }).toArray();
      console.log(orders)

      // Calculate total income
      const totalIncome = orders.flatMap(order => order.cartProducts.map(product => product.totalIncome))
                                .reduce((acc, income) => acc + income, 0);
                                console.log(totalIncome)
      res.json({ Totalincome: totalIncome });
    } catch (error) {
      console.error('Error fetching total income:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  app.get("/myincome/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const orders = await paymentCollection.find({ cus_email: email,status: "completed" }).toArray();
      console.log(orders)
  
      // Calculate total income
      const totalIncome = orders.reduce((sum, order) => {
        return sum + order.cartProducts.reduce((subTotal, product) => {
          return subTotal + (product.totalIncome || 0);
        }, 0);
      }, 0);

      
  
      res.json({ totalIncome  });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  

  


// Route to fetch wallet amounts and update user balance
// Backend API code
app.get('/payment-collection/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Step 1: Find all unprocessed payments associated with the user's email
    const payments = await paymentCollection.find({ cus_email: email, processed: { $ne: true } }).toArray();

    // Step 2: Initialize total wallet data to 0
    let alltotalwalletdata = 0;

    if (payments && payments.length > 0) {
      // Step 3: Sum all wallet_amount values if payments exist
      alltotalwalletdata = payments.reduce((total, payment) => {
        const walletAmount = parseFloat(payment.wallet_amount || 0); // Ensure wallet_amount is a number
        return total + walletAmount;
      }, 0);
    }

    // Step 4: Find the user in userCollection
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({  });
    }

    // Step 5: Calculate the updated balance (current balance - total wallet amount)
    const currentBalance = parseFloat(user.balance || 0); // Ensure balance is a number
    const updatedBalance = currentBalance - alltotalwalletdata;

    // Step 6: Update the user's balance in userCollection
    const updateResult = await userCollection.updateOne(
      { email },
      { $set: { balance: updatedBalance } }
    );

    // Step 7: Handle the case where the balance update fails
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({  });
    }

    // Step 8: Mark all found payments as processed
    await paymentCollection.updateMany(
      { cus_email: email, processed: { $ne: true } },
      { $set: { processed: true } }
    );

    // Step 9: Send the response back with updated balance and total wallet data
    res.status(200).json({
      // message: 'Balance updated successfully',
      updatedBalance,
      alltotalwalletdata,
      payments
    });

  } catch (error) {
    console.error('Error processing payment data:', error);
    res.status(500).json({ message: 'Error processing payment data', error });
  }
});
































































  


// Endpoint to update user's balance
// Endpoint to update user's balance
// Endpoint to update user's balance







  // Endpoint to update balance in userCollection and reset total income in paymentCollection
// Endpoint to add total income to balance and reset total income
// Update user's balance
app.patch('/api/pull-income/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Fetch the current balance of the user
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert balance from string to number (if necessary)
    const currentBalance = user.balance || 0; // Ensure currentBalance is a number

    // Fetch all payment records for the user
    const payments = await paymentCollection.find({ cus_email: email }).toArray();
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No income records found for this user' });
    }

    // Calculate total income from all payment records
    const totalIncome = payments.reduce((sum, payment) => {
      return sum + payment.cartProducts.reduce((subTotal, product) => {
        return subTotal + (product.totalIncome || 0);
      }, 0);
    }, 0);

    console.log('Total Income:', totalIncome); // Debugging log

    // Calculate the new balance
    const newBalance = currentBalance + totalIncome;

    // Update user's balance in the database (store as an integer)
    const resultBalance = await userCollection.updateOne(
      { email },
      { $set: { balance: newBalance } } // Store balance as integer
    );

    // Reset total income in payment records
    const resultIncome = await paymentCollection.updateMany(
      { cus_email: email },
      { $set: { 'cartProducts.$[].totalIncome': 0 } }
    );

    if (resultBalance.matchedCount > 0 && resultIncome.modifiedCount > 0) {
      res.json({ message: 'Total income has been added to balance and reset successfully' });
    } else {
      res.status(500).json({ message: 'Failed to update balance or reset income record' });
    }
  } catch (error) {
    console.error('Error updating balance and income:', error.message);
    res.status(500).json({
      message: 'Error updating balance and income',
      error: error.message,
    });
  }
});



// Endpoint to pull income to balance
app.patch('/api/reference-pull-income/:email', async (req, res) => {
  const email = req.params.email;

  try {
    // Find the user by email
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate new balance
    const newBalance = user.balance + user.reference;

    // Update the user's balance and reset total income
    const result = await userCollection.updateOne(
      { email: email },
      {
        $set: { balance: newBalance, reference: 0 }
      }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Income successfully pulled to balance' });
    } else {
      res.status(500).json({ message: 'Failed to update user balance' });
    }
  } catch (error) {
    console.error('Error pulling income:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});


app.patch('/api/datawallet-pull-income/:email', async (req, res) => {
  const email = req.params.email;

  try {
    // Find the user by email
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate new balance
    const newBalance = user.balance + user.wallet;

    // Update the user's balance and reset total income
    const result = await userCollection.updateOne(
      { email: email },
      {
        $set: { balance: newBalance, wallet: 0 }
      }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Income successfully pulled to balance' });
    } else {
      res.status(500).json({ message: 'Failed to update user balance' });
    }
  } catch (error) {
    console.error('Error pulling income:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

// get reference code 
app.get('/api/logged-in-user', async (req, res) => {
  try {
    const loggedInUserEmail = req.params.email;

    // Find the logged-in user by their email
    const loggedInUser = await userCollection.findOne({ email: loggedInUserEmail });

    if (loggedInUser) {
      res.json(loggedInUser); // Send logged-in user's details
    } else {
      res.status(404).json({ message: 'Logged-in user not found' });
    }
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to fetch all users and filter by `refCode`
app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users from the collection
    const users = await userCollection.find({}).toArray();

    if (users.length > 0) {
      res.json(users); // Return all users to the frontend
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});








// address the get 
// get reference code 
app.get('/newaddress', async (req, res) => {
  try {
    const users = await paymentCollection.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/newaddressdata/:email', async (req, res) => {
  try {
    const email = req.params.email; // Extract the email from the URL
    const data = await paymentCollection.find({cus_email: email }).toArray(); // Query by email
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// Submit a withdrawal request
// Submit a withdrawal request
app.post('/api/withdraw', async (req, res) => {
  const { email, amount, paymentMethod, mobileNumber } = req.body;

  // Convert amount to a number
  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await userCollection.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (numericAmount > user.balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create a new withdrawal request
    const newRequest = {
      email,
      amount: numericAmount,
      paymentMethod,
      mobileNumber,
      status: 'pending',
      createdAt: new Date()
    };

    // Insert the withdrawal request into the collection
    await withdrawsCollection.insertOne(newRequest);

    // Update the user's unpaid amount and balance
    await userCollection.updateOne(
      { email },
      { $inc: { unpaidAmount: numericAmount, balance: -numericAmount } }
    );

    res.json({ message: 'Withdrawal request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting withdrawal request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Admin approves a withdrawal request
app.patch('/api/approve-withdraw/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the withdrawal request by ID
    const request = await withdrawsCollection.findOne({ _id: new ObjectId(id) });
    if (!request) return res.status(404).json({ message: 'Withdrawal request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Find the user by email
    const user = await userCollection.findOne({ email: request.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user's paid and unpaid amounts
    await userCollection.updateOne(
      { email: request.email },
      { $inc: { paidAmount: request.amount, unpaidAmount: -request.amount } }
    );

    // Update the request status
    await withdrawsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'approved' } }
    );

    res.json({ message: 'Withdrawal request approved successfully.' });
  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch all pending withdrawal requests
app.get('/api/withdraw-requests', async (req, res) => {
  try {
    const requests = await withdrawsCollection.find({ status: 'pending' }).toArray();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a withdrawal request
app.patch('/api/approve-withdraw/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the withdrawal request by ID
    const request = await withdrawsCollection.findOne({ _id: new ObjectId(id) });
    if (!request) return res.status(404).json({ message: 'Withdrawal request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Find the user by email
    const user = await userCollection.findOne({ email: request.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user's paid and unpaid amounts
    await userCollection.updateOne(
      { email: request.email },
      { $inc: { paidAmount: request.amount, unpaidAmount: -request.amount } }
    );

    // Update the request status
    await withdrawsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'approved' } }
    );

    res.json({ message: 'Withdrawal request approved successfully.' });
  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch withdrawal history for a user
app.get('/api/withdraw-history/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find withdrawal requests for the given user
    const requests = await withdrawsCollection.find({ email }).toArray();

    // Return the list of requests
    res.json(requests);
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/all/withdraw-history', async (req, res) => {
  const { email } = req.params;

  try {
    // Find withdrawal requests for the given user
    const requests = await withdrawsCollection.find({  }).toArray();

    // Return the list of requests
    res.json(requests);
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.put('/updateCourier/:id', (req, res) => {
  const id = req.params.id;
  const { courier_id } = req.body;

  // Find the document and update the courier_id
  paymentCollection.updateOne({ _id: ObjectId(id) }, { $set: { courier_id } }, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update courier ID' });
    } else {
      res.json({ message: 'Courier ID updated successfully' });
    }
  });
});


app.get('/userbalancedata/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find withdrawal requests for the given user
    const requests = await userCollection.find({ email }).toArray();

    // Return the list of requests
    res.json(requests);
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Endpoint to get user details
app.get('/api/user-details', async (req, res) => {
  const { email } = req.query; // Get email from query params

  try {
   
    // Find user by email
    const user = await userCollection.findOne({ email });

    if (user) {
      // Send user details as a response
      res.status(200).send({
        name: user.displayName,
        email: user.email,
        referralCode: user.refCode,
        tran_id:user.tran_id
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send({ message: 'Server error' });
  }
});
    

// support ticket 

app.post('/api/support-ticket', async (req, res) => {
  const { subject, type, message,email } = req.body;
  
  try {
    // Save the support ticket data to the database
    await supportTicketCollection.insertOne({ subject, type, message,email, date: new Date().toLocaleDateString() });
    res.status(200).json({ message: 'Support ticket submitted successfully.' });
  } catch (error) {
    console.error('Error saving support ticket:', error);
    res.status(500).json({ message: 'Failed to submit support ticket.' });
  }
});

// Example Express.js route
app.get('/api/support-tickets', async (req, res) => {
  try {
    const tickets = await supportTicketCollection.find({}).toArray(); // Adjust based on your DB
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.get('/api/support-tickets/:email', async (req, res) => {
  try {
    const email = req.params.email; // Extract the email from the URL
    const tickets = await supportTicketCollection.find({ email }).toArray(); // Query by email
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});




app.delete("/ticketdelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    
    // Attempt to delete the document
    const result = await supportTicketCollection.deleteOne({ _id: objectId });

    // Check if deletion was successful
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Respond with success and deletedCount
    res.status(200).json({ message: 'Deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'An error occurred while deleting the order' });
  }
});



    

app.post('/success',async(req,res)=>{
    // console.log(req.body)
    const order = await paymentCollection.updateOne({tran_id:req.body.tran_id},{
        $set:{
          val_id:req.body.val_id
        }
    
      })
    res.status(200).redirect(`https://sarong-42db5.web.app/success/${req.body.tran_id}`)
    // res.status(200).json(req.body)
})

app.post ('/fail', async(req,res)=>{
    // console.log(req.body);
  const order=await paymentCollection.deleteOne({tran_id:req.body.tran_id})
    res.status(400).redirect('https://sarong-42db5.web.app')
  })
  app.post ('/cancel', async(req,res)=>{
    // console.log(req.body);
    const order=await paymentCollection.deleteOne({tran_id:req.body.tran_id})
    res.status(200).redirect('https://sarong-42db5.web.app')
  })


  app.get('/orders/:tran_id', async(req,res)=>{
    const id=req.params.tran_id;
    const order =await paymentCollection.findOne({tran_id:id});
    console.log(order)
    res.json(order)
  });












//   client order and single mail 
// email get my Order==============================================
 // get myorder 
 app.get("/myOrder/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const status = req.query.status || ''; // Get status from query parameters
    const date = req.query.date || ''; // Get date from query parameters

    // Build the filter query
    const filter = { cus_email: email };

    if (status) {
      filter.status = status;
    }

    if (date) {
      const formattedDate = new Date(date).toLocaleDateString(); // Format the date to match with database entries
      filter.date = formattedDate;
    }

    const result = await paymentCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

 app.get("/my/:email", async (req, res) => {
    // const buyeremail=req.body.emails.map((data)=>data.buyerEmail)
    // console.log(emails)
    // console.log(req.params.email);
    const email = req.params.email;
    console.log(email)
    const result = await paymentCollection
      .find({ emails: email })
      .toArray();
    res.send(result);
  });


  // filter data my order 
  app.get('/api/orders', async (req, res) => {
    try {
        const { date, status } = req.query;
        let filter = {};

        if (date) {
            filter.date = new Date(date);
        }
        if (status && status !== 'all') {
            filter.status = status;
        }

        const orders = await paymentCollection.find(filter).toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  // get admin page myorder 
  app.get("/adminuserMy", async (req, res) => {
    // const buyeremail=req.body.emails.map((data)=>data.buyerEmail)
    // console.log(emails)
    // console.log(req.params.email);
    const email = req.params.email;
    console.log(email)
    const result = await paymentCollection
      .find({ })
      .toArray();
    res.send(result);
  });


  app.get('/userMy/:email', async (req, res) => {
    try {
      const email = req.params.email; // Extract the email from the URL
      const tickets = await paymentCollection.find({cus_email: email }).toArray(); // Query by email
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  });

  //   delete api myorder 
//   app.delete('/deleteOrder/:id', async(req,res)=>{
//     const result=await myOrderCollection.deleteOne({_id:ObjectId(req.params.id)});
//     res.json(result)
// })

  // my order delete ----------
// Delete manage all product ----------



app.delete("/manageAllOrderDelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    
    // Attempt to delete the document
    const result = await paymentCollection.deleteOne({ _id: objectId });

    // Check if deletion was successful
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Respond with success
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'An error occurred while deleting the order' });
  }
});

//   post features product 
//    post product buyer 
app.post('/addnotice', async(req,res) =>{
    const user=req.body;
  console.log(user);
  
    const result=await noticeCollection.insertOne(user);
    res.json(result)
});


app.post('/datacollect',async(req,res)=>{
    const value=req.body;
    console.log(value)
    const output=await featuresCollection.insertOne(value);
    res.json(output)
});

app.post('/features',async(req,res)=>{
    const value=req.body;
    console.log(value)
    const output=await featuresCollection.insertOne(value);
    res.json(output)
});

app.get('/features', async(req,res)=>{
    const result=await featuresCollection.find({}).toArray()
    res.json(result)
});

app.post('/fashion',async(req,res)=>{
    const value=req.body;
    console.log(value)
    const output=await fashionCollection.insertOne(value);
    res.json(output)
});

app.get('/fashion', async(req,res)=>{
    const result=await fashionCollection.find({}).toArray()
    res.json(result)
});

// buyer status update 

 app.put("/buyerStatusUpdate/:id", async (req, res) => {
    // console.log(req.body)

    const filter = { _id: ObjectId(req.params.id) };
    
    const result = await userCollection.updateOne(filter, {
        $set: {
            client: req.body.statu,
        },
        
    });
    // console.log(result)
    res.send(result);
});


// delete user 
app.delete('/deleteUser/:id', async(req,res)=>{
    const result=await userCollection.deleteOne({_id:ObjectId(req.params.id)});
    // res.json(result)
});



// buyer check and admin confarm 
app.get('/adminConfarm', async(req,res)=>{
    const result=await userCollection.find({}).toArray()
    res.json(result)
});

app.delete('/delete-user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the user collection is defined
    if (!userCollection) {
      return res.status(500).send({ message: 'Database not initialized' });
    }

    // Convert id string to MongoDB ObjectId
    const objectId = new ObjectId(id);

    const result = await userCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user', error });
  }
});
app.delete('/delete-noticeuser/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the user collection is defined
    if (!userCollection) {
      return res.status(500).send({ message: 'Database not initialized' });
    }

    // Convert id string to MongoDB ObjectId
    const objectId = new ObjectId(id);

    const result = await noticeCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user', error });
  }
});

 // upadate status for put api 
 app.put('/updateStatus/:id', async (req, res) => {
  const id = req.params.id;
  const newStatus = req.body.status; // New status from request body
  console.log(newStatus);

  try {
      // Fetch the current order details
      const currentOrder = await paymentCollection.findOne({ _id: ObjectId(id) });

      if (!currentOrder) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Get the current status and track order
      const previousStatus = currentOrder.status;
      const currentTrackOrder = currentOrder.trackOrder || '';

      // Create the new track order format
      const updatedTrackOrder = currentTrackOrder
          ? `${currentTrackOrder} | ${previousStatus}`
          : previousStatus; // Initialize with previous status if trackOrder is empty

      // Update the order status and track order
      const result = await paymentCollection.updateOne(
          { _id: ObjectId(id) },
          {
              $set: {
                  status: newStatus,
                  trackOrder: updatedTrackOrder
              }
          }
      );

      // Check if the update was successful
      if (result.modifiedCount === 0) {
          return res.status(400).json({ message: 'Failed to update status' });
      }

      res.json({ message: 'Order status updated successfully', result });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


       

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req,res)=>{
    res.send("online shopping");
   });

   app.listen(port, ()=>{
    console.log("runnning online on port", port);
  }); 