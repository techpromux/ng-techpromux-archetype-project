export interface LoaderIndicatorStoreModel {
  loading: boolean;

  actives: {
    [id: string]: string;
  };
}
