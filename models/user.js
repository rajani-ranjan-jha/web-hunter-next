import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        // required: true,
        minlength: 6
    },
    image:{
        type: String,
        required: false,

    },
    role: {
        type: String,
        required: true,
        default: 'user'

    }

})
//                    'default-collection-name', schema, desired-collection name
export const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)

