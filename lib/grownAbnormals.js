// Fixes a bug where patch 115 port causes grown Abnormals and missing abnormals on bosses.
// Written by: Kygas
// Credit : Snug

module.exports = function GrownAbnormalsFix(mod) {
	if (mod.majorPatchVersion < 97) return;
	
	let encounterId = []
	mod.hook("S_BOSS_GAGE_INFO", '*', e=>{
		if(!encounterId.includes(e.id)) encounterId.push(e.id)
	})
	
	mod.hook("S_LOAD_TOPO", 'raw', ()=>{
		encounterId = [];
	})
	
	mod.hook('S_ABNORMALITY_BEGIN', '*', { order: Infinity, filter: { fake: null } }, (e) => {
		if ( encounterId.includes(e.target) ) {
			process.nextTick(() => mod.send('S_ABNORMALITY_REFRESH', '*', e))
		}
	})

	mod.hook('S_ABNORMALITY_REFRESH', '*', { order: Infinity, filter: { fake: null } }, (e) => {
		if ( !encounterId.includes(e.target) ) {
			mod.send('S_ABNORMALITY_END', '*', e)
			mod.send('S_ABNORMALITY_BEGIN', '*', e)
			return false
		}
	})	
}