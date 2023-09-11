import { expect, test, describe } from 'vitest';
import { regExpUrl } from './utils';

describe('utils', () => {
  test('regExpUrl', () => {
    expect(regExpUrl('https://www.ufec.cn/')).toBe(true);
    expect(regExpUrl('http://www.ufec.cn/')).toBe(true);
    expect(regExpUrl('https://127.0.0.1')).toBe(true);
    expect(
      regExpUrl(
        'http://localhost:3095/uploads/2022/12/16/1671179378963-9456.屏幕截图_20221211_215112.png'
      )
    ).toBe(true);
  });
});
