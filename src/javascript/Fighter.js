class Fighter {
  constructor({name, health, attack, defense, source}) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.source = source;
  }

  getHitPower() {
    const criticalHitChance = Math.floor(Math.random() * 2) + 1;
    const power = this.attack * criticalHitChance;
    return power;
  }

  getBlockPower() {
    const dodgeChance = Math.floor(Math.random() * 2) + 1;
    const power = this.defense * dodgeChance;
    return power;
  }
}

export default Fighter;