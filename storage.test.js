const assert = require('node:assert/strict');
const { normalizeDb, mergeDb, exerciseSummary, overloadSuggestion, activitySummary } = require('./storage.js');

const valid = { sessions: { '2026-10-07_0': { date: '2026-10-07', plan: 0, sets: [[{ kg: '50', reps: '8', done: true }]], notes: 'lama', finished: true } } };
const normalized = normalizeDb(valid, [[1]]);
assert.equal(normalized.sessions['2026-10-07_0'].notes, 'lama');
assert.equal(normalized.sessions['2026-10-07_0'].sets[0][0].kg, '50');
assert.equal(normalized.sessions['2026-10-07_0'].sets[0][0].rir, '');
const dirty = normalizeDb({ sessions: { '2026-10-07_0': { date: '2026-10-07', plan: 0, sets: [[{ kg: '-1', reps: 'NaN', done: true }, { kg: '2001', reps: '1001', done: true }]] } } }, [[2]]);
assert.deepEqual(dirty.sessions['2026-10-07_0'].sets[0], [{ kg: '', reps: '', rir: '', done: false }, { kg: '', reps: '', rir: '', done: false }]);
assert.deepEqual(normalizeDb({ sessions: { rusak: { plan: 99 } } }, [1]), { sessions: {} });
assert.equal(normalizeDb(null, [1]), null);

const current = { sessions: { a: { notes: 'current' } } };
const incoming = { sessions: { a: { notes: 'import' }, b: { notes: 'baru' } } };
assert.deepEqual(mergeDb(current, incoming), { sessions: { a: { notes: 'current' }, b: { notes: 'baru' } } });
assert.deepEqual(mergeDb(current, incoming, true), { sessions: { a: { notes: 'import' }, b: { notes: 'baru' } } });
assert.deepEqual(exerciseSummary([{ kg: '50', reps: '8', done: true }, { kg: '55', reps: '6', done: true }, { kg: '60', reps: '', done: false }]), { max: 55, volume: 730, estimated1rm: 66 });
assert.equal(exerciseSummary([]), null);
assert.equal(overloadSuggestion([{ kg: '50', reps: '10', done: true }, { kg: '50', reps: '10', done: true }], '6–10', 'Compound'), 'Coba 52,5 kg pada sesi berikutnya.');
assert.equal(overloadSuggestion([{ kg: '50', reps: '8', done: true }], '6–10', 'Compound'), 'Pertahankan 50 kg dan tambah repetisi.');
assert.equal(overloadSuggestion([{ kg: '50', reps: '10', done: true, rir: '1' }], '6–10', 'Compound'), 'Pertahankan 50 kg; target tercapai tetapi set sudah mendekati batas.');
assert.equal(overloadSuggestion([{ kg: '50', reps: '10', done: true, rir: '2' }], '6–10', 'Compound'), 'Coba 52,5 kg pada sesi berikutnya.');
assert.deepEqual(activitySummary([{ date: '2026-10-01', finished: true }, { date: '2026-10-01', finished: true }, { date: '2026-10-07', finished: true }, { date: '2026-09-01', finished: true }], '2026-10-07'), { sessions: 3, activeDays: 2, activeWeeks: 2 });
console.log('storage checks passed');
