import { Component } from 'react';
declare const mapState: (state: any, ownProps: any) => {
    item: any;
};
declare type Props = Partial<ReturnType<typeof mapState>> & {
    id: number;
};
declare class Item extends Component<Props> {
    render(): JSX.Element;
}
declare const ItemContainer: import("react-redux").ConnectedComponentClass<typeof Item, any>;
export default ItemContainer;
