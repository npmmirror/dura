import React from 'react';
import { Api } from '../types';
import { PureComponent } from 'react';
import ts from 'ts-toolbelt';

export function createConnect(api: Api) {
  return function connect(
    mount: boolean,
    mapStateToProps?: ts.F.Function,
    mapSetStateToProps?: ts.F.Function,
    mergeProps?: ts.F.Function,
  ) {
    return function AkConnectComponentCreator(UserComponent) {
      return class AkConnectComponent extends PureComponent {
        unsubscribe: () => void;
        constructor(props) {
          super(props);
          if (mount) {
            api.storeManager.add();
            api.storeManager.refresh();
            this.unsubscribe = api.storeManager.reduxStore.subscribe(() => {
              if (!api.isRefreshing()) {
                this.forceUpdate();
              }
            });
          }
        }

        componentWillUnmount() {
          if (mount) {
            this.unsubscribe();
            api.storeManager.del();
            api.storeManager.refresh();
          }
        }

        render() {
          const stateProps =
            mapStateToProps?.(api.getState()) ?? api.getState();

          const setStateProps = mapSetStateToProps?.(api.setState) ?? {
            setState: api.setState,
          };

          const props = mergeProps?.(stateProps, setStateProps, this.props) ?? {
            ...this.props,
            ...stateProps,
            ...setStateProps,
          };

          return <UserComponent {...props} />;
        }
      };
    };
  };
}
