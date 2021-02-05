import { DarkHeresyActor } from "./actor.js";
import { DarkHeresyItem } from "./item.js";
import { AcolyteSheet } from "../sheet/actor/acolyte.js";
import { NpcSheet } from "../sheet/actor/npc.js";
import { PlayerShipSheet } from "../sheet/actor/playership.js";
import { NPCShipSheet } from "../sheet/actor/npcship.js";
import { WeaponSheet } from "../sheet/weapon.js";
import { AmmunitionSheet } from "../sheet/ammunition.js";
import { WeaponModificationSheet } from "../sheet/weapon-modification.js";
import { ArmourSheet } from "../sheet/armour.js";
import { ForceFieldSheet } from "../sheet/force-field.js";
import { CyberneticSheet } from "../sheet/cybernetic.js";
import { ShipHullSheet } from "../sheet/shipHull.js";
import { ShipComponentSheet } from "../sheet/shipComponent.js";
import { ShipQuirkSheet } from "../sheet/shipQuirk.js";
import { DrugSheet } from "../sheet/drug.js";
import { GearSheet } from "../sheet/gear.js";
import { ToolSheet } from "../sheet/tool.js";
import { CriticalInjurySheet } from "../sheet/critical-injury.js";
import { MalignancySheet } from "../sheet/malignancy.js";
import { MentalDisorderSheet } from "../sheet/mental-disorder.js";
import { MutationSheet } from "../sheet/mutation.js";
import { PsychicPowerSheet } from "../sheet/psychic-power.js";
import { TalentSheet } from "../sheet/talent.js";
import { SpecialAbilitySheet } from "../sheet/special-ability.js";
import { TraitSheet } from "../sheet/trait.js";
import { AptitudeSheet } from "../sheet/aptitude.js";
import { initializeHandlebars } from "./handlebars.js";
import { migrateWorld } from "./migration.js";
import { prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll } from "./dialog.js";
import { commonRoll, combatRoll } from "./roll.js";

Hooks.once("init", () => {
    CONFIG.Combat.initiative = { formula: "@initiative.base + @initiative.bonus", decimals: 0 };
    CONFIG.Actor.entityClass = DarkHeresyActor;
    CONFIG.Item.entityClass = DarkHeresyItem;
    CONFIG.fontFamilies.push("Caslon Antique");
    game.darkHeresy = {
        prepareCommonRoll,
        prepareCombatRoll,
        preparePsychicPowerRoll,
        commonRoll,
        combatRoll
    };
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("rogue-trader", AcolyteSheet, { types: ["acolyte"], makeDefault: true });
    Actors.registerSheet("rogue-trader", NpcSheet, { types: ["npc"], makeDefault: true });
    Actors.registerSheet("rogue-trader", PlayerShipSheet, { types: ["playership"], makeDefault: true });
    Actors.registerSheet("rogue-trader", NPCShipSheet, { types: ["npcship"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("rogue-trader", WeaponSheet, { types: ["weapon"], makeDefault: true });
    Items.registerSheet("rogue-trader", AmmunitionSheet, { types: ["ammunition"], makeDefault: true });
    Items.registerSheet("rogue-trader", WeaponModificationSheet, { types: ["weaponModification"], makeDefault: true });
    Items.registerSheet("rogue-trader", ArmourSheet, { types: ["armour"], makeDefault: true });
    Items.registerSheet("rogue-trader", ForceFieldSheet, { types: ["forceField"], makeDefault: true });
    Items.registerSheet("rogue-trader", CyberneticSheet, { types: ["cybernetic"], makeDefault: true });
    Items.registerSheet("rogue-trader", DrugSheet, { types: ["drug"], makeDefault: true });
    Items.registerSheet("rogue-trader", GearSheet, { types: ["gear"], makeDefault: true });
    Items.registerSheet("rogue-trader", ToolSheet, { types: ["tool"], makeDefault: true });
    Items.registerSheet("rogue-trader", ShipHullSheet, { types: ["shipHull"], makeDefault: true });
    Items.registerSheet("rogue-trader", ShipComponentSheet, { types: ["shipComponent"], makeDefault: true });
    Items.registerSheet("rogue-trader", ShipQuirkSheet, { types: ["shipQuirk"], makeDefault: true });
    Items.registerSheet("rogue-trader", CriticalInjurySheet, { types: ["criticalInjury"], makeDefault: true });
    Items.registerSheet("rogue-trader", MalignancySheet, { types: ["malignancy"], makeDefault: true });
    Items.registerSheet("rogue-trader", MentalDisorderSheet, { types: ["mentalDisorder"], makeDefault: true });
    Items.registerSheet("rogue-trader", MutationSheet, { types: ["mutation"], makeDefault: true });
    Items.registerSheet("rogue-trader", PsychicPowerSheet, { types: ["psychicPower"], makeDefault: true });
    Items.registerSheet("rogue-trader", TalentSheet, { types: ["talent"], makeDefault: true });
    Items.registerSheet("rogue-trader", SpecialAbilitySheet, { types: ["specialAbility"], makeDefault: true });
    Items.registerSheet("rogue-trader", TraitSheet, { types: ["trait"], makeDefault: true });
    Items.registerSheet("rogue-trader", AptitudeSheet, { types: ["aptitude"], makeDefault: true });
    initializeHandlebars();
    game.settings.register("rogue-trader", "worldSchemaVersion", {
        name: "World Version",
        hint: "Used to automatically upgrade worlds data when the system is upgraded.",
        scope: "world",
        config: true,
        default: 0,
        type: Number,
    });
});

Hooks.once("ready", () => {
    migrateWorld();
});

Hooks.on("preCreateItem", (createData) => {
    if (createData.type === "shipHull") {
        mergeObject(createData, {
            "img": "systems/rogue-trader/asset/icons/ship/shipHull.png"
        });
    }
    else if(createData.type === "shipComponent") {
        mergeObject(createData, {
            "img": "systems/rogue-trader/asset/icons/ship/shipComponent.png"
        });
    }
    else if(createData.type === "shipQuirk") {
        mergeObject(createData, {
            "img": "systems/rogue-trader/asset/icons/ship/shipQuirk.png"
        });
    }
});

Hooks.on("preCreateOwnedItem", (actorData, itemData) => {
    if(itemData.type === "shipHull") {
        if(actorData.data.type === "playership" || actorData.data.type === "npcship") {
            if(!actorData.data.data.hasHull) {
                actorData.data.data.hasHull = true;
                return true;
            }
            else {
                console.log(actorData.data.data.hasHull);
                return false;
            }
        }
        else {
            return false;
        }
    }
});

Hooks.on("preDeleteOwnedItem", (actorData, itemData) => {
    if(itemData.type === "shipHull") {
        if(actorData.data.type === "playership" || actorData.data.type === "npcship") {
            if(actorData.data.data.hasHull == true) {
                actorData.data.data.hasHull = false;
                return true;
            }
            else {
                return false;
            }
        }
    }
});

Hooks.on("preCreateActor", (createData) => {
    mergeObject(createData, {
        "token.bar1": { "attribute": "wounds" },
        "token.bar2": { "attribute": "fatigue" },
        "token.displayName": CONST.TOKEN_DISPLAY_MODES.HOVER,
        "token.displayBars": CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        "token.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
        "token.name": createData.name
    });
    if (createData.type === "acolyte") {
        createData.token.vision = true;
        createData.token.actorLink = true;
    }
});