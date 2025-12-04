export interface ProgressStage {
  label: string;
  progress: number;
  completed?: boolean;
}

export interface StockDiagnosisState {
  stockCode: string;
  stockName: string;
  loading: boolean;
  analyzing: boolean;
  showResult: boolean;
  result: string;
  redirectUrl: string;
  progressStages: ProgressStage[];
}

export interface StockDiagnosisActions {
  setStockCode: (code: string) => void;
  handleDiagnose: () => Promise<void>;
  handleConversion: () => Promise<void>;
  resetDiagnosis: () => void;
}
