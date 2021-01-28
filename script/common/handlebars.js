export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/rogue-trader/template/sheet/actor/acolyte.html",
    "systems/rogue-trader/template/sheet/actor/npc.html",
    "systems/rogue-trader/template/sheet/actor/limited-sheet.html",
    "systems/rogue-trader/template/sheet/actor/ship.html",
    "systems/rogue-trader/template/sheet/actor/npcship.html",
    "systems/rogue-trader/template/sheet/actor/playership.html",

    "systems/rogue-trader/template/sheet/actor/tab/abilities.html",
    "systems/rogue-trader/template/sheet/actor/tab/combat.html",
    "systems/rogue-trader/template/sheet/actor/tab/gear.html",
    "systems/rogue-trader/template/sheet/actor/tab/notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/npc-notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/npc-stats.html",
    "systems/rogue-trader/template/sheet/actor/tab/progression.html",
    "systems/rogue-trader/template/sheet/actor/tab/psychic-powers.html",
    "systems/rogue-trader/template/sheet/actor/tab/stats.html",

    "systems/rogue-trader/template/sheet/actor/ship/tab/abilities.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/combat.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/components.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/crew.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/notes.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/npc-notes.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/npc-stats.html",
    "systems/rogue-trader/template/sheet/actor/ship/tab/stats.html",

    "systems/rogue-trader/template/sheet/mental-disorder.html",
    "systems/rogue-trader/template/sheet/aptitude.html",
    "systems/rogue-trader/template/sheet/malignancy.html",
    "systems/rogue-trader/template/sheet/mutation.html",
    "systems/rogue-trader/template/sheet/talent.html",
    "systems/rogue-trader/template/sheet/trait.html",
    "systems/rogue-trader/template/sheet/special-ability.html",
    "systems/rogue-trader/template/sheet/psychic-power.html",
    "systems/rogue-trader/template/sheet/critical-injury.html",
    "systems/rogue-trader/template/sheet/weapon.html",
    "systems/rogue-trader/template/sheet/armour.html",
    "systems/rogue-trader/template/sheet/gear.html",
    "systems/rogue-trader/template/sheet/drug.html",
    "systems/rogue-trader/template/sheet/tool.html",
    "systems/rogue-trader/template/sheet/cybernetic.html",
    "systems/rogue-trader/template/sheet/weapon-modification.html",
    "systems/rogue-trader/template/sheet/ammunition.html",
    "systems/rogue-trader/template/sheet/force-field.html",
    "systems/rogue-trader/template/sheet/shipHull.html",
    "systems/rogue-trader/template/sheet/characteristics/information.html",
    "systems/rogue-trader/template/sheet/characteristics/left.html",
    "systems/rogue-trader/template/sheet/characteristics/name.html",
    "systems/rogue-trader/template/sheet/characteristics/right.html",
    "systems/rogue-trader/template/sheet/characteristics/total.html",
    "systems/rogue-trader/template/chat/item.html",
    "systems/rogue-trader/template/chat/roll.html",
    "systems/rogue-trader/template/dialog/common-roll.html",
    "systems/rogue-trader/template/dialog/combat-roll.html",
    "systems/rogue-trader/template/dialog/psychic-power-roll.html"
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("removeMarkup", function (text) {
    const markup = /<(.*?)>/gi;
    return text.replace(markup, "");
  })
  Handlebars.registerHelper("advanceCharacteristic", function (characteristic) {
    characteristic = normalize(characteristic, 0);
    switch (characteristic) {
      case 0:
        return "N";
      case 5:
        return "S";
      case 10:
        return "I";
      case 15:
        return "T";
      case 20:
        return "P";
      case 25:
        return "E";
      default:
        return "N";
    }
  });
  Handlebars.registerHelper("advanceSkill", function (skill) {
    skill = normalize(skill, 0);
    switch (skill) {
      case -20:
        return "U";
      case 0:
        return "K";
      case 10:
        return "T";
      case 20:
        return "E";
      case 30:
        return "V";
      default:
        return "U";
    }
  });
  Handlebars.registerHelper("psychicPower", function (psychicPower) {
    psychicPower = normalize(psychicPower, "bound");
    switch (psychicPower) {
      case "bound":
        return game.i18n.localize("PSYCHIC_POWER.BOUND");
      case "unbound":
        return game.i18n.localize("PSYCHIC_POWER.UNBOUND");
      case "daemonic":
        return game.i18n.localize("PSYCHIC_POWER.DAEMONIC");
      default:
        return game.i18n.localize("PSYCHIC_POWER.BOUND");
    }
  });
  Handlebars.registerHelper("clip", function (clip) {
    return `${clip.value}/${clip.max}`
  });
  Handlebars.registerHelper("rateOfFire", function (rof) {
    let single = rof.single > 0 ? "S" : "-";
    let burst = rof.burst > 0 ? `${rof.burst}` : "-";
    let full = rof.full > 0 ? `${rof.full}` : "-";
    return `${single}/${burst}/${full}`
  });
  Handlebars.registerHelper("weaponClass", function (weaponClass) {
    weaponClass = normalize(weaponClass, "melee");
    switch (weaponClass) {
      case "melee":
        return game.i18n.localize("WEAPON.MELEE");
      case "thrown":
        return game.i18n.localize("WEAPON.THROWN");
      case "pistol":
        return game.i18n.localize("WEAPON.PISTOL");
      case "basic":
        return game.i18n.localize("WEAPON.BASIC");
      case "heavy":
        return game.i18n.localize("WEAPON.HEAVY");
      case "vehicle":
        return game.i18n.localize("WEAPON.VEHICLE");
      default:
        return game.i18n.localize("WEAPON.MELEE");
    }
  });
  Handlebars.registerHelper("damageType", function (damageType) {
    damageType = normalize(damageType, "impact");
    switch (damageType) {
      case "energy":
        return game.i18n.localize("DAMAGE_TYPE.ENERGY_SHORT");
      case "impact":
        return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
      case "rending":
        return game.i18n.localize("DAMAGE_TYPE.RENDING_SHORT");
      case "explosive":
        return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE_SHORT");
      default:
        return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
    }
  });
  Handlebars.registerHelper("craftsmanship", function (craftsmanship) {
    craftsmanship = normalize(craftsmanship, "common");
    switch (craftsmanship) {
      case "poor":
        return game.i18n.localize("CRAFTSMANSHIP.POOR");
      case "common":
        return game.i18n.localize("CRAFTSMANSHIP.COMMON");
      case "good":
        return game.i18n.localize("CRAFTSMANSHIP.GOOD");
      case "best":
        return game.i18n.localize("CRAFTSMANSHIP.BEST");
      default:
        return game.i18n.localize("CRAFTSMANSHIP.COMMON");
    }
  });
  Handlebars.registerHelper("availability", function (availability) {
    availability = normalize(availability, "common");
    switch (availability) {
      case "ubiquitous":
        return game.i18n.localize("AVAILABILITY.UBIQUITOUS");
      case "abundant":
        return game.i18n.localize("AVAILABILITY.ABUNDANT");
      case "plentiful":
        return game.i18n.localize("AVAILABILITY.PLENTIFUL");
      case "common":
        return game.i18n.localize("AVAILABILITY.COMMON");
      case "average":
        return game.i18n.localize("AVAILABILITY.AVERAGE");
      case "scarce":
        return game.i18n.localize("AVAILABILITY.SCARCE");
      case "rare":
        return game.i18n.localize("AVAILABILITY.RARE");
      case "very-rare":
        return game.i18n.localize("AVAILABILITY.VERY_RARE");
      case "extremely-rare":
        return game.i18n.localize("AVAILABILITY.EXTREMELY_RARE");
      case "near-unique":
        return game.i18n.localize("AVAILABILITY.NEAR_UNIQUE");
      case "Unique":
        return game.i18n.localize("AVAILABILITY.UNIQUE");
      default:
        return game.i18n.localize("AVAILABILITY.COMMON");
    }
  });
  Handlebars.registerHelper("armourType", function (armourType) {
    armourType = normalize(armourType, "basic");
    switch (armourType) {
      case "basic":
        return game.i18n.localize("ARMOUR_TYPE.BASIC");
      case "flak":
        return game.i18n.localize("ARMOUR_TYPE.FLAK");
      case "mesh":
        return game.i18n.localize("ARMOUR_TYPE.MESH");
      case "carapace":
        return game.i18n.localize("ARMOUR_TYPE.CARAPACE");
      case "power":
        return game.i18n.localize("ARMOUR_TYPE.POWER");
      default:
        return game.i18n.localize("ARMOUR_TYPE.COMMON");
    }
  });
  Handlebars.registerHelper("part", function (part) {
    let parts = [];
    if (part.head > 0) parts.push(`${game.i18n.localize("ARMOUR.HEAD")} (${part.head})`);
    if (part.leftArm > 0) parts.push(`${game.i18n.localize("ARMOUR.LEFT_ARM")} (${part.leftArm})`);
    if (part.rightArm > 0) parts.push(`${game.i18n.localize("ARMOUR.RIGHT_ARM")} (${part.rightArm})`);
    if (part.body > 0) parts.push(`${game.i18n.localize("ARMOUR.BODY")} (${part.body})`);
    if (part.leftLeg > 0) parts.push(`${game.i18n.localize("ARMOUR.LEFT_LEG")} (${part.leftLeg})`);
    if (part.rightLeg > 0) parts.push(`${game.i18n.localize("ARMOUR.RIGHT_LEG")} (${part.rightLeg})`);
    return parts.join(" / ");
  });
  Handlebars.registerHelper("partLocation", function (parLocation) {
    parLocation = normalize(parLocation, "body");
    switch (parLocation) {
      case "head":
        return game.i18n.localize("ARMOUR.HEAD");
      case "leftArm":
        return game.i18n.localize("ARMOUR.LEFT_ARM");
      case "rightArm":
        return game.i18n.localize("ARMOUR.RIGHT_ARM");
      case "body":
        return game.i18n.localize("ARMOUR.BODY");
      case "leftLeg":
        return game.i18n.localize("ARMOUR.LEFT_LEG");
      case "rightLeg":
        return game.i18n.localize("ARMOUR.RIGHT_LEG");
      default:
        return game.i18n.localize("ARMOUR.BODY");
    }
  });
  Handlebars.registerHelper("isInstalled", function (installed) {
    if (installed) {
      return game.i18n.localize("BUTTON.YES");
    } else {
      return game.i18n.localize("BUTTON.NO");
    }
  });
  Handlebars.registerHelper("psychicPowerZone", function (psychicPowerZone) {
    psychicPowerZone = normalize(psychicPowerZone, "bolt");
    switch (psychicPowerZone) {
      case "bolt":
        return game.i18n.localize("PSYCHIC_POWER.BOLT");
      case "barrage":
        return game.i18n.localize("PSYCHIC_POWER.BARRAGE");
      case "storm":
        return game.i18n.localize("PSYCHIC_POWER.STORM");
      default:
        return game.i18n.localize("PSYCHIC_POWER.BOLT");
    }
  });
}

function normalize(data, defaultValue) {
  if (typeof data === "string") {
    return data.toLowerCase();
  } else if (data) {
    return data;
  } else {
    return defaultValue;
  }
}
