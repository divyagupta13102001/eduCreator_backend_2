const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: { type: String },
    content: {
        type: [{
          public_id: String,
          url: String
        }],
        required: true
      },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tag: { type: String, required: true  },
    createdAt: { type: Date, default: Date.now },
    fileUrls: [String],
    likes:[String],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);


