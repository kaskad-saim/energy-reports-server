// Хранилище для текущих данных устройств
const deviceDataStore = {};

export const updateDeviceData = (deviceName, data) => {
  deviceDataStore[deviceName] = data;
};

export const getDeviceData = (deviceName) => {
  return deviceDataStore[deviceName];
};

export const getAllDeviceData = () => {
  return {...deviceDataStore};
};