import mongoose from "mongoose"


const WebSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    url:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    tags:{
        type: Array,
        maxlength: 5
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})
//                    'default-collection-name', schema, desired-collection name
export const WebModel = mongoose.models.website || mongoose.model('website', WebSchema)
