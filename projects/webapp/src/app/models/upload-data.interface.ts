export interface UploadData<T> {
  isSaving: boolean;

  data: Array<T>;

  save(): Promise<void>;

  readFile(csv: string): Promise<void>;

  transformer(data: Array<string>): Promise<T> | T;
}
