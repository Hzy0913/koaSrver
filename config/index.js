const secret = 'hzy0913secret'; //加密的时候混淆
const port = 7000; //端口
const verifyPath = ['/api/test', /^\/api/]; // 验证token路径

module.exports = {secret, port, verifyPath};
