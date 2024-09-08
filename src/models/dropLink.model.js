import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const MediaSchema = new Schema({
  id: { type: String, required: true },
  caption: { type: String },
  media_type: { type: String, required: true },
  media_url: { type: String, required: false  },
  thumbnail_url: { type: String },
  permalink: { type: String, required: true },
  timestamp: { type: Date, required: true },
  like_count: { type: Number, required: true },
  comments_count: { type: Number, required: true }
}, { _id: false }); // Prevents auto-creation of an _id for subdocuments

// Deliverable Schema
const DeliverableSchema = new Schema(
  {
    deliverable_id: {type: String, required: true},
    link: {type: String, required: true},
    // thumbnail_url: { type: String },
    media : [ MediaSchema ]
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
