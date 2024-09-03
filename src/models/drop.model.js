import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import {v4 as uuidv4} from 'uuid';

const {Schema} = mongoose;

// Schema for Reels
const ReelSchema = new Schema({
  title: {type: String, required: true},
  time_duration: {type: Number, required: true}, // Time in minutes
  description: {type: String}
});

// Schema for Posts
const PostSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true}
});

// Embedded Deliverable Schema
const DeliverableSchema = new Schema({
  deliverable_id: {type: String, required: true, unique: true},
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
          return ReelSchema.requiredPaths().every((path) => value[path] != null);
        } else if (this.deliverable_type === 'post') {
          return PostSchema.requiredPaths().every((path) => value[path] != null);
        }
        return false;
      },
      message: (props) => `Details do not match the schema for the selected deliverable type: ${props.value}`
    }
  }
});

// Drop Schema with embedded Deliverables
const dropSchema = new mongoose.Schema(
  {
    drop_id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4() // Generates a unique identifier using UUID
    },
    brand_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true},
    title: {type: String, required: [true, 'Title is required']},
    description: {type: String, required: [true, 'Description is required']},
    cover_image: {type: String, default: ''},
    payout: {type: Number, required: [true, 'Payout is required']},
    start_date: {type: Date, required: [true, 'Start date is required']},
    end_date: {type: Date, required: [true, 'End date is required']},
    deliverables: [DeliverableSchema] // Array of embedded deliverables
  },
  {timestamps: true}
);

dropSchema.plugin(mongooseAggregatePaginate);

export const Drop = mongoose.model('Drop', dropSchema);