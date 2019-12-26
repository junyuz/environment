import axios from "axios";
import apis from "./apis";

const ajax = axios.create({
  baseURL: apis.baseURL,
  timeout: 8000
});

// 配置拦截器

// 登录
export const toLogin = obj => {
  return ajax.post(apis.toLogin, obj);
};
// 地区选择
export const getDistrict = id => {
  return ajax.get(apis.getDistrict, id);
};
// 获取企业信息
export const getEnterprise = id => {
  return ajax.get(apis.getEnterprise, id);
};
// 获取园区信息
export const getPark = id => {
  return ajax.get(apis.getPark, id);
};
// 获取摄像头信息
export const getCamera = id => {
  return ajax.get(apis.getCamera, id);
};
// 获取环保手续
export const getFiles = id => {
  return ajax.get(apis.getFiles, id);
};
// 获取园区公告信息
export const getNotice = id => {
  return ajax.get(apis.getNotice, id);
};
// 获取环境质量监测数据
export const getMonitor = id => {
  return ajax.get(apis.getMonitor, id);
};
// 获取检测报告
export const getReport = id => {
  return ajax.get(apis.getReport, id);
}
// 获取环保设施
export const getFacilities = id => {
  return ajax.get(apis.getFacilities, id);
};
// 获取物联网监测设备
export const getSensor = id => {
  return ajax.get(apis.getSensor, id);
};
