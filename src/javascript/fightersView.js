import View from "./view";
import FighterView from "./fighterView";
import { fighterService } from "./services/fightersService";
import { fight } from "./fight";
import Fighter from "./Fighter";

class FightersView extends View {
  constructor(fighters) {
    super();
    this.handleDetailsClick = this.handleFighterClick.bind(this);
    this.handleSelectClick = this.handleFighterSelectClick.bind(this);
    this.createFighters(fighters);
    this.startFightBtn.addEventListener("click", () =>
      this.startFight(this.fighters)
    );
  }

  fightersDetailsMap = new Map();
  modal = document.querySelector(".modal-info");
  modalTitle = document.querySelector(".modal-title");
  healthInfo = document.getElementById("health-info");
  attackInfo = document.getElementById("attack-info");
  defenseInfo = document.getElementById("defense-info");
  startFightBtn = document.getElementById("start-fight");
  fighters = [];

  async startFight([{ id: firstFighterID }, { id: secondFighterID }]) {
    const firstFighter = await this.getFighterDetails(firstFighterID);
    const secondFighter = await this.getFighterDetails(secondFighterID);
    fight(new Fighter(firstFighter), new Fighter(secondFighter));
  }

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(
        fighter,
        this.handleDetailsClick,
        this.handleSelectClick
      );
      return fighterView.element;
    });

    this.element = this.createElement({
      tagName: "div",
      classNames: ["fighters"]
    });
    this.element.append(...fighterElements);
  }

  async handleFighterSelectClick(event, fighter) {
    const fighterDetails = await this.getFighterDetails(fighter._id);
    const target = event.target.parentNode;
    if (this.fighters.length === 2) {
      this.fighters.shift().target.classList.remove("selected-fighter");
      this.fighters.push({ id: fighterDetails._id, target });
      target.classList.add("selected-fighter");
    } else {
      this.fighters.push({ id: fighterDetails._id, target });
      target.classList.add("selected-fighter");
    }
  }

  styleSelectedFighters(newTarget, fightersTargets) {
    event.target.parentNode.classList.add("selected-fighter");
  }

  async handleFighterClick(event, { _id: fighterID }) {
    const fighterDetails = await this.getFighterDetails(fighterID);
    this.initModal(fighterDetails);
  }

  async getFighterDetails(id) {
    let fighterDetails = this.fightersDetailsMap.get(id);

    if (!fighterDetails) {
      fighterDetails = await fighterService.getFighterDetails(id);
      this.fightersDetailsMap.set(id, fighterDetails);
    }

    return fighterDetails;
  }

  updateFighterDetails(fighter) {
    const updatedFighter = Object.assign(fighter, {
      health: this.healthInfo.value,
      attack: this.attackInfo.value,
      defense: this.defenseInfo.value
    });
    this.fightersDetailsMap.set(fighter._id, updatedFighter);
  }

  initModal(fighter) {
    this.modal.classList.add("modal-show");
    this.fillModal(fighter);

    const closeBtn = document.getElementById("close-modal");
    closeBtn.addEventListener("click", () => this.closeModal());

    const saveBtn = document.getElementById("save-modal");
    //For removing extra eventListeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener(
      "click",
      () => (this.updateFighterDetails(fighter), this.closeModal())
    );
  }

  fillModal({ name, health, attack, defense }) {
    this.modalTitle.innerText = name;
    this.healthInfo.value = health;
    this.attackInfo.value = attack;
    this.defenseInfo.value = defense;
  }

  closeModal() {
    this.modal.classList.remove("modal-show");
  }
}

export default FightersView;
