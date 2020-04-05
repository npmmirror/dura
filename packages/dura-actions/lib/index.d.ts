declare function createActions(models: any): {
    [x: number]: {
        [x: string]: (payload: any, meta: any) => {
            type: string;
            payload: any;
            meta: any;
        };
    };
};
export { createActions };
