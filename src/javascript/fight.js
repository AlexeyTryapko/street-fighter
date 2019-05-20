const exitBTN = document.getElementById("exit-game");
const winnerNameTitle = document.getElementById("winner-name");

const firstFighterTarget = document.getElementById("firstFighter");
const secondFighterTarget = document.getElementById("secondFighter");

const fight = (...fighters) => {
  toggleGameField();
  fighters.forEach(fighter =>
    assingProp(fighter, "healthCulc", culcHealthRest(fighter.health))
  );
  fillFightersInfo(fighters);
  const game = startGame(fighters);
  initUIElements(game);
};

const initUIElements = game => {
  const newExitBTN = exitBTN.cloneNode(true);
  exitBTN.parentNode.replaceChild(newExitBTN, exitBTN);
  newExitBTN.addEventListener("click", () => exitGame(game));
};

const startGame = fighters => {
  const fightTurn = getFightBlockTurn(fighters);
  const game = setInterval(() => {
    const { hitFighter, blockFighter } = fightTurn();
    const hitRes = hitSummary(hitFighter, blockFighter);
    blockFighter.health -= hitRes;
    fillFightersInfo(fighters);
    if (blockFighter.health <= 0) finishGame(game, hitFighter.name);
  }, 1000);
  return game;
};

const finishGame = (game, winner) => {
  winnerNameTitle.innerText = `Winner - ${winner} !!!`;
  clearInterval(game);
};

const exitGame = game => {
  winnerNameTitle.innerText = "";
  clearInterval(game);
  toggleGameField();
};

const assingProp = (obj, key, value) => (obj[key] = value);

const toggleGameField = () => {
  const rootElement = document.getElementById("root");
  const header = document.getElementById("header-controls");
  const gameField = document.getElementById("game");
  gameField.classList.toggle("visually-hidden");
  rootElement.classList.toggle("visually-hidden");
  header.classList.toggle("visually-hidden");
};

let firstFighterHit = true;
const fillFightersInfo = fighters => {
  [firstFighterTarget, secondFighterTarget].forEach((target, i) =>
    updateFighterTarget(fighters[i], target)
  );

  firstFighterHit
    ? restartAnimation(firstFighterTarget)
    : restartAnimation(secondFighterTarget);
};

const restartAnimation = node => {
  const image = node.querySelector(".fighter-image");
  const newImage = image.cloneNode(true);
  image.parentNode.replaceChild(newImage, image);
  firstFighterHit = !firstFighterHit;
};

const updateFighterTarget = (fighter, target) => {
  const { name, source, health, healthCulc } = fighter;
  target.querySelector(".fighter-name").innerText = name;
  const image = target.querySelector(".fighter-image");
  image.setAttribute("src", source);
  const healthBar = target.querySelector(".progress-bar");
  healthBar.style.width = `${healthCulc(health < 0 ? 0 : health)}%`;
  healthBar.innerText = `${health < 0 ? 0 : health}hp`;
};

const culcHealthRest = initial => current =>
  Math.floor((current * 100) / initial);

const getFightBlockTurn = fighters => {
  let turnHit = 0;
  return () => {
    turnHit = turnHit === 1 ? 0 : 1;
    return {
      hitFighter: fighters[turnHit],
      blockFighter: fighters[turnHit === 0 ? 1 : 0]
    };
  };
};

const hitSummary = (hitFighter, blockFighter) => {
  const hit = hitFighter.getHitPower();
  const block = blockFighter.getBlockPower();
  const summary = hit - block;
  return summary > 0 ? summary : 0;
};

export { fight };
