// 辅助工具用于包裹 async await 方法，捕获异常
export async function errorCaptured(asyncFunc) {
  try {
    const res = await asyncFunc();
    const { code, msg, data } = res;
    // TODO: 这里统一做接口异常处理
    if (code !== 1) {
      consoleError(msg);
    }
    return [null, data];
  } catch (err) {
    consoleError(err);
    return [err, null];
  }
}
