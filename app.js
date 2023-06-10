
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
// var items = ["Buy food","Cook food"];
var workItem = [];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");
// const username = encodeURIComponent("SagarGupta215");
// const password = encodeURIComponent("TodoList100#");
mongoose.connect("mongodb+srv://SagarGupta215:TodoList100@cluster0.iim9xax.mongodb.net/todoListDB",{useNewUrlParser:true});
    
    const itemschema = new mongoose.Schema({
        name:String
    });
    const Item = mongoose.model("Item",itemschema);
    const item1 = new Item({
        name:"Buy Food"
    });
    const item2 = new Item({
        name:"Cook Food"
    });
    const item3 = new Item({
        name:"Eat Food"
    });
    const defaultitem = [item1,item2,item3];
    
    const listSchema = mongoose.Schema({
        name: String,
        items: [itemschema]
    });
    const List = mongoose.model('List' , listSchema);

    

app.get("/", function(req,res){
    
    let day = date();
    Item.find({}).then().then(function (foundItems) {
        if(foundItems.length === 0) {
            Item.insertMany(defaultitem).then(function () {
                console.log("Successfully saved defult items to DB");
            }).catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
        }else{
        res.render("lists" , {listTitle:"Today", newListItems:foundItems}); 
        }
    }).catch(function (err) {
        console.log(err);
    });
       
});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName}).then(function (foundList) {
        if(!foundList){
            // console.log("Doesn't Exists");
            // create a new list
            const list  = new List({
                name:customListName,
                items:defaultitem
            });
            list.save();
            res.redirect("/"+customListName);
        }else{
            // console.log("Exists");
            // show an existing list
            res.render("lists", {listTitle:foundList.name, newListItems:foundList.items});
        }
    }).catch(function (err) {
        console.log(err);
    });
    
});

app.post("/" , function(req,res){
    
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name:itemName
    });
    if(listName === "Today")
    {
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}).then(function (foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName)
        }).catch(function (err) {
            console.log(err);
        });
    }
    

    // if (req.body.list === "Work") {
    //     workItem.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }
    
});

app.post("/delete",function(req,res){
    const checkedItemID =  req.body.checkbox;
    const listkaName =req.body.listkaName;
    if (listkaName === "Today") {
        Item.findByIdAndRemove(checkedItemID).then(function () {
            console.log("Successfully deleted");
            res.redirect("/");
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        List.findOneAndUpdate({name:listkaName},{$pull:{items:{_id:checkedItemID}}}).then(function () {
            console.log("Successfully deleted");
            res.redirect("/"+listkaName);
        }).catch(function (err) {
            console.log(err);
        });
    }
    
})



// app.get("/work", function(req,res){
//     res.render("lists",{listTitle: "Work List" , newListItems:workItem});
// });
// app.post("/work" , function(req,res){
//     let item = req.body.newItem;
//     workItem.push(item);
//     res.redirect("/work");
// })


app.listen(3000, function(){
    console.log("server is running in port 3000");
})