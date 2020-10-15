import Mitt from 'mitt';

export const mitt = Mitt();

export const randomStr = (len = 6): string => {
  const chars = 'ABCDEFGHIJKMLNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const addPxSuffix = (style: Record<string, string | number>): Record<string, string> => {
  const clone = { ...style };
  Object.keys(clone).forEach((key) => {
    if (typeof clone[key] === 'number') {
      clone[key] = `${clone[key]}px`;
    }
  });
  return clone as Record<string, string>;
};

export const getRange = (min: number, max: number, val: number): number => {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
};

export { LineTools } from './LineTools';
