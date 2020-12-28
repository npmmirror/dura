//React.ChangeEventHandler<T>
export const createEventTransform = <
  T extends HTMLInputElement = HTMLInputElement
>(
  name?: string,
): React.ChangeEventHandler<T> => (e) => [
  name
    ? {
        [name]: e.target.value,
      }
    : e.target.value,
  undefined,
];

export const createNoopTransform = () => (): void =>
  [undefined, undefined] as any;

export const createValueTransform = (name?: string) => <T>(value: T) => [
  name
    ? {
        [name]: value,
      }
    : value,
];
