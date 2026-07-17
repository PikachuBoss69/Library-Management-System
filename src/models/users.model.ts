import {ObjectId, Schema, model, Model} from "mongoose";
import bcrypt from "bcrypt";


interface IUser {

    rollNumber: string;

    password: string;

    role: "student" | "librarian" | "admin";

    isEmailVerified: boolean;

    isPhoneVerified: boolean;

    isFirstLogin: boolean;

    createdAt: Date;

    updatedAt: Date;

}

interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}


interface IUserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, IUserModel, IUserMethods>({
    
    rollNumber : {
        type: String,
        required:[true,"Enter Roll Number to Continue"],
        unique:[true,"User Already Exist"],
        trim : true
    },

    password:{
        type:String,
        required: true,
        select : false
       
    },

    role : {
        type : String,
        enum : ["student", "librarian", "admin"], 
        default : "student",
        required : true
    },

    isEmailVerified : {
        type : Boolean,
        required : true,
        default : false
    },

    isPhoneVerified : {
        type : Boolean,
        required : true,
        default : false
    },

    isFirstLogin : {
        type : Boolean,
        required : true,
        default : true
    },

},{
    timestamps : true
})

userSchema.pre("save", async function(): Promise<void> {
    if (!this.isModified("password")) {
        return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {

    return await bcrypt.compare(password, this.password)

}


export const userModel = model<IUser, IUserModel>(
    "UserRegistry",
    userSchema
);