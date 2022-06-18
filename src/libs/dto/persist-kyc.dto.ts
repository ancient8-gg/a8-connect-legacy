export type GeneralSession = {
  session_id: string;
  sandbox: boolean;
};

export type SessionInfo = {
  status: SessionState;
  alias: string;
  verifiedDate?: number;
} & GeneralSession;

export enum SessionState {
  PENDING = "PENDING",
  FINISHED = "FINISHED",
  VERIFIED = "VERIFIED",
  CANCELLED = "CANCELLED",
}

export type HistoryMessage = {
  review_message: string;
  review_date: string;
};

export enum StepState {
  VALIDATED = "VALIDATED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  NOT_STARTED = "NOT_STARTED",
}
export enum StepName {
  LIVENESS = "LIVENESS",
  IDENTITY = "IDENTITY",
  RESIDENCY = "RESIDENCY",
  PHONE = "PHONE",
}

export type SessionStep = {
  state: StepState;
  name: StepName;
  did_issued: boolean;
  id: string;
  ip: string;
  history: HistoryMessage[];
};

export type DetailSessionInfo = {
  session: SessionInfo;
  steps: SessionStep[];
};

export type SessionInfoRecord = SessionInfo & {
  steps?: SessionStep[];
};
