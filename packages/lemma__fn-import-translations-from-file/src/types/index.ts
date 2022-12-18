export type Event = {
  payload: {
    workspaceId: number;
    translationsImportAttemptId: number;
    file: {
      type: 'json';
      key: string;
    };
    translations: {
      language: string;
    };
  };
};

export type Result = {};
