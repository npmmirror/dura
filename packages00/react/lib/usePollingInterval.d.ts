export interface UsePollingInterval {
  ms?: number;
  pollingWhenHidden?: boolean;
}
export declare function usePollingInterval(
  fn: () => void,
  options?: UsePollingInterval,
): void;
