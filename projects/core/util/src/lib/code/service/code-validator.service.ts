/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, isDevMode } from "@angular/core";

@Injectable()
export class CodeValidatorService {

  private __isDevMode: boolean = isDevMode();
  /**
   * Check Multiple Overrided Functions With Call To Super Method
   *
   * @param $this
   * @param fnNames
   */
  public checkFunctionsCallsToSuperMethods(
    $this: any,
    fnNames: string[]
  ): void {
    if (!this.__isDevMode) {
      return;
    }
    fnNames.forEach((fnName: string) => {
      this.checkFunctionCallToSuperMethod($this, fnName);
    });
  }

  /**
   * Check Overrided Function With Call To Super Method
   *
   * @param $this
   * @param fnName
   * @returns
   */
  public checkFunctionCallToSuperMethod(
    $this: any,
    fnName: string
  ): void {
    if (!this.__isDevMode) {
      return;
    }
    const className = $this.constructor.name;

    const classDef = $this.constructor.prototype;

    const fnRef = Reflect.getOwnPropertyDescriptor(classDef, fnName);

    let hasSuperCall = false;

    if (!fnRef) {
      hasSuperCall = true;
    } else {
      const superCallCode = 'super.' + fnName;
      const fnLines = fnRef.value.toString().split('\n');
      fnLines.forEach((line: string) => {
        if (line.trim().startsWith(superCallCode)) {
          hasSuperCall = true;
        }
      });
    }

    if (!hasSuperCall) {
      const error =
        'Class [' + className + '] must call [super.' + fnName + '] correctly.';
      throw new Error(error);
    }
  }
}
