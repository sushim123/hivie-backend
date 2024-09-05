import mongoose from 'mongoose';

const {Schema, model} = mongoose;

// Deliverable Schema
const DeliverableSchema = new Schema(
  {
    deliverable_id: {type: String, required: true},
    link: {type: String, required: true}
  },
  {
    toObject: {getters: true, virtuals: false},
    toJSON: {getters: true, virtuals: false}
  }
);

const DropLinkSchema = new Schema({
  drop_id: {type: String, required: true},
  brand_id: {type: String, required: true},
  deliverables: [DeliverableSchema], // Array of deliverables
  user_id: {type: String, required: true},
  registered_at: {type: Date, default: Date.now}
});

export default model('DropLink', DropLinkSchema);
