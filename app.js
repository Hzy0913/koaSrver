const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const fs = require("fs")
const json = require('koa-json')
const jwt = require('jsonwebtoken')
const logger = require('koa-logger')
const cors = require('kcors')
const bodyparser = require('koa-bodyparser')
const {secret, port, verifyPath} = require('./config')

app.use(bodyparser({enableTypes: ['json', 'form', 'text']}))
app.use(cors())
app.use(json())
app.use(logger())

app.use(async (ctx, next) => {
  await next().catch((err) => {
    console.log(err);
    if (err.name === 'JsonWebTokenError') {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message
      };
    } else {
      ctx.status = err.status || 500;
      ctx.body = {error: err.originalError ? err.originalError.message : err.message};
    }
  });
});

app.use( async (ctx, next) => {
  const {URL: {pathname}, headers: {tid}} = ctx.request;
  const isVerify = verifyPath.some(item => {
    if (typeof item === 'string') {
      return item === pathname;
    } else if (typeof item === 'object'){
      return !!pathname.match(item)
    }
    return false;
  });
  console.log(isVerify);
  if (isVerify) {
    let jwtVerify = {};
    try {
      console.log(tid);
      console.log(secret);
      jwtVerify = await jwt.verify(tid, secret);
      console.log(jwtVerify);
    } catch (err) {
      ctx.throw(401, 'JsonWebTokenError', {name: 'JsonWebTokenError'});
    }
    const {id = ''} = jwtVerify;
    if (id) {
      ctx.state = {id}
    }
    await next();
  } else {
    await next();
  }
});


app.use(require('./routes/auth').routes());
app.use(require('./routes/info').routes());

router.get('/', ctx => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./index.html');
});
app.use(router.routes()).use(router.allowedMethods());


// 监听端口启动服务
app.listen(process.env.PORT || port, () => {
  console.log(`应用实例，访问地址为 localhost:${port}`);
});
