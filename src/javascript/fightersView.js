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
      this.startFightClick(this.fighters)
    );
  }
  static rootElement = document.getElementById("root");
  fightersDetailsMap = new Map();
  modal = document.querySelector(".modal-info");
  modalTitle = document.querySelector(".modal-title");
  healthInfo = document.getElementById("health-info");
  attackInfo = document.getElementById("attack-info");
  defenseInfo = document.getElementById("defense-info");
  startFightBtn = document.getElementById("start-fight");
  fighters = [];
  selectedColor = "blue";

  startFightClick(fighters) {
    fighters.length < 2
      ? this.startFightBtn.nextElementSibling.classList.remove(
          "visually-hidden"
        )
      : this.startFight(fighters);
  }

  async startFight([{ id: firstFighterID }, { id: secondFighterID }]) {
    const secondFighter = await this.getFighterDetails(secondFighterID);
    const firstFighter = await this.getFighterDetails(firstFighterID);

    fight(new Fighter(firstFighter), new Fighter(secondFighter));

    this.startFightBtn.nextElementSibling.classList.add("visually-hidden");
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

  async handleFighterSelectClick(event, { _id: fighterID }) {
    await this.getFighterDetails(fighterID);
    if (this.fighters.length === 2) {
      this.fighters
        .shift()
        .target.classList.remove("selected-fighter", "red", "blue");
    }
    const target = event.target.parentNode;
    target.classList.add("selected-fighter");
    this.fighters.push({ id: fighterID, target });
    this.changeSelectedColor(this.fighters);
  }

  changeSelectedColor(fighters) {
    if (fighters[1]) fighters[1].target.classList.add("red");
    fighters[0].target.classList.add("blue");
    fighters[0].target.classList.remove("red");
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

  async updateFighterDetails(fighter) {
    const updatedFighter = Object.assign(fighter, {
      health: this.healthInfo.value,
      attack: this.attackInfo.value,
      defense: this.defenseInfo.value
    });
    const res = await fighterService.updateFighterInfo(updatedFighter);
    this.fightersDetailsMap.set(res._id, res);
  }

  async removeFighter(fighter) {
    const res = await fighterService.deleteFighter(fighter._id);
    if (res === `User was deleted - true`) {
      this.fightersDetailsMap.delete(fighter._id);
      return true;
    }
    return false;
  }

  initModal(fighter) {
    this.modal.classList.add("modal-show");
    this.fillModal(fighter);

    const closeBtn = document.getElementById("close-modal");
    closeBtn.addEventListener("click", () => this.closeModal());

    const saveBtn = document.getElementById("save-modal");
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    const deleteBtn = document.getElementById("delete-modal");
    const newDeleteBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

    newDeleteBtn.addEventListener("click", async () => {
      const res = this.removeFighter(fighter);
      if (res) {
        while (this.element.firstChild) {
          this.element.removeChild(this.element.firstChild);
        }
        this.element = undefined;
        const fighters = await fighterService.getFighters();
        this.createFighters(fighters);

        FightersView.rootElement.removeChild(FightersView.rootElement.lastChild);
        FightersView.rootElement.appendChild(this.element);
        this.closeModal();
      }
    });

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
