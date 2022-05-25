// Fixes a bug where ngsp silence effect at TSHM 2nd boss and missing hp bar at FIHM 3rd boss
// Written by: icebrog

module.exports = function menmaFix(mod) {
	let boss_data = 7591003,
		boss_abn = 905649,
		boss_id = null
	
	mod.hook('S_SPAWN_NPC', 11, {order: -10000}, event => {
		if (boss_data == Number(`${event.huntingZoneId}${event.templateId}`)) boss_id = event.gameId
	})
	mod.hook('S_DESPAWN_NPC', 3, {order: -10000}, event => {
		if (boss_id == event.gameId) boss_id = null
	})
	mod.hook('S_ACTION_STAGE', 9, {order: -10000}, event => {
		if (boss_id == event.gameId && 1301 == event.skill.id) {
			event.loc.x += Math.cos(event.w) * 2500;
			event.loc.y += Math.sin(event.w) * 2500;
			return true
		}
	})
	mod.hook('S_ABNORMALITY_BEGIN', 4, {order: -10000}, event => {
		if (boss_abn == event.id) return false
	})
}