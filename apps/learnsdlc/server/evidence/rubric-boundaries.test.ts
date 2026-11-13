import {it,expect} from 'vitest';
import {rubric} from './core';
it('rejects empty, fractional, out-of-range and mismatched/nonpositive rubric weights',()=>{for(const levels of [[],[-1],[4],[1.5]])expect(()=>rubric(levels)).toThrow('Invalid rubric levels');expect(()=>rubric([2,2],[1])).toThrow();expect(()=>rubric([2],[0])).toThrow();expect(()=>rubric([2],[-1])).toThrow();});
