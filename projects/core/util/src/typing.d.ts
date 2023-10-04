/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '!val-loader!*' {
  const contents: any;
  export = contents;
}
