export class DarkHeresyActor extends Actor {

    prepareData() {
        super.prepareData();
        if (this.data.type == "npcship" || this.data.type == "playership") {
            this._computeShipCharacteristics(this.data);
            this._computeShipItems(this.data);
        }
        else {
            this._computeCharacteristics(this.data);
            this._computeSkills(this.data);       
            this._computeArmour(this.data);
            this._computeMovement(this.data);
            this._computeItems(this.data);
            this._computeExperience(this.data);
        }

    }

    _computeShipCharacteristics(data) {
        data.data.shipCharacteristics.type.typeName = "NO HULL";
        let achievementComponents = [];
        for (let x of Object.values(data.items)) {
            if (x.data.hasOwnProperty('hullType')) {
                data.data.shipCharacteristics.type.typeName = x.data.hullType;
                data.data.shipCharacteristics.weaponCapacity.prow.max = x.data.hullProwWeaponCap;
                data.data.shipCharacteristics.weaponCapacity.port.max = x.data.hullPortWeaponCap;
                data.data.shipCharacteristics.weaponCapacity.starboard.max = x.data.hullStarboardWeaponCap;
                data.data.shipCharacteristics.weaponCapacity.dorsal.max = x.data.hullDorsalWeaponCap;
                data.data.shipCharacteristics.weaponCapacity.keel.max = x.data.hullKeelWeaponCap;
                data.data.shipCharacteristics.weaponCapacity.aft.max = x.data.hullAftWeaponCap;

                data.data.shipCharacteristics.detection.value += x.data.hullDetection;
                data.data.shipCharacteristics.manoeuvrability.value += x.data.hullManoeuvrability;
                data.data.shipCharacteristics.speed.value += x.data.hullSpeed;
                data.data.shipCharacteristics.space.max += x.data.hullSpace;
                data.data.shipCharacteristics.integrity.max += x.data.hullIntegrity;
                data.data.shipCharacteristics.armour.value += x.data.hullArmour;
                data.data.shipCharacteristics.turretRating.value += x.data.hullTurretRating;
                data.data.shipCharacteristics.shipPoints.value += x.data.hullShipPoints;
            }
            if ((x.type === "shipQuirk" && x.data.isActive) || (x.type === "shipComponent" && !(x.data.isExposed || x.data.isExternal))) {
                data.data.shipCharacteristics.space.value += x.data.spaceUse;
            }
            if ((x.type === "shipComponent" && x.data.status == "0") || (x.type === "shipQuirk" && x.data.isActive)) {
                data.data.shipCharacteristics.power.max += x.data.powerGenerated;
                data.data.shipCharacteristics.power.value += x.data.powerUse;
                data.data.shipCharacteristics.shipPoints.value += x.data.spUse;

                data.data.shipCharacteristics.detection.value += x.data.detectionMod;
                data.data.shipCharacteristics.manoeuvrability.value += x.data.manoeuvrabilityMod;
                data.data.shipCharacteristics.speed.value += x.data.speedMod;
                data.data.shipCharacteristics.integrity.max += x.data.integrityMod;
                data.data.shipCharacteristics.armour.value += x.data.armourMod;
                data.data.shipCharacteristics.voidShields.max += x.data.voidShieldsMod;
                data.data.shipCharacteristics.turretRating.value += x.data.turretRatingMod;
                data.data.shipCharacteristics.crewPopulation.max += x.data.popMaxMod;
                data.data.shipCharacteristics.crewMorale.max += x.data.moraleMaxMod;
            }
            if (x.type === "shipComponent") {
                x.data.weapon.isWeapon = true;
                switch (x.data.weapon.weaponCapacityUse) {
                    case "prow":
                        data.data.shipCharacteristics.weaponCapacity.prow.value += 1;
                        break;
                    case "port":
                        data.data.shipCharacteristics.weaponCapacity.port.value += 1;
                        break;
                    case "starboard":
                        data.data.shipCharacteristics.weaponCapacity.starboard.value += 1;
                        break;
                    case "dorsal":
                        data.data.shipCharacteristics.weaponCapacity.dorsal.value += 1;
                        break;
                    case "keel":
                        data.data.shipCharacteristics.weaponCapacity.keel.value += 1;
                        break;
                    case "aft":
                        data.data.shipCharacteristics.weaponCapacity.aft.value += 1;
                        break;
                    default:
                        x.data.weapon.isWeapon = false;
                        break;
                }

            }
        }
        if (data.data.isCrewMoraleLossEffectsAutomated) {
            let m = data.data.shipCharacteristics.crewMorale.value;
            if (m < 1) {
                data.data.isMutiny = true;
            }
            if (m < 10) {
                data.data.shipCharacteristics.speed.value -= 10;
                data.data.shipCharacteristics.manoeuvrability.value -= 10;
                data.data.shipCharacteristics.detection.value -= 10;
            }
            if (m < 20) {

            }
            if (m < 40) {
                data.data.shipCharacteristics.manoeuvrability.value -= 10;
            }
            if (m < 50) {

            }
            if (m < 60) {

            }
            if (m < 80) {

            }
        }

        if (data.data.isCrewPopulationLossEffectsAutomated) {
            let p = data.data.shipCharacteristics.crewPopulation.value;
            if (p < 1) {
                data.data.isTomb = true;
            }
            if (p < 10) {

            }
            if (p < 20) {

            }
            if (p < 40) {
                // lose all component achievement modifiers
            }
            if (p < 50) {
                data.data.shipCharacteristics.manoeuvrability.value -= 10;
            }
            if (p < 60) {
                // -5 to Boarding actions, opposing Hit and Run, fighting fires, making emergency repairs 
            }
            if (p < 80) {
                // all travel times increase by 1d5 days
            }
        }
        if (data.data.shipStatus.isCrippled) {
            data.data.shipCharacteristics.manoeuvrability.value -= 10;
            data.data.shipCharacteristics.detection.value -= 10;
            data.data.shipCharacteristics.speed.value = Math.floor(data.data.shipCharacteristics.speed.value / 2);
        }

        data.data.initiative.bonus = Math.floor(data.data.shipCharacteristics.detection.value / 10);
        if (data.data.shipStatus.isSilentRunning) {
            data.data.shipCharacteristics.speed.value = Math.floor(data.data.shipCharacteristics.speed.value / 2);
            //halve strength of weapon components
        }

        data.data.shipCharacteristics.speed.half = Math.floor(data.data.shipCharacteristics.speed.value / 2);

    }
    _computeCharacteristics(data) {
        let middle = Object.values(data.data.characteristics).length / 2;
        let i = 0;
        for (let characteristic of Object.values(data.data.characteristics)) {
            characteristic.total = characteristic.base + characteristic.advance;
            characteristic.bonus = Math.floor(characteristic.total / 10) + characteristic.unnatural;
            characteristic.isLeft = i < middle;
            characteristic.isRight = i >= middle;
            i++;
        }
        data.data.insanityBonus = Math.floor(data.data.insanity / 10);
        data.data.corruptionBonus = Math.floor(data.data.corruption / 10);
        data.data.psy.currentRating = data.data.psy.rating - data.data.psy.sustained;
        data.data.initiative.bonus = data.data.characteristics[data.data.initiative.characteristic].bonus;
    }

    _computeSkills(data) {
        for (let skill of Object.values(data.data.skills)) {
            let short = skill.characteristics[0];
            let characteristic = this._findCharacteristic(data, short)
            //halve the skill if untrained
            if (skill.advance == -20) {
                if (characteristic.total > 0) {
                    skill.total = Math.floor(characteristic.total / 2);
                }
                else {
                    skill.total = 0;
                }
            }
            else {
                skill.total = characteristic.total + skill.advance;
            }
            if (skill.isSpecialist) {
                for (let speciality of Object.values(skill.specialities)) {
                    speciality.total = characteristic.total + speciality.advance;
                    speciality.isKnown = speciality.advance >= 0;
                }
            }
        }
    }
    _computeShipItems(data) {
        for (let item of Object.values(data.items)) {
            item.isShipHull = item.type === "shipHull";
            item.isShipComponent = item.type === "shipComponent";
            if (item.isShipHull) {
                data.data.hasHull = true;
            }
        }
    }

    _computeItems(data) {
        let encumbrance = 0;
        for (let item of Object.values(data.items)) {
            item.isMentalDisorder = item.type === "mentalDisorder";
            item.isMalignancy = item.type === "malignancy";
            item.isMutation = item.type === "mutation";
            item.isTalent = item.type === "talent";
            item.isTrait = item.type === "trait";
            item.isAptitude = item.type === "aptitude";
            item.isSpecialAbility = item.type === "specialAbility";
            item.isPsychicPower = item.type === "psychicPower";
            item.isCriticalInjury = item.type === "criticalInjury";
            item.isWeapon = item.type === "weapon";
            item.isArmour = item.type === "armour";
            item.isGear = item.type === "gear";
            item.isDrug = item.type === "drug";
            item.isTool = item.type === "tool";
            item.isCybernetic = item.type === "cybernetic";
            item.isWeaponModification = item.type === "weaponModification";
            item.isAmmunition = item.type === "ammunition";
            item.isForceField = item.type === "forceField";
            item.isAbilities = item.isTalent || item.isTrait || item.isSpecialAbility;
            if (item.data.hasOwnProperty('weight')) {
                if (item.data.hasOwnProperty('quantity')) {
                    encumbrance += item.data.weight * item.data.quantity;
                } else {
                    encumbrance += item.data.weight;
                }
            }
        }
        this._computeEncumbrance(data, encumbrance);
    }

    _computeExperience(data) {
        data.data.experience.spentCharacteristics = 0;
        data.data.experience.spentSkills = 0;
        data.data.experience.spentTalents = 0;
        data.data.experience.spentPsychicPowers = data.data.psy.cost;
        for (let characteristic of Object.values(data.data.characteristics)) {
            data.data.experience.spentCharacteristics += parseInt(characteristic.cost, 10);
        }
        for (let skill of Object.values(data.data.skills)) {
            if (skill.isSpecialist) {
                for (let speciality of Object.values(skill.specialities)) {
                    data.data.experience.spentSkills += parseInt(speciality.cost, 10);
                }
            } else {
                data.data.experience.spentSkills += parseInt(skill.cost, 10);
            }
        }
        for (let item of Object.values(data.items)) {
            if (item.isTalent) {
                data.data.experience.spentTalents += parseInt(item.data.cost, 10);
            } else if (item.isPsychicPower) {
                data.data.experience.spentPsychicPowers += parseInt(item.data.cost, 10);
            }
        }
        data.data.experience.totalSpent = data.data.experience.spentCharacteristics + data.data.experience.spentSkills + data.data.experience.spentTalents + data.data.experience.spentPsychicPowers;
        data.data.experience.total = data.data.experience.value + data.data.experience.totalSpent;
    }

    _computeArmour(data) {
        let locations = game.system.template.Item.armour.part;

        let toughness = data.data.characteristics.toughness;

        data.data.armour =
            Object.keys(locations)
                .reduce((accumulator, location) =>
                    Object.assign(accumulator,
                        {
                            [location]: {
                                total: toughness.bonus,
                                toughnessBonus: toughness.bonus,
                                value: 0
                            }
                        }), {});

        // object for storing the max armour
        let maxArmour = Object.keys(locations)
            .reduce((acc, location) =>
                Object.assign(acc, { [location]: 0 }), {})

        // for each item, find the maximum armour val per location
        data.items
            .filter(item => item.type === "armour")
            .reduce((acc, armour) => {
                Object.keys(locations)
                    .forEach((location) => {
                        let armourVal = armour.data.part[location] || 0;
                        if (armourVal > acc[location]) {
                            acc[location] = armourVal;
                        } else if(armour.data.ignoreStackingRules) {
                            acc[location] += armourVal;
                        }
                    }
                    )
                return acc;
            }, maxArmour);

        data.data.armour.head.value = maxArmour["head"];
        data.data.armour.leftArm.value = maxArmour["leftArm"];
        data.data.armour.rightArm.value = maxArmour["rightArm"];
        data.data.armour.body.value = maxArmour["body"];
        data.data.armour.leftLeg.value = maxArmour["leftLeg"];
        data.data.armour.rightLeg.value = maxArmour["rightLeg"];

        data.data.armour.head.total += data.data.armour.head.value;
        data.data.armour.leftArm.total += data.data.armour.leftArm.value;
        data.data.armour.rightArm.total += data.data.armour.rightArm.value;
        data.data.armour.body.total += data.data.armour.body.value;
        data.data.armour.leftLeg.total += data.data.armour.leftLeg.value;
        data.data.armour.rightLeg.total += data.data.armour.rightLeg.value;
    }

    _computeMovement(data) {
        let agility = data.data.characteristics.agility;
        let size = data.data.size;
        data.data.movement = {
            half: agility.bonus + (size - 4),
            full: (agility.bonus * 2) + (size - 4),
            charge: (agility.bonus * 3) + (size - 4),
            run: (agility.bonus * 6) + (size - 4)
        }
    }

    _findCharacteristic(data, short) {
        for (let characteristic of Object.values(data.data.characteristics)) {
            if (characteristic.short === short) {
                return characteristic;
            }
        }
        return { total: 0 };
    }

    _computeEncumbrance(data, encumbrance) {
        const attributeBonus = data.data.characteristics.strength.bonus + data.data.characteristics.toughness.bonus;
        data.data.encumbrance = {
            max: 0,
            value: encumbrance
        };
        switch (attributeBonus) {
            case 0:
                data.data.encumbrance.max = 0.9;
                break
            case 1:
                data.data.encumbrance.max = 2.25;
                break
            case 2:
                data.data.encumbrance.max = 4.5;
                break
            case 3:
                data.data.encumbrance.max = 9;
                break
            case 4:
                data.data.encumbrance.max = 18;
                break
            case 5:
                data.data.encumbrance.max = 27;
                break
            case 6:
                data.data.encumbrance.max = 36;
                break
            case 7:
                data.data.encumbrance.max = 45;
                break
            case 8:
                data.data.encumbrance.max = 56;
                break
            case 9:
                data.data.encumbrance.max = 67;
                break
            case 10:
                data.data.encumbrance.max = 78;
                break
            case 11:
                data.data.encumbrance.max = 90;
                break
            case 12:
                data.data.encumbrance.max = 112;
                break
            case 13:
                data.data.encumbrance.max = 225;
                break
            case 14:
                data.data.encumbrance.max = 337;
                break
            case 15:
                data.data.encumbrance.max = 450;
                break
            case 16:
                data.data.encumbrance.max = 675;
                break
            case 17:
                data.data.encumbrance.max = 900;
                break
            case 18:
                data.data.encumbrance.max = 1350;
                break
            case 19:
                data.data.encumbrance.max = 1800;
                break
            case 20:
                data.data.encumbrance.max = 2250;
                break
            default:
                data.data.encumbrance.max = 2250;
                break
        }
    }
}