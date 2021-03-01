import pkg from 'mongoose';

const { model, Schema } = pkg;
const userSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  createdAt: String,
});

export default model('User', userSchema);
