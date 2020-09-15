"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var r=e(require("lodash.isplainobject"));function t(e,r,t){Object.defineProperty(e,r,{value:t,enumerable:!0,writable:!1,configurable:!0})}var n=Symbol("@@DURA_SYMBOL"),o=Symbol("@@DURA_PATCHES_SYMBOL"),u=Symbol("@@DURA_STORE_REDUCERS"),a=Symbol("@@DURA_STORE_EFFECTS");function c(){return{}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var i=function(){return(i=Object.assign||function(e){for(var r,t=1,n=arguments.length;t<n;t++)for(var o in r=arguments[t])Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);return e}).apply(this,arguments)};function s(e,r){return void 0===e&&(e={}),void 0===r&&(r={}),i(i({},e),r)}function f(e){return Object.keys(e)}function p(e,r,t){return function(n){return e.dispatch({type:r+"/"+t,payload:n})}}exports.DURA_PATCHES_SYMBOL=o,exports.DURA_STORE_EFFECTS=a,exports.DURA_STORE_REDUCERS=u,exports.DURA_SYMBOL=n,exports.createActionsFactory=function(e){return function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];return r.map((function(r){var t;return(t={})[r.namespace]=f(s(r.reducers,r.effects)).map((function(t){var n;return(n={})[t]=p(e,r.namespace,t),n})).reduce(s,{}),t})).reduce(s,{})}},exports.createDispatch=p,exports.createProxy=function e(u,a,c){return new Proxy(u,{get:function(u,i,s){var f=Reflect.get(u,i,s);if(!u.hasOwnProperty(i))return f;if(i===n||i===o)return f;var p=function(e,r){return e?e+"."+r:""+r}(c,i);if(r.default(f)||Array.isArray(f))return t(f,n,1),e(f,a,p);var l=a.get(p)+1;return isNaN(l)?a.set(p,1):a.set(p,l),f}})},exports.defineHiddenConstantProperty=t,exports.keys=f,exports.merge=s,exports.noop=c;
//# sourceMappingURL=index.js.map
