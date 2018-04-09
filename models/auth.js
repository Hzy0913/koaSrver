const mongoose = require('mongoose');

const {Schema} = mongoose;

// mongoose.Promise = require('bluebird');
//  用户对象模型
const userSchema = new Schema({
  name: {
    type: String,
    default: Date.now
  },
  avatar: String,
  user: String, //绑定邮箱
  passworld: String, //密码
  hash: String, //签名
  score: Number, //积分
  isregister: Boolean, //是否注册成功
});

//  聊天对象模型
const dialogueSchema = new Schema({
  content: String,
  starttime: Date,
});


const auth = {
  LiveUser: mongoose.model('LiveUser', userSchema),
  Dialogue: mongoose.model('Dialogue', dialogueSchema),
};
module.exports = auth;
