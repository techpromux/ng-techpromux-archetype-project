/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class AbstractStoreState {

    static getStoredDefaultsValue(): any {
        throw new Error('Method must be override!!!');
    }

    static getStoredKeys(prefix: string = ''): string[]{
        throw new Error('Method must be override!!!');
    }

}
