import { ModelMap } from '@dura/types';
export default function getAsyncMiddleware(rootModel: ModelMap): (store: any) => (next: any) => (action: any) => any;
