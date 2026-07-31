// create product model
import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
 images: {
    type: [String],
    required: false,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock'],
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot be more than 5'],
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative'],
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },
  },
}, { timestamps: true });

const Product = model('Product', productSchema);

//create virtual id without underscore
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

export default Product;
