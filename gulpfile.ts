import { parallel, dest, src, watch } from "gulp";
//js压缩就免了
// import GulpUglify = require("gulp-uglify");
//用ts创建项目
import * as ts from "gulp-typescript";
const tsProject = ts.createProject("tsconfig.json");
/**
 * ts项目
 * @returns
 */
export const _ts = (): NodeJS.ReadWriteStream => {
  return src("./src/**/*.ts").pipe(tsProject()).js.pipe(dest("dist"));
};
export const _ts_uni = (): NodeJS.ReadWriteStream => {
  return src("./src/**/*.ts").pipe(tsProject()).js.pipe(dest("./test/cache-uniapp/src/u-cache-ui"));
};
/**
 * vue项目
 * @returns
 */
export const _vue = (): NodeJS.ReadWriteStream => {
  return src("./src/components/**").pipe(dest("dist/components"));
};
export const _vue_uni = (): NodeJS.ReadWriteStream => {
  return src("./src/components/**").pipe(dest("./test/cache-uniapp/src/u-cache-ui/components"));
};

export const _watch = (): void => {
  watch(["./src/**/*.vue"], parallel(_vue));
  watch(["./src/**/*.ts"], parallel(_ts));
};

export const _watch_uni = (): void => {
  watch(["./src/**/*.vue"], parallel(_vue_uni));
  watch(["./src/**/*.ts"], parallel(_ts_uni));
};
export const _state = (): NodeJS.ReadWriteStream => {
  return src(["./package.json", "./README.md", "./src/**/*.ts"]).pipe(dest("./dist"));
};
export const build = parallel(_vue, _ts, _state);

export const testUni = parallel(_watch_uni, _vue_uni, _ts_uni);

export default parallel(_watch, _vue, _ts);
