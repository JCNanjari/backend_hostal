const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
require("dotenv").config();

const {dbConnection } = require ('./database/config');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const roomsRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/booking");
const passengerRoutes = require("./routes/passenger");
const paymentRoutes = require("./routes/payment");

// app
const app = express();



if (process.env.DB_CNN ){

  try {
    setTimeout(() => {

      dbConnection();
      
    }, 10000);
    
  } catch (error) {
    console.log(error);
    
  }
 
}else{

  mongoose
.connect(process.env.DATABASE, {
useUnifiedTopology: true,
useNewUrlParser: true,
useCreateIndex: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log('db not connected');
});

}




// db
/* mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    //uri: { useFindAndModify: false },
  })
  .then(() => console.log("DB Connected")); */

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// routes middleware

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", roomsRoutes);
app.use("/api", bookingRoutes);
app.use("/api", paymentRoutes);
app.use("/api", passengerRoutes);

//db
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
