import { useEffect, useState } from 'react';
import { HourlyReportItem } from '../types/reportTypes';

const BASE_URL = 'http://localhost:3002';

export const useHourlyReportByUrl = (relativePath: string) => {
  const [data, setData] = useState<HourlyReportItem[]>([]);
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
        console.error('Ошибка при получении отчета:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [relativePath]); 

  return { data, loading, error };
};