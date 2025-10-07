const mongoose = require("mongoose");
const { audit } = require("rxjs");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            url: {
                type: String,
                required: false,
            },
            fileId: {
                type: String,
                required: false,
            }
        }
        ,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required'],
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Blog', blogSchema);