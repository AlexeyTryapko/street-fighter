const fight = (...fighters) => {
  const fightTurn = getFightBlockTurn(fighters);
  const game = setInterval(() => {
    const { hitFighter, blockFighter } = fightTurn();
    const hitRes = hitSummary(hitFighter, blockFighter);
    blockFighter.health -= hitRes;
    console.log(`${hitFighter.name} hit ${blockFighter.name} on ${hitRes}`);
    console.log(`${blockFighter.name} - ${blockFighter.health}\n`);
    if (blockFighter.health <= 0) {
      console.log(`Winner ${hitFighter.name}`);
      clearInterval(game);
    }
  }, 1000);
};

const getFightBlockTurn = fighters => {
  let turnHit = 0;
  return () => {
    turnHit = turnHit === 1 ? 0 : 1;
    return {
      hitFighter: fighters[turnHit],
      blockFighter: fighters[turnHit + 1 === 1 ? 1 : 0]
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
