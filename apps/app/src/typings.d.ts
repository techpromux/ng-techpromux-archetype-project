/* eslint-disable @typescript-eslint/no-explicit-any */
/* SystemJS module definition */
declare const module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '!val-loader!*' {
  const contents: any;
  export = contents;
}
