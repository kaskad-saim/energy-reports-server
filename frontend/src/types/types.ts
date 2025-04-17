export interface DeviceData {
  deviceName?: string;
  port?: string;
  baudRate?: number;
  slaveId?: number;
  error?: string | null;
  p1?: number;
  p2?: number;
  qm1?: number;
  qm2?: number;
  qo1?: number;
  qo2?: number;
  qt1?: number;
  t1?: number;
  t2?: number;
  wt1?: number;
  wpAccumulated?: number;
  wpFlow?: number;
  wtAccumulated?: number;
  wtFlow?: number;
  timestamp?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export type DevicesData = Record<string, DeviceData | undefined>;