const router = require('koa-router')({})
const db = require('../models'); //models

router.prefix('/api');

router.get('/getuser', async (ctx, next) => {
  const output = {
    name: 1,
    user: 1,
  };
  console.log(123123123123);
  const userList = await db.LiveUser.find({}, output);
  console.log(userList);
  ctx.body = {err: 200, userList};
});

router.post('/register', async ctx => {
  const {user, pass} = ctx.request.body;
  console.log(user)
  console.log(pass)
  if (!user && !pass) { ctx.body = {err: 401, message: '未输入注册账号密码'}; return; }
  const hasUser = await db.LiveUser.findOne({user});
  console.log(hasUser);
  if (!hasUser) {
    const userobj = {
      user,
      passworld: pass,
    };
    const save = await new db.LiveUser(userobj).save();
    console.log(save);
    ctx.body = {err: 200, message: '注册成功'};
  }
});

router.get('/test', ctx => {
  ctx.body = {message: '测试消息成功！'}
});

module.exports = router;
