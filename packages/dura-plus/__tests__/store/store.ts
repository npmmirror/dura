import { create , PlusDuraStore ,EffectAPI ,  PlusRootState } from '../../src/index'
import UserModel from '../models/UserModel'

export const initialModel = {
    user:UserModel
}


export type RootState = PlusRootState<typeof initialModel>

const store  = create(initialModel)