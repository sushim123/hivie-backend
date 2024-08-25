import mongoose from 'mongoose';

const { Schema } = mongoose;

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

// Main Deliverable Schema
const DeliverableSchema = new Schema({
    deliverable_id: { type: String, required: true, unique: true },
    deliverable_type: {
        type: String,
        enum: ['reel', 'post'],
        required: true
    },
    details: {
        type: Schema.Types.Mixed, // Can store either Reel or Post schema
        required: true,
        validate: {
            validator: function(value) {
                if (this.deliverable_type === 'reel') {
                    return ReelSchema.requiredPaths().every(path => value[path]);
                } else if (this.deliverable_type === 'post') {
                    return PostSchema.requiredPaths().every(path => value[path]);
                }
                return false;
            },
            message: props => `${props.value} does not match the schema for the selected deliverable type`
        }
    }
});

const Deliverable = mongoose.model('Deliverable', DeliverableSchema);

export default Deliverable;