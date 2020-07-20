import React, { ComponentClass, Component } from "react";

type RelaxProps = { name: string; sex: number };

type OwnProps = {
  age: number;
};

type Props = RelaxProps & OwnProps;

class A extends Component<Props> {}

type E<T> = Omit<T, keyof RelaxProps>;

function hoc<T>(C: ComponentClass<T>): ComponentClass<E<T>> {
  return class extends Component<E<T>> {
    render() {
      return C as any;
    }
  };
}

const B = hoc(A);

export default () => <B age={12} />;
