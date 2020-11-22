# HTTP-Request

## 介绍

基于 Fly 封装好的 HTTP 请求方法，支持所有 「JavaScript」 运行环境，包括有 PC Web、H5、微信小程序、快应用等。

[Fly 官方文档](https://wendux.github.io/dist/#/language)

## 能力

目前实现了以下几点能力：

1.结合定义好的 `errorCaptured` 统一包裹 `try catch`。

2.超时、网络异常处理。

3.使用 JWT 记录用户登录态情况下，针对 token 过期，触发更新 token 请求，并重新请求

## errorCaptured

调用 `api` 函数的时候统一通过 `errorCaptured` 调用，避免在代码中反复写 `try catch`：

```javascript
export default errorCaptured = async (asyncFun) => {
  try {
    // 这里根据接口实际情况接收数据
    const { code, msg, data } = await asyncFun();
    if (code) {
      console.error(msg);
      return;
    }
    return [null, data];
  } catch (err) {
    console.error(err);
    return [err, null];
  }
};
```

在全局注册 `errorCaptured`，以 `Vue` 为例：

```javascript
import errorCaptured from "errorCaptured";

Vue.prototype.$errorCaptured = errorCaptured;
```

## 使用介绍

`api.js` 中创建 `api`：

**GET 请求**

```javascript
import ajax from "api.ajax.request";

export const getUserInfo = () => {
  return ajax({
    url: "/userInfo",
    params: {
      userId: 1,
    },
    method: "get",
  });
};
```

**POST 请求**

```javascript
export const getUserInfo = () => {
  return ajax({
    url: "/userInfo",
    data: {
      userId: 1,
    },
    method: "post",
  });
};
```

以 `Vue` 为例，在 `created` 中调用：

```javascript
import { getUserInfo } from "api.js"

async created() {
  const [err, data] = await this.$errorCaptured(getUserInfo)
  if (data) {
    // data 存在进行相应的赋值和操作
  }
}
```
