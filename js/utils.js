// @flow

export type Vector = [number, number]; // each up to 3 digits
export type Color = [number, number, number, number]; // each up to 255

export const rand = (int: number): number => Math.random() * int | 0;
export const pI = (val: string): number => parseInt(val, 10);
export function leftPad(val: string | number, length: number): string {
  val += '';
  let padding = length - val.length;
  while (padding--) val = `0${val}`;
  return val;
}
