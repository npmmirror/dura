import { useRef, useLayoutEffect } from 'react';
import { compose, combineReducers } from 'redux';
import { createImmerReducer } from './createImmerReducer';

// export function createUseMount(reducersCache, namespace, reduxStore, reducer) {
//   return function useMount() {
//     const mountRef = useRef(mount);
//     const unmountRef = useRef(unmount);

//     function mount() {
//       if (!reducersCache[namespace]) {
//         reducersCache[namespace] = createImmerReducer(options);
//         reduxStore.replaceReducer(
//           compose(reducer, combineReducers(reducersCache)),
//         );
//       }
//     }

//     function unmount() {
//       if (reducersCache[namespace]) {
//         delete reducersCache[namespace];
//         reduxStore.replaceReducer(
//           compose(reducer, combineReducers(reducersCache)),
//         );
//       }
//     }

//     mountRef.current = mount;
//     unmountRef.current = unmount;

//     useLayoutEffect(() => (mountRef.current(), unmountRef.current), [
//       mountRef,
//       unmountRef,
//     ]);
//   };
// }
