/**
 * debug: true
 */
import { user } from './store';

export default function() {
  user.useMount();
  const state = user.useState();
  return (
    <>
      <h1>hello</h1>
      <h1>{state.name}</h1>
    </>
  );
}
