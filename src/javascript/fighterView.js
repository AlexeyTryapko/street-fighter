import View from "./view";

class FighterView extends View {
  constructor(fighter, handleDetailsClick, handleSelectClick) {
    super();

    this.createFighter(fighter, handleDetailsClick, handleSelectClick);
  }

  createFighter(fighter, handleDetalisClick, handleSelectClick) {
    const { name, source } = fighter;
    const nameElement = this.createName(name);
    const imageElement = this.createImage(source);

    this.element = this.createElement({
      tagName: "div",
      classNames: ["fighter"]
    });

    const fighterMain = this.createElement({
      tagName: "div",
      classNames: ["fighter-body"]
    });

    const selectBtn = this.createElement({
      tagName: "button",
      classNames: ["btn", "btn-primary"]
    });
    selectBtn.innerText = "SELECT";

    selectBtn.addEventListener(
      "click",
      event => handleSelectClick(event, fighter),
      false
    );
    fighterMain.append(imageElement, nameElement, selectBtn);
    this.element.append(fighterMain, selectBtn);
    fighterMain.addEventListener(
      "click",
      event => handleDetalisClick(event, fighter),
      false
    );
  }

  createName(name) {
    const nameElement = this.createElement({
      tagName: "span",
      classNames: ["name"]
    });
    nameElement.innerText = name;

    return nameElement;
  }

  createImage(source) {
    const attributes = { src: source };
    const imgElement = this.createElement({
      tagName: "img",
      classNames: ["fighter-image"],
      attributes
    });

    return imgElement;
  }
}

export default FighterView;
