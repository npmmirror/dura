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
];

export const createNoopTransform = () => () => [];

export const createValueTransform = (name?: string) => (value) => [
  name
    ? {
        [name]: value,
      }
    : value,
];
