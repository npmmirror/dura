export const createEventTransform = <
  T extends HTMLInputElement = HTMLInputElement
>(
  name?: string,
): React.ChangeEventHandler<T> => (e) => {
  return {
    payload: { [name ?? 'value']: e.target.value },
    meta: undefined,
  };
};

export const createNoopTransform = () => (): void =>
  [undefined, undefined] as any;

export const createValueTransform = (name?: string) => <T>(value: T) => [
  {
    [name ?? 'value']: value,
  },
  undefined,
];
