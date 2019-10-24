declare const _default: {
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
        /**
         * 更改item选项
         * @param state
         * @param payload
         */
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
export default _default;
