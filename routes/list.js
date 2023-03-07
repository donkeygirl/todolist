import express from "express";
import ejs from 'ejs'
import mongoose from "mongoose";
import _ from 'lodash';
import {Item,List} from '../dbModels.js'
import {getDate, getDay} from '../date.js';

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
const router = express.Router();

const item1 = new Item({name:'Welcome to your todolist!'});
const item2 = new Item({name:'Hit the + button to add a new item.'});
const item3 = new Item({name:'<-- Hit this to delete an item.'});
let defaultItems = [item1,item2,item3];

router.get("/", async function(req, res) {
  const day = getDate();
  try {    
    //Item.find({},{'_id': 0, 'name':1}, function (err, items) {
    Item.find({}, async function (err, listItems) {
      if(listItems.length === 0){
        Item.insertMany(defaultItems, (err) => { (err) ? console.log(err) : console.log(listItems)});
        listItems = defaultItems;
      }     
      res.render("list", {listTitle: day, newListItems: listItems});            
    })   
  }catch{e=>console.log(e.message)}
});

router.get("/:customListName", async function(req, res) {
  //let customListName = _.upperFirst(_.lowerCase(req.params.customListName).trim());
  let customListName = _.capitalize(req.params.customListName);
  //console.log(customListName);
  List.findOne({name:customListName}, async function(err, listName){
    if(!err){
      if(!listName){
        console.log('not exist!');
        const list = new List({name:customListName, items:defaultItems});
        list.save(() => res.redirect('/' + customListName));                
      }
      else{        
        res.render('list',{listTitle: customListName, newListItems:listName.items});
      }  
    }   
  });     
});

router.post("/", async function(req, res){
  const day = getDate();
  const listName = (req.body.list).trim();
  const itemName = (req.body.newItem).trim();
  const nItem = new Item({name:itemName});  
  try {
    //console.log(req.body); 
    if(listName===day){
      if(nItem.name.length>0){
        nItem.save();
        res.redirect("/");                  
      }  
    }else{         
      List.findOne({name:listName}, async function(err, foundList){
        if(err){
          console.log(err);
        }else{                 
          foundList.items.push(nItem);                   
          foundList.save(() => res.redirect('/' + listName));           
        }        
      });               
    }    
  }catch{e=>console.log(e.message)};  
});

router.post("/delete", async function(req, res){
  const deleteId = (req.body.checkbox).trim();
  const listName = (req.body.listName).trim();
  //console.log(deleteId);
  //console.log(listName);
  const day = getDate();  
  try{
    if(listName===day){
      Item.findByIdAndRemove({_id:deleteId},function(err){
        if(err){
          console.log('index err');
          console.log(err);
        }else{
          //console.log('deleteList');
          res.redirect("/");
        }
      });  
    }else{
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:deleteId}}}, async function(err, returnList){
        if(err){
          console.log(err);
        }else{
          res.redirect("/"+listName);
        }
      });
      /*
      List.findOne().elemMatch('items', {_id:deleteId}).exec(async function(err, foundList){        
      });
      */
    } 
  }
  catch{e=>console.log(e.message)}
});


export default router;
