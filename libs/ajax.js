import fetch from "@system.fetch";
import Fly from "flyio/dist/npm/hap";
import { refreshToken } from "@/api/";

class HttpRequest {
  constructor(baseUrl = "", timeout = 3000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: this.timeout,
    };
    return config;
  }
  interceptors(instance, options) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        $consoleError(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      async (response) => {
        if (response.data.code === 401) {
          // 请求刷新 token
          await refreshToken();
          // 重新请求此时失败的请求
          return instance.request(options);
        } else {
          return response.data;
        }
      },
      (error) => {
        // TODO: 这里统一处理超时
        if (error.message.includes("timeout")) {
        }

        // TODO: 这里处理网络异常
        if (error.message.includes("Network Error")) {
        }

        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = new Fly(fetch);
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options);
    return instance.request(options);
  }
}

export default HttpRequest;
