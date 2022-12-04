import mongoose from 'mongoose';
import * as schema from '~/schema';

export const Translation = mongoose.model('Translation', schema.translation);
