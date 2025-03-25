import mongoose,{ Document, models, Schema } from "mongoose";

// export interface ICategory extends Document{
//     names:string;
//     userId:string|Schema.Types.ObjectId;
//     createdAt?:Date;
//     updatedAt?:Date;
// }

// const categorySchema=new Schema<ICategory>({
//     names:{type:String,required:true},
//     userId:{type:Schema.Types.ObjectId,ref:"User",required:true}
// },{timestamps:true});

export interface ICategory extends Document{
    names:string[];
    userId:string|Schema.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

const categorySchema=new Schema<ICategory>({
    names:{type:[String],required:true},
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true}
},{timestamps:true});

function capitalizeFirstLetter(str:string) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

categorySchema.pre('save', function(next) {
    this.names = this.names.map(name => capitalizeFirstLetter(name));
    next();
});

const Category=models?.Category||mongoose.model<ICategory>("Category",categorySchema);
export default Category;
