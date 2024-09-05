import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Schema for Reels
const ReelSchema = new Schema({
  title: { type: String, required: true },
  time_duration: { type: Number, required: true }, // Time in minutes
  description: { type: String }
});

// Schema for Posts
const PostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

// Schema for Deliverables
const DeliverableSchema = new Schema({
  deliverable_type: {
    type: String,
    enum: ['reel', 'post'],
    required: true
  },
  details: {
    type: Schema.Types.Mixed, // Can store either Reel or Post schema
    required: true,
    validate: {
      validator: function (value) {
        if (this.deliverable_type === 'reel') {
          // Validate against Reel schema
          const reelKeys = Object.keys(ReelSchema.obj);
          return reelKeys.every((key) => value[key] != null);
        } else if (this.deliverable_type === 'post') {
          // Validate against Post schema
          const postKeys = Object.keys(PostSchema.obj);
          return postKeys.every((key) => value[key] != null);
        }
        return false;
      },
      message: (props) => `Details do not match the schema for the selected deliverable type: ${props.value}`
    }
  }
}, { _id: false });

// Drop Schema with embedded Deliverables
const DropSchema = new Schema({
  brand_id: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  cover_image: { type: String, default: '' },
  payout: { type: Number, required: [true, 'Payout is required'] },
  start_date: { type: Date, required: [true, 'Start date is required'] },
  end_date: { type: Date, required: [true, 'End date is required'] },
  deliverables: [DeliverableSchema] // Array of embedded deliverables
}, { timestamps: true });

const Drop = model('Drop', DropSchema);

export default Drop;
