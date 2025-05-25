import { useEffect, useState } from 'react';
import { MonthlyReportItem } from '../types/reportTypes';

const BASE_URL = 'http://localhost:3003';

export const useMonthlyReportByUrl = (relativePath: string) => {
  const [data, setData] = useState<MonthlyReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const fullPath = `${BASE_URL}${relativePath}`;

      try {
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error(`Ошибка сети: ${response.statusText}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Ошибка при получении месячного отчета:', err);
        setError('Не удалось загрузить данные месячного отчета');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [relativePath]);

  return { data, loading, error };
};
