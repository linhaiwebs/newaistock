export interface StockDiagnosisState {
  stockCode: string;
  stockName: string;
  loading: boolean;
  analyzing: boolean;
  showResult: boolean;
  result: string;
  redirectUrl: string;
}

export interface StockDiagnosisActions {
  setStockCode: (code: string) => void;
  handleDiagnose: () => Promise<void>;
  handleConversion: () => Promise<void>;
  resetDiagnosis: () => void;
}
