import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const dropSchema = new mongoose.Schema(
  {
    brand_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Brand'},
    title: {type: String, required: [true, 'Title is required']},
    description: {type: String, required: [true, 'Description is required']},
    cover_image: {type: String, default: ''},
    payout: {type: Number, required: [true, 'Payout is required']},
    start_date: {type: Date, required: [true, 'Start date is required']},
    end_date: {type: Date, required: [true, 'End date is required']},
    deliverables:{ type:mongoose.Schema.Types.ObjectId, ref:'Deliverable'}
  },
  {timestamps: true}
);

dropSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', dropSchema);
