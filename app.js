const express=require("express");

const app=express();

const mongoose=require("mongoose");

const path=require("path");

const methodOverride=require("method-override");

const ejsMate=require("ejs-mate");


const ExpressError=require("./utils/ExpressError.js");


const listings=require("./routes/listing.js");

const reviews=require("./routes/review.js");

const session=require("express-session");

const flash=require("connect-flash")

const MONGO_URL="mongodb://127.0.0.1:27017/stayo";

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.engine("ejs", ejsMate);    

app.set("view engine","ejs");

app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 60,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    console.log(res.locals.success);
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Global Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(err.message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");


});