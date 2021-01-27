import { ShipSheet } from "./actor.js";

export class NPCShipSheet extends ShipSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rogue-trader", "sheet", "actor"],
            template: "systems/rogue-trader/template/sheet/actor/npcShip.html",
            width: 700,
            height: 881,
            resizable: false,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "stats",
                },
            ],
        });
    }

}