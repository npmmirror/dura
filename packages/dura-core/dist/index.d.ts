interface IStore {
    getStoreName: () => string;
}
declare function state(target: any, s: any): void;
declare class Store implements IStore {
    private name;
    getStoreName(): string;
}
