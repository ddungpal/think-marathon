import { DiagnoseRequest, DiagnoseResponse } from '@/types/api';

export async function callDiagnoseAPI(input: DiagnoseRequest): Promise<DiagnoseResponse> {
  const response = await fetch('/api/diagnose', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error occurred',
      },
    }));
    throw new Error(errorData.error?.message || 'API call failed');
  }

  return response.json();
}

