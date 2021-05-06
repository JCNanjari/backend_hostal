const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      userNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Base bd  datos conectada");
  } catch (error) {
    console.log(error);

    throw new Error("Error a la hora de conectar a la base de datos");
  }
};

module.exports = {
  dbConnection,
};
