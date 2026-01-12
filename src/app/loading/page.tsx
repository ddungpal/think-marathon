'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/loading/LoadingPage';

/**
 * Loading Page Route
 * Displays while diagnosis is in progress.
 * Redirects to result page when diagnosis is complete.
 */
export default function LoadingRoute() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('님');

  useEffect(() => {
    // Get user name from sessionStorage (set before navigating here)
    const storedInput = sessionStorage.getItem('diagnosisInput');
    if (storedInput) {
      try {
        const input = JSON.parse(storedInput);
        if (input.name) {
          setUserName(input.name);
        }
      } catch (error) {
        console.error('Failed to parse stored input:', error);
      }
    }

    // Check if diagnosis is complete
    const checkDiagnosisComplete = () => {
      const storedResult = sessionStorage.getItem('diagnosisResult');
      if (storedResult) {
        router.push('/result');
      }
    };

    // Check immediately
    checkDiagnosisComplete();

    // Poll every 500ms to check if diagnosis is complete
    const interval = setInterval(checkDiagnosisComplete, 500);

    return () => clearInterval(interval);
  }, [router]);

  return <LoadingPage userName={userName} />;
}

