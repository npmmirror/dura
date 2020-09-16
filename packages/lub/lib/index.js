#!/usr/bin/env node
"use strict";var e=require("rollup"),t=require("commander"),n=require("rollup-plugin-terser"),r=require("rollup-plugin-typescript2");function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var u=o(e),i=o(r),c=function(){return(c=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function a(e,t,n,r){return new(n||(n=Promise))((function(o,u){function i(e){try{a(r.next(e))}catch(e){u(e)}}function c(e){try{a(r.throw(e))}catch(e){u(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}a((r=r.apply(e,t||[])).next())}))}function l(e,t){var n,r,o,u,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return u={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function c(u){return function(c){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(o=2&u[0]?r.return:u[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,u[1])).done)return o;switch(r=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return i.label++,{value:u[1],done:!1};case 5:i.label++,r=u[1],u=[0];continue;case 7:u=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==u[0]&&2!==u[0])){i=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){i.label=u[1];break}if(6===u[0]&&i.label<o[1]){i.label=o[1],o=u;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(u);break}o[2]&&i.ops.pop(),i.trys.pop();continue}u=t.call(e,i)}catch(e){u=[6,e],r=0}finally{n=o=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,c])}}}require(process.cwd()+"/lub.config.js");var s=function(){return{input:process.cwd()+"/src/index.ts",plugins:[i.default(),n.terser()]}},f=function(e,t){return{file:process.cwd()+"/"+e+"/index.js",format:t,name:"duraStat",sourcemap:!0,external:[],globals:{}}},p=c(c({},s()),{output:[f("lib","cjs")]});t.program.version(require("../package.json").version,"-v, --version","output the current version").description("a build tools for dura!").command(" build"," build js lib ",{isDefault:!0}).option("-w --watch","enable watch").action((function(e){e.watch?function(){a(this,void 0,void 0,(function(){return l(this,(function(e){return u.default.watch(p).on("event",(function(e){console.log("watcher--\x3e",e.code)})),[2]}))}))}():function(){a(this,void 0,void 0,(function(){var e;return l(this,(function(t){switch(t.label){case 0:return[4,u.default.rollup(s())];case 1:return[4,(e=t.sent()).generate(f("test","cjs"))];case 2:return t.sent(),[4,e.write(f("test","cjs"))];case 3:return t.sent(),[2]}}))}))}()})).parse(process.argv);
