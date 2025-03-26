import mongoose, { Model, Schema } from "mongoose";

export interface IVisit extends Document {
  count: number;
}

const visitSchema:Schema<IVisit> = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Visit:Model<IVisit> = mongoose.model<IVisit>("Visit", visitSchema);

export default Visit;
