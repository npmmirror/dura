import { IConfig, DuraStore } from "./typings";
export default class Dura {
    /**
     * 全局配置
     */
    private config;
    /**
     * 全局models
     */
    private gModels;
    /**
     * 全局的插件
     */
    private gPlugins;
    private duraStore;
    constructor(config: IConfig);
    private extractReducer;
    private mergeReducers;
    private addModel;
    private delModel;
    /**
     * 创建store
     */
    createDuraStore(): DuraStore;
}
