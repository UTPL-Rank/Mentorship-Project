export * from './academic-area.model';
export * from './academic-degree.model';
export * from './academic-period.model';
export * from './accompaniment.model';
export * from './mentor.model';
export * from './notification.model';
export * from './student.model';
export * from './upload-data.interface';
export * from './user';
export * from './user-claims';

// models to be moved to its own package

export interface SaveMessagingToken {
  username: string;
  token: string;
}
