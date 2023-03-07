import express from "express";
import ejs from 'ejs'
import mongoose from "mongoose";
import listRoute from './routes/list.js'
//const mongoose_url = 'mongodb://127.0.0.1:27017/todolistDB';
import 'dotenv/config'
const HTTP_PORT = 3000 || 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
//app.get('/favicon.ico', (req, res) => res.status(204).end());
mongoose.set('strictQuery', false);

useMongoose().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Server started on port "+HTTP_PORT);
  })
}).catch(err => (console.log(err)));
async function useMongoose(){
  //await mongoose.connect(mongoose_url,{ useUnifiedTopology: true, useNewUrlParser: true });
  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});  
  app.use('/', listRoute);  

  app.get("/about", function(req, res){
    res.render("about");
  });
  //mongoose.disconnect();
  //mongoose.connection.close();
}
