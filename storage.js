function normalizeDb(value, setCounts) {
  if (!value || typeof value !== 'object' || !value.sessions || typeof value.sessions !== 'object') return null;
  const sessions = {};
  for (const [id, session] of Object.entries(value.sessions)) {
    if (!session || typeof session !== 'object' || !/^\d{4}-\d{2}-\d{2}_[0-9]+$/.test(id)) continue;
    const plan = Number(session.plan), count = setCounts[plan];
    if (!Number.isInteger(plan) || count === undefined || session.date !== id.slice(0, 10) || !Array.isArray(session.sets)) continue;
    sessions[id] = {
      date: session.date,
      plan,
      sets: Array.from({ length: count.length }, (_, i) => Array.from({ length: count[i] }, (_, j) => {
        const set = session.sets[i]?.[j] || {}, kg = Number(set.kg), reps = Number(set.reps), validKg = set.kg !== '' && Number.isFinite(kg) && kg >= 0 && kg <= 2000 && kg * 2 % 1 === 0, validReps = set.reps !== '' && Number.isInteger(reps) && reps >= 1 && reps <= 1000;
        const rir = Number(set.rir), validRir = set.rir !== '' && Number.isInteger(rir) && rir >= 0 && rir <= 5;
        return { kg: validKg ? String(set.kg) : '', reps: validReps ? String(set.reps) : '', rir: validRir ? String(set.rir) : '', done: set.done === true && validReps };
      })),
      notes: typeof session.notes === 'string' ? session.notes : '',
      finished: session.finished === true
    };
  }
  return { sessions };
}

function mergeDb(current, incoming, replaceConflicts = false) {
  return { sessions: replaceConflicts ? { ...current.sessions, ...incoming.sessions } : { ...incoming.sessions, ...current.sessions } };
}

function exerciseSummary(sets) {
  const done = sets.filter(set => set.done && Number(set.kg) >= 0 && Number(set.reps) > 0);
  if (!done.length) return null;
  return {
    max: Math.max(...done.map(set => Number(set.kg))),
    volume: done.reduce((total, set) => total + Number(set.kg) * Number(set.reps), 0),
    estimated1rm: Math.round(Math.max(...done.map(set => Number(set.kg) * (1 + Number(set.reps) / 30))))
  };
}

function overloadSuggestion(sets, range, category) {
  const done = sets.filter(set => set.done && Number(set.kg) > 0 && Number(set.reps) > 0);
  if (!done.length) return '';
  const top = Number(range.match(/\d+$/)?.[0]), weight = Number(done[0].kg);
  const targetReached = done.every(set => Number(set.reps) >= top && Number(set.kg) === weight), rated = done.filter(set => set.rir !== '' && set.rir !== undefined);
  if (targetReached && rated.some(set => Number(set.rir) < 2)) return `Pertahankan ${weight.toLocaleString('id-ID')} kg; target tercapai tetapi set sudah mendekati batas.`;
  if (targetReached) return `Coba ${(weight + (category === 'Compound' ? 2.5 : 1)).toLocaleString('id-ID')} kg pada sesi berikutnya.`;
  return `Pertahankan ${weight.toLocaleString('id-ID')} kg dan tambah repetisi.`;
}

function scheduledDates(today, count = 12) {
  const date = new Date(today + 'T12:00:00'), dates = [];
  while (dates.length < count) {
    if ([1, 3, 4].includes(date.getDay())) dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    date.setDate(date.getDate() - 1);
  }
  return dates.reverse();
}

if (typeof module !== 'undefined') module.exports = { normalizeDb, mergeDb, exerciseSummary, overloadSuggestion, scheduledDates };
