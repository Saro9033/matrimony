const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    users: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    chatName:{
        type:String
    },
    latestMessage: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Message'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Chat', chatSchema);
