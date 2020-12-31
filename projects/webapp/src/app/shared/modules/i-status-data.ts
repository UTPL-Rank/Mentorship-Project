type StatusCodes =
  | 'LOADING'
  | 'ERROR'
  | 'READY';


interface BaseIStatusData<T> {
  status: StatusCodes;
  data?: T | null;
}

interface IReadyStatusData<T> extends BaseIStatusData<T> {
  status: 'READY';
  data: T | null;
}

interface IErrorStatusData<T> extends Exclude<BaseIStatusData<T>, undefined> {
  status: 'ERROR';
}

interface ILoadingStatusData<T> extends Exclude<BaseIStatusData<T>, undefined> {
  status: 'LOADING';
}

export type IStatusData<T> =
  | IErrorStatusData<T>
  | IReadyStatusData<T>
  | ILoadingStatusData<T>;
