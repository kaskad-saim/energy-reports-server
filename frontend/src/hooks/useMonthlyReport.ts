// hooks/useMonthlyReport.ts

import { useEffect, useState } from 'react';
import { CorrectionsMap, PendingCorrectionsMap } from '../types/reportTypes';

export interface MonthlyReportItem {
  [key: string]: number | string | null | undefined;
  day: string; // формат: "YYYY-MM-DD"
}


const BASE_URL = 'http://localhost:3003';

export const useMonthlyReport = (device: string, month: string) => {
  const [data, setData] = useState<MonthlyReportItem[]>([]);
  const [corrections, setCorrections] = useState<CorrectionsMap>({});
  const [pendingCorrections, setPendingCorrections] = useState<PendingCorrectionsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Очищаем данные при смене месяца
  useEffect(() => {
    setData([]);
  }, [month]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const reportRes = await fetch(`${BASE_URL}/api/reports/${device}-monthly?month=${month}`);
        if (!reportRes.ok) throw new Error('Ошибка загрузки отчета');
        const reportData = await reportRes.json();

        const correctionRes = await fetch(`${BASE_URL}/api/reports/${device}-corrections?month=${month}`);
        const correctionData = await correctionRes.json();

        setData(reportData);
        setCorrections(correctionData.corrections || {});
      } catch {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [device, month]);

  // Добавление в список локальных коррекций
  const updatePendingCorrection = (day: string, field: string, originalValue: number, correctedValue: number) => {
    const key = `${day}-${field}`;
    setPendingCorrections((prev) => ({
      ...prev,
      [key]: { day, field, originalValue, correctedValue },
    }));
  };

  // Сохранение всех коррекций на сервер разом
  const saveAllCorrections = async () => {
    if (Object.keys(pendingCorrections).length === 0) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/reports/save-corrections-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device,
          month,
          corrections: pendingCorrections,
        }),
      });

      if (!res.ok) throw new Error('Ошибка при сохранении');

      // После успешного сохранения, загружаем свежие данные с сервера
      const reportRes = await fetch(`${BASE_URL}/api/reports/${device}-monthly?month=${month}`);
      if (!reportRes.ok) throw new Error('Ошибка загрузки обновленного отчета');
      const reportData = await reportRes.json();

      setData(reportData);
      setCorrections((prev) => ({
        ...prev,
        ...pendingCorrections,
      }));
      setPendingCorrections({});
    } catch (e) {
      console.error('Не удалось сохранить коррекции:', e);
    } finally {
      setLoading(false);
    }
  };

  const hasPending = Object.keys(pendingCorrections).length > 0;

  return {
    data,
    corrections,
    loading,
    error,
    pendingCorrections,
    updatePendingCorrection,
    saveAllCorrections,
    hasPending,
  };
};
