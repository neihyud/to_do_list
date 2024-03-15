const mongoose = require('mongoose');

const {Schema} = mongoose;

const TaskSchema = new Schema(
    {
      user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Account',
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    {
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
        },
      },
    },
);

module.exports = mongoose.model('Task', TaskSchema);
