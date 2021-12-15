/**
 *
 * 内置一个 Object.is 的 polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function inlineIs(x: any, y: any) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}

export const is: (x: any, y: any) => boolean =
  typeof Object.is === 'function' ? Object.is : inlineIs;
