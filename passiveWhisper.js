var PassiveWhisper = PassiveWhisper || (function() {
    'use strict';

    let state_name = "PASSIVEWHISPER";
    let script_name = "PassiveWhisper";
    let aliases = new Set(['pw', 'passivewhisper']);
    let helpString = "!pw skillname min msg";
    let ddSkillSet = new Set(
            ['athletics','acrobatics','sleight_of_hand','stealth','arcana','history','investigation','nature','religion','animal_handling','insight','medicine','perception','survival','deception','intimidation','performance','persuasion']
    );
    let handleInput = (msg) => {
        if (msg.type != 'api') return;
        if (!playerIsGM(msg.player)) return;

        let args = msg.content.split(' ');

        // Split the message into command and argument(s)
        let command = args.shift().substring(1);

        if (!command === "pw") return;

        if (args.length < 3) {
            sendChat("", "/w " + msg.who + " " + helpString);
            return;
    	}
        let skill = args.shift();
	    if (!ddSkillSet.has(skill)) {
            sendChat(msg.who, "/w " + msg.who + " skill: " + skill + " not supported.");
            return;
        }

        let threshold = args.shift();
        let message = args.join(" ");

    	// Get players
        let pcs = filterObjs(
            function(obj) {
                if (obj.get('_type') === "character" && obj.get('controlledby')) {
                   return true;
                }
                return false;
        });

        // Message the ones that pass
        for (const pc of pcs) {
            log(pc);

            let attr = getAttrByName(pc.id, skill + "_bonus");
            log(attr);
            let passiveSkill = attr ? attr : 0;
            log(passiveSkill);

            if (passiveSkill + 10  >= threshold) {
                sendChat("", "/w \"" + pc.get("name") + "\" " + message);
            }
        }

    }

    let registerEventHandlers = () => {
        on('chat:message', handleInput);
    };


    function help(player) {
	    sendChat("", "/w " + player + helpString);
    }


    return {
        RegisterEventHandlers: registerEventHandlers
    };

})();

on("ready", () => {
    'use strict';
    PassiveWhisper.RegisterEventHandlers();
});
