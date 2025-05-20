import { useEffect, useState } from 'react';
import { HourlyReportItem } from '../types/reportTypes';

export const useHourlyReportByUrl = (url: string) => {
  const [data, setData] = useState<HourlyReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сети');
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
  }, [url]);

  return { data, loading, error };
};