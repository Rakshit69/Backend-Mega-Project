import mongoose,{Schema} from "mongoose";
import { User } from "./User.model";
const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref:User,//who is subscribing t
            
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: User//to whom
        }

    }, {
        timestamps:true,
    }
)
export const Subscription = mongoose.model("Subscription", subscriptionSchema);