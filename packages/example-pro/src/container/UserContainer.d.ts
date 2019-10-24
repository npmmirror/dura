import { Component } from 'react';
import { RootState } from '@store';
declare function mapState(state: RootState): {
    name: any;
    loading: any;
};
declare function mapDispatch(dispatch: any): {
    onAsyncChangeName(newName: string): void;
    onChangeName(newName: string): void;
};
declare class UserContainer extends Component {
    props: Partial<ReturnType<typeof mapState>> & Partial<ReturnType<typeof mapDispatch>>;
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof UserContainer, Pick<{}, never>>;
export default _default;
