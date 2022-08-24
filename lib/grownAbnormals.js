// Fixes a bug where patch 115 port causes grown Abnormals and missing abnormals on bosses.
// Written by: Kygas
// Credits: Snug, JKQ

module.exports = function GrownAbnormalsFix(mod) {
	if (mod.majorPatchVersion < 97) return;

	const events = new Map();
	const encounterId = new Set();

	const Ignored_Abnorms = [
		10155020
	];

	mod.hook("S_BOSS_GAGE_INFO", '*', e => {
		if (!encounterId.has(e.id)) encounterId.add(e.id);
	});

	mod.hook("S_LOAD_TOPO", 'raw', () => {
		encounterId.clear();
	});

	mod.hook('S_ABNORMALITY_BEGIN', '*', { order: Infinity, filter: { fake: null } }, e => {
		if (encounterId.has(e.target)) {
			process.nextTick(() => mod.send('S_ABNORMALITY_REFRESH', '*', e));
		}
		events.set(e.target.toString() + e.id, e);
	});

	mod.hook('S_ABNORMALITY_END', '*', { order: Infinity, filter: { fake: null } }, e => {
		events.delete(e.target.toString() + e.id);
	});

	mod.hook('S_ABNORMALITY_REFRESH', '*', { order: Infinity, filter: { fake: null } }, e => {
		if (!encounterId.has(e.target) && !Ignored_Abnorms.includes(e.id) && events.has(e.target.toString() + e.id)) {
			const event = Object.assign(events.get(e.target.toString() + e.id), e);
			mod.send('S_ABNORMALITY_END', '*', event);
			mod.send('S_ABNORMALITY_BEGIN', '*', event);
			return false
		}
	});
}