import type { Middleware } from "redux";
export interface GetEffects {
    (namespace: string, methodName: string): any;
}
export declare function createAsyncMiddleware(getEffects: GetEffects): Middleware;
