import mongoose from 'mongoose'

export default mongoose.model('Notes', 
new mongoose.Schema({
  title: String,
  contents: String,
  time: { type: Date, default: Date.now }
}))