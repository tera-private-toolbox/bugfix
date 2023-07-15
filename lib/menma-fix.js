// 1) Fixes a bug where ngsp silence effect at TSHM 2nd boss and missing hp bar at FIHM 3rd boss.
// 2) Fixes a problem with attackSpeed and attackSpeedBonus when ngsp is used on Menma's TERA.
// Written by: icebrog, Serth

const path = require("path");
const { listModuleInfos } = require("tera-mod-management");
const ModuleFolder = path.join(__dirname, "..", "..");

module.exports = function menmaFix(mod) {
	const speedDivider = [120, 100, 110, 90, 110, 120, 105, 105, 100, 100, 100, 100, 100];
	let job = null;
	let boss_data = 7591003;
	let boss_abn = 905649;
	let boss_id = null

	mod.hook('S_ABNORMALITY_BEGIN', 4, { order: -10000 }, event => {
		if (boss_abn == event.id) return false
	});

	if (!mod.connection.metadata.serverList[mod.serverId].name.includes("MT")) return;

	// 1)

	mod.hook('S_SPAWN_NPC', 11, { order: -10000 }, event => {
		if (boss_data == Number(`${event.huntingZoneId}${event.templateId}`)) boss_id = event.gameId;
	});
	mod.hook('S_DESPAWN_NPC', 3, { order: -10000 }, event => {
		if (boss_id == event.gameId) boss_id = null;
	});
	mod.hook('S_ACTION_STAGE', 9, { order: -10000 }, event => {
		if (boss_id == event.gameId && 1301 == event.skill.id) {
			event.loc.x += Math.cos(event.w) * 2500;
			event.loc.y += Math.sin(event.w) * 2500;
			return true
		}
	});

	// 2)

	if (listModuleInfos(ModuleFolder).filter(m => m.disabled !== true && m.name.includes("ngsp")).length === 0) return;

	mod.hook('S_LOGIN', 14, { order: -Infinity, filter: { fake: null } }, event => {
		job = (event.templateId % 100 - 1);
	});
	mod.hook('S_PLAYER_STAT_UPDATE', 14, { order: -Infinity, filter: { fake: null } }, event => {
		const totalSpeed = event.attackSpeed + event.attackSpeedBonus;
		event.attackSpeed = speedDivider[job];
		event.attackSpeedBonus = totalSpeed - speedDivider[job];
		return true;
	});
}