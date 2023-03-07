import mongoose from 'mongoose';
const {Schema} = mongoose;
mongoose.set('strictQuery', false);

const itemSchema = new Schema({    
    name: String,
});
const Item = mongoose.model('Item', itemSchema);

const listSchema = new Schema({
    name: String,
    items: [itemSchema],
})
const List = mongoose.model('List', listSchema);
export {Item, List};