/* eslint-disable @typescript-eslint/no-explicit-any */
export class DotEnvVarsParserService {
  public static getVars<T>(
    dotEnvVarsToken: string,
    appName: string,
    environmentName: string
  ): T {
    const appPrefix = appName.toLocaleUpperCase() + '__';

    const environmentPrefix = environmentName.toLocaleUpperCase() + '__';

    const prefixes = [
      '__' + '__',
      '__' + environmentPrefix,
      appPrefix + '__',
      appPrefix + environmentPrefix,
    ];

    const allEnvVars = JSON.parse(atob(dotEnvVarsToken));

    const allEnvKeys = Object.keys(allEnvVars);

    const appVars: any = {};

    prefixes.forEach((prefix: string) => {
      allEnvKeys
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.substring(prefix.length))
        .forEach((key: string) => {
          if (
            (allEnvVars[prefix + key] as string).toLowerCase() === 'true' ||
            (allEnvVars[prefix + key] as string).toLowerCase() === 'false'
          ) {
            appVars[key] =
              (allEnvVars[prefix + key] as string).toLowerCase() === 'true';
          } else {
            const numericRepr = parseFloat(allEnvVars[prefix + key]);
            if (
              !(
                isNaN(numericRepr) ||
                numericRepr.toString().length !=
                  (allEnvVars[prefix + key] as string).length
              )
            ) {
              if (Number.isInteger(numericRepr)) {
                appVars[key] = Number.parseInt(allEnvVars[prefix + key]);
              } else {
                appVars[key] = Number.parseFloat(allEnvVars[prefix + key]);
              }
            } else {
              appVars[key] = allEnvVars[prefix + key];
            }
          }
        });
    });

    return this.sortObject(appVars) as T;
  }

  private static sortObject(obj: any): any {
    return Object.keys(obj)
      .sort()
      .reduce((arr: any, key: any) => {
        arr[key] = obj[key];
        return arr;
      }, {});
  }
}
