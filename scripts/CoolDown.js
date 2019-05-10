///////////////////Cooldown by KAT PURPY///////////////////
function constructor(cooldownTime) {
	let c = {
		ListOfUsers : {},
		CoolDown : cooldownTime,
		SetupCoolDown : (seconds) => {
			c.CoolDown=seconds;
		},
		UserAction : (id) => {
			if(c.ListOfUsers[id] === undefined || c.IsCooldownPassed(id)){
				c.ListOfUsers[id] = c.CalculateCoolDown();
				return -1;
			}
			return c.HowMuchTime2Wait(id);
		},
		IsCooldownPassed : (id) => {
			var PlayerCooldown = c.ListOfUsers[id];
			var Time = new Date();
			var PASS = c.CompareDates(Time,PlayerCooldown);
			return PASS;
		},
		CalculateCoolDown : () => {
			var d = new Date();
			d.setSeconds(d.getSeconds() + c.CoolDown);
			return d;
		},
		HowMuchTime2Wait : (id) => {
			return Math.round((c.ListOfUsers[id] - new Date()) / 1000);
		},
		CompareDates : (Date1,Date2) => {
	
			return Date1 > Date2;
		}
	};
	return c;
}

module.exports = constructor;
