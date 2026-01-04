import { IncomeBand } from '@/types/config';

export const incomeBands: IncomeBand[] = [
  { id: "INCOME_01", label: "500만 원 이하", min: 0, max: 500 },
  { id: "INCOME_02", label: "500만~1,500만", min: 501, max: 1500 },
  { id: "INCOME_03", label: "1,500만~3,000만", min: 1501, max: 3000 },
  { id: "INCOME_04", label: "3,000만~5,000만", min: 3001, max: 5000 },
  { id: "INCOME_05", label: "5,000만~1억", min: 5001, max: 10000 },
  { id: "INCOME_06", label: "1억 이상", min: 10001, max: null }
];

