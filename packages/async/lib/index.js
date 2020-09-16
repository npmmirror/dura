"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createAsyncMiddleware=function(e){return function(t){return function(t){return function(r){var n=r.type.split("/"),u=n[0],c=n[1],i=e(u,c);return null==i||i(r),t(r)}}}};
//# sourceMappingURL=index.js.map
