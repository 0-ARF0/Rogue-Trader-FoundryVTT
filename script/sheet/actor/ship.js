import {prepareCommonRoll, prepareCombatRoll} from "../../common/dialog.js";
export class ShipSheet extends ActorSheet {
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-create").click(ev => this._onItemCreate(ev));
        html.find(".item-edit").click(ev => this._onItemEdit(ev));
        html.find(".item-delete").click(ev => this._onItemDelete(ev));
        html.find("input").focusin(ev => this._onFocusIn(ev));

    }

  /** @override */
  getData() {
    const data = super.getData();
    return data
  }

  /** @override */
  get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/rogue-trader/template/sheet/actor/limited-sheet.html";
    } else {
      return this.options.template;
    }
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.actor.owner) {
      buttons = [
        {
          label: game.i18n.localize("BUTTON.ROLL"),
          class: "custom-roll",
          icon: "fas fa-dice",
          onclick: async (ev) => await this._prepareCustomRoll()
        }
      ].concat(buttons);
    }
    return buttons;
  }

  _onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data, {renderSheet: true});
  }

  _onItemEdit(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    const item = this.actor.getOwnedItem(div.data("itemId"));
    item.sheet.render(true);
  }

  _onItemDelete(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    this.actor.deleteOwnedItem(div.data("itemId"));
    div.slideUp(200, () => this.render(false));
  }

  _onFocusIn(event) {
    $(event.currentTarget).select();
  }

  async _prepareCustomRoll() {
    const rollData = {
      name: "DIALOG.CUSTOM_ROLL",
      baseTarget: 50,
      modifier: 0
    };
    await prepareCommonRoll(rollData);
  }


   _getshipCharacteristicOptions (selected) {
    const shipCharacteristics = []
    for (let char of Object.values(this.actor.data.data.shipCharacteristics)) {
      shipCharacteristics.push({
        label: char.label,
        target: char.total,
        selected: char.short === selected
      })
    }
    return shipCharacteristics;
  }

/*
  async _prepareRollWeapon(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    const weapon = this.actor.getOwnedItem(div.data("itemId"));
    let characteristic = this._getWeaponCharacteristic(weapon);
    let rateOfFire;
    if (weapon.data.data.class === "melee") {
      rateOfFire = {burst: characteristic.bonus, full: characteristic.bonus};
    } else {
      rateOfFire = {burst: weapon.data.data.rateOfFire.burst, full: weapon.data.data.rateOfFire.full};
    }
    let rollData = {
      name: weapon.name,
      baseTarget: characteristic.total + weapon.data.data.attack,
      modifier: 0,
      isMelee: weapon.data.data.class === "melee",
      isRange: !(weapon.data.data.class === "melee"),
      damageFormula: weapon.data.data.damage,
      damageBonus: (weapon.data.data.class === "melee") ? this.actor.data.data.characteristics.strength.bonus : 0,
      damageType: weapon.data.data.damageType,
      penetrationFormula: weapon.data.data.penetration,
      rateOfFire: rateOfFire,
      special: weapon.data.data.special,
      psy: {value: this.actor.data.data.psy.rating, display: false},
    };
    await prepareCombatRoll(rollData);
  }

  _getWeaponCharacteristic(weapon) {
      return this.actor.data.data.characteristics.ballisticSkill;
  } */
}