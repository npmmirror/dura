declare const _default: {
    state: () => {
        /**
         * 姓名
         */
        name: string;
        /**
         * 性别
         */
        sex: "男" | "女";
        /**
         * 年龄
         */
        age: number;
        /**
         * 文本内容
         */
        context: string;
        isShow: boolean;
        isShowDraw: boolean;
    };
    reducers: () => {
        onChangeIsShowDraw(state: {
            /**
             * 姓名
             */
            name: string;
            /**
             * 性别
             */
            sex: "男" | "女";
            /**
             * 年龄
             */
            age: number;
            /**
             * 文本内容
             */
            context: string;
            isShow: boolean;
            isShowDraw: boolean;
        }, payload: {
            isShowDraw: boolean;
        }): void;
        onChangeIsShow(state: {
            /**
             * 姓名
             */
            name: string;
            /**
             * 性别
             */
            sex: "男" | "女";
            /**
             * 年龄
             */
            age: number;
            /**
             * 文本内容
             */
            context: string;
            isShow: boolean;
            isShowDraw: boolean;
        }, payload: {
            nextIsShow: boolean;
        }): void;
        /**
         *
         * @param payload 同步修改姓名
         */
        onChangeName(state: {
            /**
             * 姓名
             */
            name: string;
            /**
             * 性别
             */
            sex: "男" | "女";
            /**
             * 年龄
             */
            age: number;
            /**
             * 文本内容
             */
            context: string;
            isShow: boolean;
            isShowDraw: boolean;
        }, payload: {
            newName: string;
        }): {
            /**
             * 姓名
             */
            name: string;
            /**
             * 性别
             */
            sex: "男" | "女";
            /**
             * 年龄
             */
            age: number;
            /**
             * 文本内容
             */
            context: string;
            isShow: boolean;
            isShowDraw: boolean;
        };
        onChangeContext(state: {
            /**
             * 姓名
             */
            name: string;
            /**
             * 性别
             */
            sex: "男" | "女";
            /**
             * 年龄
             */
            age: number;
            /**
             * 文本内容
             */
            context: string;
            isShow: boolean;
            isShowDraw: boolean;
        }, payload: {
            newContext: string;
        }): {
            /**
             * 姓名
             */
            name: string;
            /**
             * 性别
             */
            sex: "男" | "女";
            /**
             * 年龄
             */
            age: number;
            /**
             * 文本内容
             */
            context: string;
            isShow: boolean;
            isShowDraw: boolean;
        };
    };
    effects: (dispatch: any, getState: any, delay: any) => {
        /**
         * 异步修改姓名
         * @param payload
         */
        onAsyncChangeName(payload: {
            newName: string;
        }, meta: {
            loading: boolean;
        }): Promise<void>;
    };
};
export default _default;
