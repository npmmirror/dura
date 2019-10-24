import { ExtractState } from '@dura/plus';
import { ExtractLoadingState } from '@dura/loading';
declare const initialModel: {
    /**
     * 用户模块
     */
    user: any;
    /**
     * hello 模块， 主要处理一些乱七八糟的问题
     */
    hello: {
        state: () => {
            name: string;
            userList: any[];
            articleList: {
                id: number;
                title: string;
                context: string;
            }[];
        };
        reducers: () => {
            onChangeName(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                nextName: string;
            }): void;
            onChangeItem(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                id: number;
                title: string;
            }): void;
            onChangeUserList(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                userList: any[];
            }): void;
        };
        effects: (dispatch: any, getState: any, delay: any) => {
            onAsyncQueryUserList(payload: any, meta: {
                success: () => void;
            }): Promise<void>;
        };
    };
};
export declare type RootModel = typeof initialModel;
export declare type RootState = ExtractState<RootModel> & ExtractLoadingState<RootModel>;
export declare const store: import("../../dura-plus/lib").Store<{
    /**
     * 用户模块
     */
    user: any;
    /**
     * hello 模块， 主要处理一些乱七八糟的问题
     */
    hello: {
        state: () => {
            name: string;
            userList: any[];
            articleList: {
                id: number;
                title: string;
                context: string;
            }[];
        };
        reducers: () => {
            onChangeName(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                nextName: string;
            }): void;
            onChangeItem(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                id: number;
                title: string;
            }): void;
            onChangeUserList(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                userList: any[];
            }): void;
        };
        effects: (dispatch: any, getState: any, delay: any) => {
            onAsyncQueryUserList(payload: any, meta: {
                success: () => void;
            }): Promise<void>;
        };
    };
} & import("../../dura-plus/lib").ModelMap>;
export declare const actionCreator: import("../../dura-plus/lib").ExtractActions<{
    /**
     * 用户模块
     */
    user: any;
    /**
     * hello 模块， 主要处理一些乱七八糟的问题
     */
    hello: {
        state: () => {
            name: string;
            userList: any[];
            articleList: {
                id: number;
                title: string;
                context: string;
            }[];
        };
        reducers: () => {
            onChangeName(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                nextName: string;
            }): void;
            onChangeItem(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                id: number;
                title: string;
            }): void;
            onChangeUserList(state: {
                name: string;
                userList: any[];
                articleList: {
                    id: number;
                    title: string;
                    context: string;
                }[];
            }, payload: {
                userList: any[];
            }): void;
        };
        effects: (dispatch: any, getState: any, delay: any) => {
            onAsyncQueryUserList(payload: any, meta: {
                success: () => void;
            }): Promise<void>;
        };
    };
}>;
export declare const connectHOC: (mapState: any, mapDispatch: any) => import("react-redux").InferableComponentEnhancerWithProps<any, any>;
export {};
