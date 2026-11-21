import { describe, expect, it } from 'vitest';
import { initials } from './utils';
describe('initials',()=>{it('builds initials from a full name',()=>expect(initials('Kushal Bera')).toBe('KB'));});
