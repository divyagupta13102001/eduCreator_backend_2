const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: { type: String },
    content: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tag: { type: String, required: true  },
    createdAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);


