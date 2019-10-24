import React from 'react';
/**
 * {
      answer: {
        orderNo: {
          projectName: ''
        }
      }
    }
 */
interface State {
}
interface Props {
    answer?: {
        orderNo?: {
            projectName?: string;
        };
    };
}
declare class Hello extends React.Component<State, Props> {
    constructor(props: any);
    componentWillMount(): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof Hello, Pick<State, never>>;
export default _default;
