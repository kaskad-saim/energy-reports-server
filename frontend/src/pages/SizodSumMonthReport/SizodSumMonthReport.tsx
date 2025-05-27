// src/pages/SizodSumMonthReport/SizodSumMonthReport.tsx
import { useState, useMemo } from 'react';
import { MonthlyReportItem, CorrectionsMap } from '../../types/reportTypes'; // Удалите CorrectionEntry, если он не используется
import UniversalReportTable from '../../components/UniversalReportTable/UniversalReportTable';
import { useMonthlyReport } from '../../hooks/useMonthlyReport';

const SizodSumMonthReport = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthParam = useMemo(() => {
    return selectedDate
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
      : '';
  }, [selectedDate]);

  // Получаем данные и коррекции для каждого устройства
  const {
    data: k301Data,
    corrections: k301Corrections,
    pendingCorrections: k301PendingCorrections,
    loading: k301Loading,
    error: k301Error,
    updatePendingCorrection: updateK301PendingCorrection,
    saveAllCorrections: saveK301Corrections,
    hasPending: k301HasPending,
  } = useMonthlyReport('k301', monthParam);

  const {
    data: k302Data,
    corrections: k302Corrections,
    pendingCorrections: k302PendingCorrections,
    loading: k302Loading,
    error: k302Error,
    updatePendingCorrection: updateK302PendingCorrection,
    saveAllCorrections: saveK302Corrections,
    hasPending: k302HasPending,
  } = useMonthlyReport('k302', monthParam);

  const loading = k301Loading || k302Loading;
  const error = k301Error || k302Error;

  // Объединяем данные в multiData для UniversalReportTable
  const multiData: Record<string, MonthlyReportItem[]> = useMemo(() => ({
    k301: k301Data,
    k302: k302Data,
  }), [k301Data, k302Data]);

  // Объединяем коррекции и pending коррекции для подсветки и отображения
  const combinedCorrections: CorrectionsMap = {
    ...k301Corrections,
    ...k301PendingCorrections,
    ...k302Corrections,
    ...k302PendingCorrections,
  };

  // Колонки — общий набор, где day — дата, остальные параметры — для отображения
  const columns = useMemo(() => [
    {
      key: 'day',
      label: 'Дата',
      render: (item: MonthlyReportItem) => {
        const date = new Date(item.day);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    { key: 'qt1Diff', label: 'QT1', unit: 'Гкал' },
  ], []);

  // Конфигурация мульти-устройств для UniversalReportTable
  const multiConfig = useMemo(() => ({
    timeColumn: 'day',
    devices: [
      {
        id: 'k301',
        name: 'K301',
        param: 'qt1Diff',
        columnConfig: columns.find((col) => col.key === 'qt1Diff'),
      },
      {
        id: 'k302',
        name: 'K302',
        param: 'qt1Diff',
        columnConfig: columns.find((col) => col.key === 'qt1Diff'),
      },
    ],
  }), [columns]);

  // Обработчик изменения значения в ячейке для мульти-устройств
  const handleCorrectValue = (day: string, field: string, newValue: number, deviceId: string) => {
    const originalEntry = multiData[deviceId]?.find((item: MonthlyReportItem) => item.day === day);
    const originalValue = originalEntry?.[field as keyof typeof originalEntry];
    if (typeof originalValue === 'number') {
      if (deviceId === 'k301') {
        updateK301PendingCorrection(day, field, originalValue, newValue);
      } else if (deviceId === 'k302') {
        updateK302PendingCorrection(day, field, originalValue, newValue);
      }
    }
  };

  // Обработчик сохранения всех коррекций для всех устройств
  const handleSaveCorrections = async () => {
    if (k301HasPending) await saveK301Corrections();
    if (k302HasPending) await saveK302Corrections();
  };

  const hasPendingCorrections = k301HasPending || k302HasPending;

  return (
    <UniversalReportTable<MonthlyReportItem>
      multiData={multiData}
      columns={columns}
      title="Сравнение параметра QT1 (Гкал) (месячный отчет)"
      generatedAt={new Date().toLocaleString()}
      mode="multi-device"
      multiConfig={multiConfig}
      loading={loading}
      error={error}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      isEditable={true}
      onCorrectValue={handleCorrectValue}
      corrections={combinedCorrections}
      hasPendingCorrections={hasPendingCorrections}
      onSaveCorrections={handleSaveCorrections}
      reportType="monthly"
    />
  );
};

export default SizodSumMonthReport;
