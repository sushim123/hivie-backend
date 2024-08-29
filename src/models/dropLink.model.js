import mongoose from 'mongoose';

const {Schema, model} = mongoose;

// Deliverable Schema
const DeliverableSchema = new Schema({
  deliverable_id: {type: String, required: true},
  link: {type: String, required: true}
});

const DropLinkSchema = new Schema({
  drop_id: { type: String, required: true },
  brand_id: { type: String, required: true },
  deliverables: [DeliverableSchema], // Array of deliverables
  user_id: { type: String, required: true },
  registered_at: { type: Date, default: Date.now }
});

// Create a unique index to prevent duplicate entries
DropLinkSchema.index({ drop_id: 1, brand_id: 1, user_id: 1 }, { unique: true });

export default model('DropLink', DropLinkSchema);
