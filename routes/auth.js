const router = require('koa-router')({})
const db = require('../models'); //models
const jwt = require('jsonwebtoken');
const {secret} = require('../config')

router.prefix('/auth');

router.get('/auth', async ctx => {
  if (false) {
    res.json({auth});
    return;
  }
  console.log(ctx)
  console.log(11111)
  ctx.body = {statu: 0};
});

router.post('/login', async ctx => {
  console.log(secret)
  const {user: userName, pass} = ctx.request.body;
  if (!userName && !pass) {
    ctx.body = {err: 401, message: '账号密码未输入'};
    return;
  }
  const output = {
    name: 1,
    user: 1,
    passworld: 1,
  };
  console.log(userName);
  await db.LiveUser.findOne({user: userName}, output, (err, docs) => {
    console.log(err);
    console.log(docs);
    if (err) { ctx.body = {err: 504, message: '服务器错误'}; return; }
    if (!docs) { ctx.body = {err: 401, message: '账号或密码不正确'}; return; }
    if (docs.passworld !== pass) {
      ctx.body = {err: 401, message: '您输入的账号密码不正确'};
    } else {
      //jwt生成token
      const token = jwt.sign({
        name: 'hzy'
      }, secret, {
        expiresIn:  3600//秒到期时间
      });
      const {_id, name, user} = docs;
      const auth = {_id, name, user}
      console.log(docs);
      ctx.body = {token, err: 200, auth, message: '登录成功'};
    }
  });
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

router.get('/test', (req, res, next) => {
  db.MUser.count({}, (err, docs) => {
    res.json({docs});
    console.log(docs);
  });
});

module.exports = router;
