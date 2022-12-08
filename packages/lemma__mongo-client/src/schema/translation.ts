import mongoose from 'mongoose';

export const translation = new mongoose.Schema(
  {
    workspaceId: {
      type: Number,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    translations: {
      type: Map,
      of: String,
      required: true,
    },
  },
  {
    optimisticConcurrency: true,
    timestamps: true,
  }
);

translation.index({ workspaceId: 1, key: 1 }, { unique: true });
