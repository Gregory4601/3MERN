const mongoose = require('mongoose');

mongoose.connect(
  "mongodb+srv://gregory:XjWd4shk505UzdT6@cluster0.4dv2n.mongodb.net/ProjetFinal_3MERN",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Mongodb: Connected");
    else console.log("Mongodb: Connection error :" + err);
  }
)