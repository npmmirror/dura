import { create, PlusDuraStore, EffectAPI, PlusRootState } from "../../src/index";
import UserModel from "../models/UserModel";

export const initialModel = {
  user: UserModel
};

export type RootState = PlusRootState<typeof initialModel>;

export const store = create(initialModel) as PlusDuraStore<typeof initialModel>;

export const { reducerRunner, effectRunner, selectorRunner } = store;
