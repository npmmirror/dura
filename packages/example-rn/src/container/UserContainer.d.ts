import { Component } from "react";
import { RootState } from "../store";
import { NavigationInjectedProps } from "react-navigation";
declare function mapState(state: RootState): {
    name: string;
    loading: boolean;
};
declare function mapDispatch(dispatch: any): {
    onAsyncChangeName(): void;
    onChangeName(): void;
};
declare class UserContainer extends Component {
    props: Partial<ReturnType<typeof mapState>> & Partial<ReturnType<typeof mapDispatch>> & NavigationInjectedProps;
    render(): JSX.Element;
}
declare const _default;
export default _default;
