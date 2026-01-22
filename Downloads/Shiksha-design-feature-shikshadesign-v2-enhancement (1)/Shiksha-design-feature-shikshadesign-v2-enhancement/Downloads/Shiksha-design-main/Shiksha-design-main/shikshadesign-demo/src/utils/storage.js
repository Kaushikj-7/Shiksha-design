// LocalStorage utility for ShikshaDesign - Maps UI to LFA Data Model

import { LFA_DATA_MODEL } from '../core/lfa-data-model';

const STORAGE_KEY = 'shikshadesign_lfa';

// Initialize with LFA data model structure
const getDefaultData = () => structuredClone(LFA_DATA_MODEL);

export const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultData();
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return getDefaultData();
  }
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const updateField = (path, value) => {
  const data = getStoredData();
  const keys = path.split('.');
  let current = data;
  
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  saveStoredData(data);
  return data;
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
