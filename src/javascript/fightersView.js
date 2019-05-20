import View from "./view";
import FighterView from "./fighterView";
import { fighterService } from "./services/fightersService";
import { fight } from './fight';
import Fighter from './Fighter';

class FightersView extends View {
  constructor(fighters) {
    super();
    this.handleClick = this.handleFighterClick.bind(this);
    this.createFighters(fighters);
    this.startFightBtn.addEventListener("click", () => this.startFight());
  }

  fightersDetailsMap = new Map();
  modal = document.querySelector(".modal-info");
  modalTitle = document.querySelector(".modal-title");
  healthInfo = document.getElementById("health-info");
  attackInfo = document.getElementById("attack-info");
  defenseInfo = document.getElementById("defense-info");
  startFightBtn = document.getElementById("start-fight");

  startFight() {
    const firstFighter = this.fightersDetailsMap.get("1");
    const secondFighter = this.fightersDetailsMap.get("6");
    fight(
      new Fighter(firstFighter),
      new Fighter(secondFighter)
    );
  }

  createFighters(fighters) {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(fighter, this.handleClick);
      return fighterView.element;
    });

    this.element = this.createElement({
      tagName: "div",
      className: "fighters"
    });
    this.element.append(...fighterElements);
  }

  async handleFighterClick(event, { _id: fighterID }) {
    let fighterDetails = this.fightersDetailsMap.get(fighterID);

    if (!fighterDetails) {
      fighterDetails = await fighterService.getFighterDetails(fighterID);
      this.fightersDetailsMap.set(fighterID, fighterDetails);
    }

    this.initModal(fighterDetails);
  }

  updateFighterInfo(fighter) {
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
      () => (this.updateFighterInfo(fighter), this.closeModal())
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
