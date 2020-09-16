import { useLayoutEffect } from "react";
import { useUpdate } from "./useUpdate";

export function getUseMount(mount, unMount) {
  return function useMount() {
    const update = useUpdate();
    useLayoutEffect(() => {
      mount();
      update();
      return () => {
        unMount();
        update();
      };
    }, []);
  };
}
