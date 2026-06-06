/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

declare const uniCloud:
  | {
      callFunction(options: { name: string; data?: unknown }): Promise<{ result: unknown }>;
    }
  | undefined;

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, unknown>;
  export default component;
}
