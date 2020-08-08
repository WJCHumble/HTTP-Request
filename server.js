const serve = require("koa-static");
const path = require("path");
const Koa = require("koa");
const cors = require("koa2-cors");
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const router = require("koa-router")();
const app = new Koa();

app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(serve(`${__dirname}/`));
app.use(
  cors({
    origin: function (ctx) {
      //设置允许来自指定域名请求
      return "*"; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);

const token = 1;

app.use(async (ctx, next) => {
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});

async function delay(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, time);
  });
}

router.get("/timeout", async (ctx, next) => {
  await delay(4000);
  ctx.body = {
    data: {
      username: "wjc",
      age: 22,
    },
    code: 1,
    msg: "测试 timeout",
  };
});

router.get("/banner", async (ctx, next) => {
  const { token } = ctx.request.query;
  if (token == 1) {
    ctx.body = {
      data: {},
      code: 401,
      msg: "token 过期",
    };
  } else {
    ctx.body = {
      data: {},
      code: 1,
      msg: "成功",
    };
  }
});

router.get("/banner2", async (ctx, next) => {
  ctx.body = {
    data: [1, 2, 3, 4],
    code: 1,
    msg: "成功",
  };
});

router.get("/userInfo", async (ctx, next) => {
  ctx.body = {
    data: {
      username: "wjc",
      age: 22,
    },
    code: 1,
    msg: "成功",
  };
});

router.get("/updateToken", async (ctx, next) => {
  ctx.body = {
    data: {},
    code: 1,
    msg: "刷新token成功",
  };
});

app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => {
  console.log(`server is running on 3000 port!`);
});
