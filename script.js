class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 20;
    this.maxPetEnergy = 10;
    this.mobsInfo = [{name: "goblin1", displayName: "Goblin Footsoldier", attack: 1, health: 20, level: 1,
    url: "https://www.ashlynnpai.com/assets/Jinn_goblin.png"},
    {name: "goblin2", displayName: "Goblin Lieutenant", attack: 2, health: 30, level: 2,
    url: "https://www.ashlynnpai.com/assets/Jinn_goblin.png"},
    {name: "orc1", displayName: "Orc Captain", attack: 3, health: 50, level: 3,
    url: "https://www.ashlynnpai.com/assets/Jinn_orc.png"},
    {name: "balrog", displayName: "Balrog", attack: 5, health: 100, level: 3,
    url: "https://www.ashlynnpai.com/assets/balrog11.jpg"}
    ];
    this.weaponsInfo = [
    {name: "Hands", attack: 1, description: "These are deadly weapons.", url: "https://www.ashlynnpai.com/assets/Power%20of%20blessing.png"},
    {name: "Meatchopper", attack: 2, description: "A rusty knife from someone's kitchen.", url: "https://www.ashlynnpai.com/assets/dagger.png"},
    {name: "Slicer", attack: 3, description: "This blade belonged to a goblin.", url: "https://www.ashlynnpai.com/assets/shortsword.png"},
    {name: "Iceblade", attack: 5, description: "A legendary sword forged by the dwarves.", url: "https://www.ashlynnpai.com/assets/greatsword.png"}
  ];
    this.itemsInfo = [{name: "Boots", bonus: ["dodgeChance", .02], url: "https://www.ashlynnpai.com/assets/Light%20Boot_1.png", description: "Dodge +.03"},
    {name: "Bracers", bonus: ["hitChance", .02], url: "https://www.ashlynnpai.com/assets/Leather%20Bracelet_1.PNG", description: "Hit +.03"},
    {name: "Helm", bonus: ["hitChance", .02], url: "https://www.ashlynnpai.com/assets/Light%20Helm_1.PNG", description: "Hit +.04"},
    {name: "Belt", bonus: ["dodgeChance", .02], url: "https://www.ashlynnpai.com/assets/Light%20Belt_1.png", description: "Dodge +.04"},
    {name: "Gloves", bonus: ["attack", 1], url: "https://www.ashlynnpai.com/assets/Leather%20Glove_1.png", description: "Attack +1"},
    {name: "Breastplate", bonus: ["hitChance", .03], url: "https://www.ashlynnpai.com/assets/Light%20Armor_1.png", description: "Hit +.05"}
  ];
    this.findableItems = [{level: 0, item: "Rune"}, {level: 0, item: "Meatchopper"}, {level: 1, item: "Brooch"},
  {level: 1, item: "Necklace"}, {level: 1, item: "Slicer"},
  {level: 2, item: "Book"}, {level: 2, item: "Iceblade"}, {level: 2, item: "Orb"}];
    this.questItemsInfo = [{name: "Rune", longName: "Rune of Shielding", description:
    "This rune was created by the elves for protection.", url: "https://www.ashlynnpai.com/assets/Ruin%20Stone_01.png"},
    {name: "Brooch", longName: "Brooch of Wisdom", description:
    "This brooch fills the wearer with courage.", url: "https://www.ashlynnpai.com/assets/Ornament_03.png"},
    {name: "Necklace", longName: "Necklace of Flight", description:
    "Wearing this necklace makes your load feel lighter.", url: "https://www.ashlynnpai.com/assets/Necklace_03.png"},
    {name: "Book", longName: "Book of the Art of Combat", description:
    "You learn the secrets of swordplay.", url: "https://www.ashlynnpai.com/assets/Book_00.png"},
    {name: "Orb", longName: "Orb of Seeing", description:
    "You see into your enemys mind.", url: "https://www.ashlynnpai.com/assets/Crystal%20Ball_03.png"}];
    this.dropsHash = {1: ["Boots", "healthPotion", "manaPotion", "healthPotion", "Bracers"],
      2: ["Helm", "healthPotion", "manaPotion", "healthPotion", "Belt"],
      3: ["Gloves", "healthPotion", "manaPotion", "manaPotion", "Breastplate"]
      };
    this.mobSkills = [{name: "Firebomb", action: "throws", counter: "water"}, {name: "Ice Spars", action: "summons", counter: "fire"},
    {name: "Shadow", action: "casts", counter: "light"}];
    const startPoint = 0;

    let squares = this.createSquares(0, []);
    //seed player, pet, fixtures
    squares[0][0] = "P";
    squares[0][19] = "pet";
    squares[2][57] = "balrog";

    squares = this.seedFixtures(squares);
    squares = this.seedReserves(squares);
    squares = this.seedStairs(squares);
    squares = this.seedMobs(squares, 0, 0);
    squares = this.seedItems(squares, 0);

    this.state = {
      squares: squares,
      mapLevel: 0,
      hidden: [],
      playerIndex: startPoint,
      health: 20,
      maxHealth: 20, //has to increase on level
      mana: 10,
      maxMana: 10, //has to increase on level
      level: 1,
      xp: 0,
      hitChance: .70,
      dodgeChance: 0,
      specialSkill: null,
      buff: null,
      pet: false,
      petEnergy: 10,
      furyCooldown: false,
      living: true,
      weapons: [{name: "Hands", attack: 1, description: "These are deadly weapons.", url: "https://www.ashlynnpai.com/assets/Power%20of%20blessing.png"}],
      attack: 1,
      inventory: [{healthPotion: 1}, {manaPotion: 0}],
      equipment: [],
      questItems: [],
      quests: [
       {name: "Mirror", description: "A wizard ventured into Silverhearth and has never been seen since. Could he have left something behind?",
        item: "Orb", completed: false, xp: 30},
       {name: "Master of Swords", description: "A great tome of swordplay is thought to reside in the library of Silverhearth.",
       item: "Book", completed: false, xp: 20},
       {name: "Lost Necklace", description: "Lady Lowena believes her necklace was stolen by a goblin scavenger.",
       item: "Necklace", completed: false, xp: 20},
       {name: "Legend of the Jewel", description: "There are rumors of a fabled jewel in these halls.",
       item: "Brooch", completed: false, xp: 10},
       {name: "A Small Clue", description: "This was once a great hall. Find some clue about what happened here.",
       item: "Rune", completed: false, xp: 10}
      ],
      currentMob: "",
      mobHp: 0,
      targetIndex: null,
      currentAction: null,
      mainLog: [],
      combatLog: [],
      message: "",
      sound: true,
      overlay: true,
      darkness: true
      };
  }

  componentWillMount() {
    document.addEventListener("keypress", this.onKeyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPressed.bind(this));
  }

  // seed helper functions
  createSquares(n, arr) {
    if (n == 3) {
      return arr;
    }
    else {
     let level = Array.from(Array(60).fill(null));
     arr.push(level);
     return this.createSquares(n + 1, arr);
    }
  }

  seedFixtures(squares) {
    let fixtures = [[25, 30, 31, 32, 39], [20, 25, 30, 35], [25, 30, 32, 34, 53]];
    fixtures.forEach(function(level, i) {
      level.forEach(function(item, j) {
        squares[i][item] = "F";
      });
    });
    return squares;
  }

  seedReserves(squares) {
    let reserves = [[1, 2, 58], [1, 2, 58], [1, 2]];
    reserves.forEach(function(level, i) {
      level.forEach(function(item, j) {
        squares[i][item] = "R";
      });
    });
    return squares;
  }

  seedStairs(squares) {
    let stairs = [{level:0, index:59, direction:"down"}, {level:1, index:0, direction:"up"},
    {level:1, index:59, direction:"down"}, {level:2, index:0, direction:"up"}];

    stairs.forEach(function(item) {
      squares[item.level][item.index] = item.direction;
    });
    return squares;
  }

  seedMobs(squares, count, index) {
    let mobSeeds = ["goblin1", "goblin2", "orc1"];
    let seeded = false;
    if (index == 3) {
      return squares;
    }
    while (!seeded) {
      let randomIndex = Math.floor(Math.random() * 60);
      if (squares[index][randomIndex] == null) {
        squares[index][randomIndex] = mobSeeds[index];
        seeded = true;
        count++;
      }
    }
    if (count == 4) {
      index++;
      count = 0;
    }
    return this.seedMobs(squares, count, index);
  }

  seedItems(squares, i) {
    let findableItems = [{level: 0, item: "Rune"}, {level: 0, item: "Meatchopper"}, {level: 1, item: "Brooch"},
    {level: 1, item: "Necklace"}, {level: 1, item: "Slicer"},
    {level: 2, item: "Book"}, {level: 2, item: "Iceblade"}, {level: 2, item: "Orb"}];
    let seeded = false;

    if (i == findableItems.length) {
      return squares;
    }
    else {
      while (!seeded) {
        let randomIndex = Math.floor(Math.random() * 60);
        if (squares[this.findableItems[i].level][randomIndex] == null) {
          squares[this.findableItems[i].level][randomIndex] = this.findableItems[i].item;
          seeded = true;
          i++;
        }
      }
      return this.seedItems(squares, i);
    }
}

  // sound

  toggleSound() {
    if (this.state.sound) {
      this.setState({
        sound: false
      })
    }
    else {
      this.setState({
        sound: true
      })
    }
  }

  playSound(audioFile) {
    if (this.state.sound) {
      let newAudio = new Audio(audioFile);
      newAudio.play();
    }
  }

  //control overlays for tips and prompt to revive character

  toggleOverlay() {
    if (this.state.overlay) {
      this.setState({
        overlay: false
      })
    }
    else {
      this.setState({
        overlay: true
      })
    }
  }

  toggleRez() {
    let action = "Scrappy has revived you. Press R to rest."
    let log = this.state.mainLog;
    log.unshift(action);
    this.setState({
      living: true,
      message: "",
      mainLog: log,
      health: this.state.maxHealth
    })
  }

//determine which squares are visible

  checkVisible() {
    let squares = this.state.squares;
    let p = this.state.playerIndex;
    let n = 20;
    let visible = [];
    const aura = [p, p-2, p-1, p+1, p+2, p+3, p-3,
      p-n, p-n-2, p-n-1, p-n+1, p-n+2, p-n+3, p-n-3,
      p+n, p+n-2, p+n-1, p+n+1, p+n+2, p+n+3, p+n-3,
      p-n*2, p-n*2-1, p-n*2+1, p+n*2, p+n*2-1, p+n*2+1,
      p-4, p+4];

    //only set visible what is on grid and eliminate overflow to other rows
    for (let i=0; i<aura.length; i++) {
      if (Math.abs(aura[i] % n - p % n) < 4 && aura[i] >= 0 && aura[i] <= squares.length) {
        visible.push(aura[i]);
      }
    }
    this.setVisible(visible);
    let hidden = [];
    for (let i=0; i<squares.length; i++) {
      if (!visible.includes(i)) {
         hidden.push(i);
      }
    }
    this.setHidden(hidden);
  }

  setVisible(visible) {
      let squares = this.state.squares;
      for (let i=0; i<visible.length; i++) {
      if (visible[i] >= 0) {
       document.getElementById("square" + visible[i]).classList.remove("hidden");
       document.getElementById("square" + visible[i]).classList.add(squares[visible[i]] + "color");
      }
     }
    this.setState({
      squares: squares
    })
  }

  setHidden(hidden) {
    for (let i=0; i<hidden.length; i++) {
      document.getElementById("square" + hidden[i]).className = "hidden";
    }
    this.setState({
      squares: this.state.squares
    })
  }

  //query if item is contained in existing objects

  mobLookup(mob) {
    if (this.mobsInfo.filter(mobInfo => mobInfo.name == mob).length > 0) {
      return true;
    };
  }

  weaponLookup(weapon) {
    if (this.weaponsInfo.filter(weaponInfo => weaponInfo.name == weapon).length > 0) {
      return true;
    }
  }

  questItemLookup(questItem) {
    if (this.questItemsInfo.filter(questItemInfo => questItemInfo.name == questItem).length > 0) {
      return true;
    }
  }

  // main combat functions

  fightMob(mob) {
    for (let i=0; i<this.mobsInfo.length; i++) {
      if (this.mobsInfo[i].name == mob) {
        var mobHash = this.mobsInfo[i];
      }
    }
    //choose mob's special skill
    let mobSpecialIndex = Math.floor(Math.random() * this.mobSkills.length);
    let mobSpecial = this.mobSkills[mobSpecialIndex];
    this.announceMobSpecial(mobSpecial, mobHash.displayName);
    this.setState({
      currentMob: mobHash,
      mobHp: mobHash.health
    });
    this.combatSequence(0, mobSpecial);
}

  combatSequence(round, mobSpecial) {
    //update the mob health on this.state.mobHp not in the {}
    //this.state.playerSpecial gets updated in the keypress listener
    let log = this.state.combatLog;
    let mainLog = this.state.mainLog;
    let mob = this.state.currentMob;
    let playerHealth = this.state.health;
    let mobHealth = this.state.mobHp;
    if (mob.level > this.state.level) {
      var levelDiff =  mob.level - this.state.level;
    }
    else {
      var levelDiff = 0;
    }
    let playerHitChance = this.state.hitChance - .1 * levelDiff;
    let mobHitChance = .7 + .1 * levelDiff;
    if (this.state.playerSpecial == "cloak") {
      playerHitChance -= .2;
      mobHitChance -= .2;
    }
    if (this.state.playerSpecial == "nimble") {
      playerHitChance += .2;
      mobHitChance += .2;
    }
    mobHitChance -= this.state.dodgeChance;
    let attack = this.state.attack;
    if (levelDiff >= this.state.level) {
      var modifiedPlayerAttack = attack;
    }
    else {
      let randomHit = Math.round(Math.random() * this.state.level);
      var modifiedPlayerAttack = attack + randomHit;
    }
    var modifiedMobAttack = mob.attack + (Math.round(Math.random()) * mob.level);

    if (mob.name == "balrog") {
      //mutates mobSpecial and round for boss fight
      switch (round) {
      case 1: {
        var mobSpecial = this.mobSkills[2];
        this.announceMobSpecial(mobSpecial, "Balrog");
        break;
      }
      case 2: {
        this.bossHeal();
        break;
      }
      case 3: {
        if (mobSpecial) {
          this.bossSecondAttack();
        }
        break;
      }
      case 5: {
      //cast ice
        var mobSpecial = this.mobSkills[1];
        this.announceMobSpecial(mobSpecial, "Balrog");
        break;
      }
      case 6: {
        this.bossHeal();
        break;
      }
      case 7: {
        if (mobSpecial) {
          this.bossSecondAttack();
        }
        break;
      }
      case 9: {
        var mobSpecial = this.mobSkills[0];
        this.announceMobSpecial(mobSpecial, "Balrog");
        break;
      }
      case 10: {
        this.bossHeal();
        round = 0;
        break;
      }
      default:
        break;
      }
    }

    let playerRoll = Math.random();

    if (playerRoll <= playerHitChance) {
      this.playSound('https://www.ashlynnpai.com/assets/Swords_Collide-Sound_Explorer-2015600826.mp3');
      mobHealth -= modifiedPlayerAttack;
      let action = "Player hits " + mob.displayName + " for " + modifiedPlayerAttack;
      if (mobHealth < 0) {
        mobHealth = 0;
      }
      log.unshift(action);
    }
    else {
      let action = "Player misses.";
      log.unshift(action);
    }

    mobHealth = this.petAutoAttack(mobHealth);

    if (mobHealth <= 0) {
      if (mob.name == "balrog") {
        this.bossDies(mob);
      }
      this.mobDies(mob);
      return;
    }

    if (mobSpecial) {
      mobSpecial = this.processMobSpecial(mobSpecial, modifiedMobAttack, modifiedPlayerAttack);
    }

    let mobRoll = Math.random();
    if (mobRoll <= mobHitChance) {
      playerHealth -= modifiedMobAttack;
      let action = mob.displayName + " hits you for " + modifiedMobAttack;
      log.unshift(action);
    }
    else {
      let action = mob.displayName + " misses."
      log.unshift(action);
    }
    this.setState({
      health: playerHealth,
      combatLog: log
    });

    if (playerHealth <= 0) {
      this.playerDies(mob);
    }
    setTimeout(this.combatSequence.bind(this), 2000, round, mobSpecial);
  }

  //main combat helper functions

  announceMobSpecial(mobSpecial, mobName) {
    let action = mobName + " " + mobSpecial.action + " " + mobSpecial.name;
    this.playSound('https://www.ashlynnpai.com/assets/sms-alert-5-daniel_simon.mp3');
    this.state.combatLog.unshift(action);
    this.setState({
      combatLog: this.state.combatLog,
      message: action,
      buff: mobSpecial.name
    });
  }

  processMobSpecial(mobSpecial, modifiedMobAttack, modifiedPlayerAttack) {
    let playerHealth = this.state.health;
    let mobHealth = this.state.mobHp;
    let log = this.state.combatLog;
    let mob = this.state.currentMob;
    if (this.state.playerSpecial != mobSpecial.counter) {
      playerHealth -= modifiedMobAttack;
      let action = mob.displayName + " " + mobSpecial.action + " " + mobSpecial.name
      + " for " + modifiedMobAttack;
      log.unshift(action);
    }
    else if (this.state.playerSpecial == mobSpecial.counter) {
      mobHealth -= modifiedPlayerAttack;
      let action = "You counter " + mobSpecial.name + " with " + mobSpecial.counter + " for " + modifiedPlayerAttack;
      if (mobHealth < 0) {
        mobHealth = 0;
      }
      log.unshift(action);
      mobSpecial = null;
    }
    this.setState({
      health: playerHealth,
      mobHp: mobHealth,
      combatLog: log
    });
    return mobSpecial;
  }

  petAutoAttack(mobHealth) {
    let pet = this.state.pet;
    let mob = this.state.currentMob;
    let log = this.state.combatLog;
    if (pet) {
      let petRoll = Math.random();
      if (petRoll <= .8) {
        let petDamage = this.state.level * 2;
        mobHealth -= petDamage;
        let action = "Scrappy hits " + mob.displayName + " for " + petDamage;
        if (mobHealth < 0) {
          mobHealth = 0;
        }
        log.unshift(action);
      }
      else {
        let action = "Scrappy misses.";
        log.unshift(action);
      }
    }
    this.setState({
      mobHp: mobHealth,
      combatLog: log
    });
    return mobHealth;
  }

  mobDies(mob) {
    let log = this.state.combatLog;
    let mainLog = this.state.mainLog;
    let action1 = mob.displayName + " dies.";
    this.state.buff = null;
    log.unshift(action1);
    mainLog.unshift(action1);
    let random = Math.floor(Math.random() * this.dropsHash[mob.level].length);
    let loot = this.dropsHash[mob.level][random];
    this.dropsHash[mob.level].splice(random, 1);
    this.processItem(loot);
    let killXp = 10 * mob.level;
    let xp = this.state.xp
    xp += killXp;
    let action2 = "You receive " + killXp + " xp.";
    mainLog.unshift(action2);
    let mobIndex = this.state.targetIndex;
    let squares = this.state.squares;
    let tip = "Press R to rest and regain health."
    mainLog.unshift(tip);
    squares[mobIndex] = null;
    squares[this.state.playerIndex] = null;
    squares[mobIndex] = "P";
    this.setState({
      mobHp: 0,
      xp: xp,
      combatLog: log,
      mainLog: mainLog,
      message: null,
      playerSpecial: null,
      currentMob: null,
      currentAction: null,
      playerIndex: mobIndex,
      squares: squares
    });
    this.checkLevel();
    return;
  }

  playerDies(mob) {
    let action = "You die."
    let inventory = this.state.inventory;
    let log = this.state.combatLog;
    if (mob.name == "balrog") {
      inventory[0].healthPotion = 6;
      inventory[1].manaPotion = 4;
    }
    log.unshift(action);
    this.setState({
      health: 0,
      living: false,
      combatLog: log,
      message: action,
      currentAction: null,
      inventory: inventory
    });
    return;
  }

  //boss fight functions and helper functions used by main combat function

  startBossFight() {
    let boss = {name: "balrog", displayName: "Balrog", attack: 10, health: 200, level: 4,
      url: "https://www.ashlynnpai.com/assets/balrog11.jpg"};
    this.computeBonus();
    this.setState({
      currentMob: boss,
      currentAction: "combat"
    })
    this.combatSequence(0, null);
  }

  computeBonus() {
    let count = this.state.questItems.length;
    this.state.hitChance += count * .01;
    this.state.dodgeChance += count * .01;
  }

  bossHeal() {
    let mobHealth = this.state.mobHp;
    let log = this.state.combatLog;
    mobHealth += 30;
    if (this.maxBossHealth < mobHealth) {
      mobHealth = this.maxBossHealth;
    }
    this.playSound('https://www.ashlynnpai.com/assets/blessing.ogg');
    let action = "Balrog's flames heal him for 30.";
    log.unshift(action);
    this.setState ({
      combatLog: log,
      mobHp: mobHealth
    })
  }

  bossSecondAttack() {
    let playerHealth = this.state.health;
    let log = this.state.combatLog;
    playerHealth -= 10;
    let action = "Balrog's curse weakens you for 10."
    log.unshift(action);
    this.setState({
      health: playerHealth,
      combatLog: log
    });
  }

  bossDies(mob) {
    let log = this.state.combatLog;
    let mainLog = this.state.mainLog;
    let action = mob.displayName + " dies. You have reclaimed Silverhearth.";
    log.unshift(action);
    mainLog.unshift(action);
    this.setState({
      mobHp: 0,
      combatLog: log,
      mainLog: mainLog,
      message: "You reclaim Silverhearth",
      buff: null,
      playerSpecial: null,
      currentMob: null,
      currentAction: null,
    });
    return;
  }

  // after combat

  regenerateHealth() {
    let health = this.state.health;
    let mana = this.state.mana;
    let maxHealth = this.state.maxHealth;
    let maxMana = this.state.maxMana;
    let energy = this.state.petEnergy;

    if (health >= maxHealth && mana >= maxMana && energy >= this.maxPetEnergy) {
      this.playSound('https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3');
      let action = "You are done resting."
      let log = this.state.mainLog
      log.unshift(action);
      this.setState({
        health: maxHealth,
        mana: maxMana,
        petEnergy: this.maxPetEnergy,
        currentAction: null,
        buff: null,
        mainLog: log
      });
      return;
    }

    health += this.state.level * 2;
    mana += this.state.level * 2;
    energy += this.state.level * 2;
    if (health >= maxHealth) {
     health = maxHealth;
    }
    if (mana >= maxMana) {
      mana = maxMana;
    }
    if (energy >= this.maxPetEnergy) {
      energy = this.maxPetEnergy;
    }

    this.setState({
      health: health,
      mana: mana,
      petEnergy: energy,
      buff: "rest"
    });
    setTimeout(this.regenerateHealth.bind(this), 1000);
  }

  checkLevel() {
    let levelInfo = {1:50, 2:100, 3:200, 4:1000};
    let level = this.state.level;
    let xp = this.state.xp;
    let log = this.state.mainLog;
    if (levelInfo[level] <= xp) {
      xp -= levelInfo[level];
      level++;
      let message = "You are now level " + level;
      this.playSound('https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3');
      log.unshift(message);
      let maxHealth = this.state.maxHealth;
      let maxMana = this.state.maxMana
      maxHealth += 20;
      maxMana += 10;
      this.setState({
        message: message,
        mainLog: log,
        maxHealth: maxHealth,
        maxMana: maxMana,
        health: maxHealth,
        mana: maxMana,
        xp: xp,
        level: level
      })
    }
    return level;
  }

  processItem(item) {
    let inventory = this.state.inventory;
    let equipment = this.state.equipment;
    var hitChance = this.state.hitChance;
    var dodgeChance = this.state.dodgeChance;
    var attack = this.state.attack;
    if(item == "healthPotion") {
      inventory[0].healthPotion++;
      var name = "Health Potion";
    }
    else if (item == "manaPotion") {
      inventory[1].manaPotion++;
      var name = "Mana Potion";
    }
    else {
      let itemInfos = this.itemsInfo;
      for (let i=0; i<itemInfos.length; i++) {
        if (itemInfos[i].name == item) {
          var name = itemInfos[i].name;
          var bonus = itemInfos[i].bonus;
          if (bonus[0] == "hitChance") {
            hitChance += bonus[1];
          }
          else if (bonus[0] == "dodgeChance") {
            dodgeChance += bonus[1];
          }
          else if (bonus[0] == "attack") {
            attack += bonus[1];
          }
          equipment.unshift(itemInfos[i]);
        }
      }
    }
    let action = "You receive " + name + ".";
    let mainLog = this.state.mainLog;
    mainLog.unshift(action);
    this.setState({
      inventory: inventory,
      equipment: equipment,
      hitChance: hitChance,
      dodgeChance: dodgeChance,
      attack: attack,
      mainLog: mainLog
    })
  }

  // items found on grid

  processFindableItems(nextIndex) {
    let retrievedItem = this.findableItems.filter(findableItem => findableItem.index == nextIndex);
    let itemName = retrievedItem[0].item;
    if (this.weaponLookup(itemName)) {
      this.equipWeapon(itemName);
    }
    else if (this.questItemLookup(itemName)) {
      this.processQuestItem(itemName);
    }
  }

  processQuestItem(item) {
    let log = this.state.mainLog;
    let xp = this.state.xp;
    let questItem = this.questItemsInfo.filter(questItemInfo => questItemInfo.name == item);
    let fullName = questItem[0].longName;
    let questDescription = questItem[0].description;
    let action1 = "You find " + fullName + ". " + questDescription;
    log.unshift(action1);
    let questItems = this.state.questItems;
    questItems.unshift(questItem[0]);
    let quest = this.state.quests.filter(quest => quest.item == item);
    quest[0].completed = true;
    let action2 = "You completed " + quest[0].name + " and receive " + quest[0].xp + " xp.";
    log.unshift(action2);
    xp += quest[0].xp;
    this.setState({
      quests: this.state.quests,
      xp: xp,
      mainLog: log,
      questItems: questItems
    })
    this.checkLevel();
  }

  equipWeapon(newWeapon) {
    let squares = this.state.squares;
    let weapons = this.state.weapons;
    let currentSquare = this.state.playerIndex;
    let mainLog = this.state.mainLog;
    let filteredWeapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.name == newWeapon);
    weapons.unshift(filteredWeapons[0]);
    let attack = filteredWeapons[0].attack;
    let action = "You equip " + filteredWeapons[0].name + " for attack " + attack + ". " + filteredWeapons[0].description;
    mainLog.unshift(action);
      this.setState({
        weapons: weapons,
        attack: attack,
        mainLog: mainLog,
        squares: squares
      });
  }

// event handlers and helpers

  endFuryCooldown() {
    this.state.furyCooldown = false;
    document.getElementById("toolbar1").style.border = "3px solid #161616";
  }

  onKeyPressed(e) {
    let currentSquare = this.state.playerIndex;
    let mapLevel = this.state.mapLevel;
    let squares = this.state.squares;
    if (this.state.living) {
      if(!this.state.currentAction){
        if(e.key == 'd' && currentSquare % this.rowSize != this.rowSize - 1){
          var nextSquare = currentSquare + 1;
        }
        else if(e.key =='a' && currentSquare % this.rowSize != 0) {
          var nextSquare = currentSquare - 1;
        }
        else if(e.key =='w' && currentSquare > this.rowSize - 1) {
          var nextSquare = currentSquare - this.rowSize;
        }
        else if(e.key =='s' && currentSquare < this.rowSize * 2 - 1) {
          var nextSquare = currentSquare + this.rowSize;
        }
        else if(e.key == 'r') {
          this.state.currentAction = "resting";
          var nextSquare = currentSquare;
          this.regenerateHealth();
        }
        else {
          return;
        }
        if(squares[mapLevel][nextSquare] == null
          || squares[mapLevel][nextSquare] == "R")
        {
          squares[mapLevel][currentSquare] = null;
          squares[mapLevel][nextSquare] = "P";
          console.log(squares[mapLevel][nextSquare]);
        }
        else if(squares[mapLevel][nextSquare] == "pet") {
 this.playSound('https://www.ashlynnpai.com/assets/Kitten%20Meow-SoundBible.com-1295572573.mp3');
          this.state.pet = true;
          let action = "Scrappy would like to join you on your adventure. You have gained a skill BITE."
          this.state.mainLog.unshift(action);
          squares[mapLevel][currentSquare] = null;
          squares[mapLevel][nextSquare] = "P";
        }
        else if(squares[mapLevel][nextSquare] == "balrog") {
          this.startBossFight();
        }
        else if(this.mobLookup(squares[mapLevel][nextSquare])) {
          this.state.targetIndex = nextSquare;
          this.state.currentAction = "fighting";
          this.fightMob(squares[mapLevel][nextSquare]);
          return;
        }
        else if(squares[mapLevel][nextSquare] == "I") {
          this.processFindableItems(squares[mapLevel][nextSquare]);
          squares[mapLevel][currentSquare] = null;
          squares[mapLevel][nextSquare] = "P";
          this.playSound('https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3');
        }
        else {
          console.log("hi");
          return;
        }
        console.log(squares);
        this.setState({
          playerIndex: nextSquare,
          squares: squares
         });
        if (this.state.darkness) {
          this.checkVisible();
        }
      }
      if (this.state.currentAction) {
        //set a special state and in combat check if state is true
        //only one state can be active at a time
        let log = this.state.combatLog;
        let skillKeys = {1: "fury", 2: "bite", 3: "heal", 4: "mana potion", 5: "health potion",
        6: "water", 7: "fire", 8: "light", 9: "cloak", 0: "nimble"};
        let health = this.state.health;
        let mana = this.state.mana;
        let mobHealth = this.state.mobHp;
        let level = this.state.level;
        let attack = this.state.attack;

        if (e.key in skillKeys) {
          if (e.key =="1") {
            let furyCost = 3;
            if (mana >= furyCost && !this.state.furyCooldown) {
              document.getElementById("toolbar1").style.border = "3px solid red";
              this.state.furyCooldown = true;
              setTimeout(this.endFuryCooldown.bind(this), 5000);
              let furyDamage = level * 2 + attack + Math.round(Math.random() * attack);
              mana -= furyCost;
              mobHealth -= furyDamage;
              if (mobHealth < 0) {
                mobHealth = 0;
              }
              let action = "You use Fury for " + furyDamage + ".";
              log.unshift(action);
            }
            else if (mana < furyCost) {
              let action = "Out of mana.";
              log.unshift(action);
            }
          }
          else if (e.key =="2") {
            let pet = this.state.pet;
            if (pet) {
              var energy = this.state.petEnergy;
              if (energy >= 3) {
                this.playSound('https://www.ashlynnpai.com/assets/Kitten%20Meow-SoundBible.com-1295572573.mp3');
                mobHealth -= (level * 2);
                energy -= 3;
                let action = "Scrappy bites for " + (level * 2) + ".";
                log.unshift(action);
                this.state.petEnergy = energy;
              }
            }
            else {
              let action = "Your mouth is filled with fleas but you do no damage.";
              log.unshift(action);
            }
          }
          else if (e.key =="3") {
            if (mana >= 4) {
              health += 10;
              if (health > this.state.maxHealth) {
                health = this.state.maxHealth;
              }
              mana -= 4;
              this.playSound('https://www.ashlynnpai.com/assets/blessing.ogg');
              let action = "You cast heal for 10 health.";
              log.unshift(action);
            }
            else {
              let action = "Out of mana.";
              log.unshift(action);
            }
          }
          else if (e.key =="4") {
            if (this.state.inventory[1].manaPotion > 0) {
              mana += 10;
              if (mana > this.state.maxMana) {
                mana = this.state.maxMana;
              }
              this.playSound('https://www.ashlynnpai.com/assets/blessing2.ogg');
              let action = "You consume mana potion.";
              log.unshift(action);
              this.state.inventory[1].manaPotion--;
            }
          }
          else if (e.key =="5") {
            if (this.state.inventory[0].healthPotion > 0) {
              health += 10;
              if (health > this.state.maxHealth) {
                health = this.state.maxHealth;
              }
              this.playSound('https://www.ashlynnpai.com/assets/blessing.ogg');
              let action = "You consume health potion.";
              log.unshift(action);
              this.state.inventory[0].healthPotion--;
            }
          }
          else if (e.key == "6" || e.key == "7" || e.key == "8" || e.key == "9" || e.key == "0") {
            let sounds = [
              {6: 'https://www.ashlynnpai.com/assets/water.ogg'},
              {7: 'https://www.ashlynnpai.com/assets/flamethrower.ogg'},
              {8: 'https://www.ashlynnpai.com/assets/blessing.ogg'},
              {9: 'https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3'},
              {0: 'https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3'}
            ]

            let skill = skillKeys[e.key];
            this.state.playerSpecial = skill;
            let action = "You use " + skill;
            this.playSound(sounds[e.key]);
            var buff = this.state.buff;
            buff = skill;
            log.unshift(action);
            this.setState({
              buff: buff
            })
          }
          this.setState({
            health: health,
            mobHp: mobHealth,
            mana: mana,
            combatLog: log,
          })
        }
        else {
          return;
        }
      }
    }
  }

  render() {
    let mapLevel = this.state.mapLevel;
    let renderedSquares = this.state.squares[mapLevel];

    let health = this.state.health;
    let healthPercent = Math.round((health/this.state.maxHealth)*100);
    if (healthPercent > 70) {
      var healthColor = "green";
    }
    else if (healthPercent > 30) {
      var healthColor = "yellow";
    }
    else {
      var healthColor = "red";
    }
    var healthBar = {
      width: healthPercent + "%",
      color: "#fff"
    };

    let mana = this.state.mana;
    let manaPercent = Math.round((mana/this.state.maxMana)*100);
    var manaBar = {
      width: manaPercent + "%",
      color: "#fff"
    };

    let pet = this.state.pet;
    let petUrl = "https://www.ashlynnpai.com/assets/yoppy.png";
    if (pet) {
      var petEnergy = this.state.petEnergy;
      var maxPetEnergy = this.maxPetEnergy;
      var petEnergyPercent = Math.round((petEnergy/maxPetEnergy)*100);
      var petEnergyBar = {
        width: petEnergyPercent + "%",
        color: "#fff"
      };
    }

    let mob = this.state.currentMob;
      if (mob) {
        var mobUrl = mob.url;
        var mobHealth = this.state.mobHp;
        var mobMaxHealth = mob.health;
        var mobHealthPercent = Math.round((mobHealth/mobMaxHealth)*100);
        if (mobHealthPercent > 70) {
          var mobHealthColor = "green";
        }
        else if (mobHealthPercent > 30) {
          var mobHealthColor = "yellow";
        }
        else {
          var mobHealthColor = "red";
        }
        var mobHealthBar = {
          width: mobHealthPercent + "%",
          color: "#fff"
        };
    }

    let levelInfo = {1:50, 2:100, 3:200, 4:1000};
    let level = this.state.level;
    var xpGoal = levelInfo[level];
    let xpPercent = Math.round((this.state.xp/xpGoal)*100);
    var xpBar = {
        width: xpPercent + "%",
        color: "#fff"
    };

    const specialSkills = [
{number: 6, name: "FLOOD", description: "A spray of water from your flask extinguishes flame."},
{number: 7, name: "FIRE", description: "Flame from your torch melts spears of ice."},
{number: 8, name: "LIGHT", description: "Light banishes the shadow."},
{number: 9, name: "CLOAK", description: "Decreases both your and your enemys chance to hit."},
{number: 0, name: "NIMBLE", description: "Increases both your and your enemys chance to hit."}
 ]

    const buffs = [
      {name: "water", url: "https://www.ashlynnpai.com/assets/horropen_water.png", type: "good"},
      {name: "fire", url: "https://www.ashlynnpai.com/assets/14.png", type: "good"},
      {name: "light", url: "https://www.ashlynnpai.com/assets/18.png", type: "good"},
      {name: "cloak", url: "https://www.ashlynnpai.com/assets/horrorpen_124.png", type: "good"},
      {name: "nimble", url: "https://www.ashlynnpai.com/assets/70.png", type: "good"},
      {name: "Firebomb", url: "https://www.ashlynnpai.com/assets/Wall%20of%20Fire.png", type: "bad"},
      {name: "Ice Spars", url: "https://www.ashlynnpai.com/assets/Blizzard.png", type: "bad"},
      {name: "Shadow", url: "https://www.ashlynnpai.com/assets/shadow.png", type: "bad"},
      {name: "rest", url: "https://www.ashlynnpai.com/assets/Tent-Sleep-icon.png", type: "good"}
    ]

    var weapon = this.state.weapons[0].name;

    if (this.state.buff) {
      let currentBuff = buffs.filter(b => b.name == this.state.buff);
      var buffUrl = currentBuff[0].url;
      if (currentBuff[0].type == "good") {
        var buffStyle = {
          border: '3px solid #000'
        };
      }
      else {
        var buffStyle = {
          border: '3px solid red'
        };
      }
    }
    else {
      var buffUrl = null;
    }

    var questsCompleted = [];
    var questsCurrent = [];

    for (i=0; i<this.state.quests.length; i++) {
      if (this.state.quests[i].completed) {
        questsCompleted.unshift(this.state.quests[i]);
      }
      else {
        questsCurrent.unshift(this.state.quests[i]);
      }
    }


    return (
      <div onKeyPress={(e) => this.onKeyPressed(e)}>
      <div className = "main">
        {this.state.overlay ? (
        <div className="overlay">
          <div>
            <Tips />
            <button onClick={() => this.toggleOverlay()} className="overlayButton">
              <img width="50" src="https://www.ashlynnpai.com/assets/greatsword.png" />
            </button>
            <div>Click to close</div>
          </div>
        </div>
          ) : (
        <div>
        </div>
        )}
        {!this.state.living ? (
        <div className="rezOverlay">
          <div>
            <Rez />
            <button onClick={() => this.toggleRez()} className="overlayButton">
              <h1>YES</h1>
            </button>
          </div>
        </div>
          ) : (
        <div>
        </div>
        )}

      <div className = "ui">
        <div>
          {this.state.sound ? (
            <div>
              <img onClick={() => this.toggleSound()} width="40" src="https://www.ashlynnpai.com/assets/if_speaker_40842.png" />
            </div>
          ) : (
            <div>
              <img onClick={() => this.toggleSound()} width="40" src="https://www.ashlynnpai.com/assets/if_speaker_mute_40843.png" />
            </div>
          )}
          <div>
            <img onClick={() => this.toggleOverlay()} width="40" src="https://www.ashlynnpai.com/assets/if_help_black_40796.png" />
          </div>
        </div>
        <div>
          {pet ? (
            <div className="avatar" id="petAvatar">
              <img width="30" src="https://www.ashlynnpai.com/assets/yoppy.jpg" />
            </div>
          ) : (
            <div className = "blankAvatar">
            </div>
          )}
        </div>
        <div>
          {pet ? (
             <div>
               <div className="petNameplate">
                <div>Scrappy</div>
               </div>
               <div className={"orange progress-bar"} id="petBar">
                <span style={petEnergyBar}>{petEnergy}/{maxPetEnergy}</span>
               </div>
             </div>
            ) : (
              <div className="blankPet">
              </div>
            )}
       </div>

        <div>
          <div className = "avatar">
            <img src ="https://www.ashlynnpai.com/assets/Jinn_hero2.png" />
          </div>
        </div>
        <div>
          <div className = "nameplate">
            <div>Hero</div>
          </div>
          <div className = {healthColor + " progress-bar"}>
            <span style={healthBar}>{health}/{this.state.maxHealth}</span>
          </div>
          <div className = {"blue progress-bar"}>
            <span style={manaBar}>{mana}/{this.state.maxMana}</span>
          </div>
          <div className="buffSection">
            <img style={buffStyle} width="30" src={buffUrl}/>
          </div>
        </div>


        <div>
          {mob ? (
            <div>
              <div className = "nameplate">
                <div>{mob.displayName}</div>
              </div>
              <div className = {mobHealthColor + " progress-bar"}>
                <span style={mobHealthBar}>{mobHealth}/{mobMaxHealth}   </span>
              </div>
            </div>
            ) : (
            <div className = "blankMob">
            </div>
            )}
          </div>
          <div>
          {mob ? (
            <div>
              <div className = "avatar">
                <img src ={mob.url} />
              </div>
            </div>
          ) : (
             <div className = "blankAvatar">
             </div>
          )}
        </div>
     </div>

     <div className="topInfo">
       <div className="fastStats">
          <p>Level {this.state.level}</p>
          <p>{weapon}</p>
          <p>Attack {this.state.attack}</p>
       </div>
       <div className="fastStats">
         <p>Hit {this.state.hitChance.toFixed(2)} </p>
         <p>Dodge {this.state.dodgeChance.toFixed(2)} </p>
        </div>
        <div className="messageDisplay">{this.state.message}</div>
     </div>
    <div className="boardBackground">
      <div className="board">
        {renderedSquares.map((square,index) =>
         <div className={square + "color"}  id={"square" + index} key={index}>{index} {square}
           <div className='squareInfo'>
             {(() => {
               switch (square) {
                 case "goblin1": return "Goblin Footsoldier Level 1";
                 case "goblin2": return "Goblin Lieutenant Level 2";
                 case "orc1": return "Orc Captain Level 3";
                 case "balrog": return "Balrog Firelord Boss";
                 case "pet": return "Sleeping Cat";
               }
             })()}
           </div>
         </div>)}
      </div>
    </div>
    <div className='ui'>
      <div>
        <div className = "blue xp-bar">
           <span style={xpBar}>{this.state.xp}/{xpGoal}XP</span>
         </div>
        <div className="toolbar">
          <span id="toolbar1" className="toolbarItem">1
            <div className="toolbarTip">
              <p id="offensive">FURY</p>
              <p id="skillCost">Costs 3 mana. Cooldown 5 seconds.</p>
              <div id="skillDescription">You become enraged and land a forceful hit on your enemy.</div>
            </div>
          </span>
          <span id="toolbar2" className="toolbarItem">2
            {pet ? (
            <div className="toolbarTip">
              <p id="offensive">BITE</p>
              <p id="skillCost">Costs 5 energy</p>
              <div id="skillDescription">Scrappys bite wounds the enemy.</div>
            </div>
            ) : (
            <div className="toolbarTip">
              <p id="offensive">BITE</p>
              <div id="skillDescription">Do you really want to bite your target?</div>
            </div>
            )}
          </span>
          <span id="toolbar3" className="toolbarItem">3
            <div className="toolbarTip">
              <p id="defensive">HEAL</p>
              <p id="skillCost">Costs 5 mana.</p>
              <div id="skillDescription">HEAL yourself for half your total health.</div>
             </div>
          </span>
          <span id="toolbar4" className="toolbarItem">4
            <div className="potionCount">{this.state.inventory[1].manaPotion}</div>
            <div className="toolbarTip">
              <p id="defensive">MANA POTION</p>
              <p id="skillCost">Consumes one potion.</p>
              <div id="skillDescription">Restores 10 mana.</div>
            </div>
          </span>
          <span id="toolbar5" className="toolbarItem">5
             <div className="potionCount">{this.state.inventory[0].healthPotion}</div>
             <div className="toolbarTip">
               <p id="defensive">HEALING POTION</p>
               <p id="skillCost">Consumes one potion.</p>
               <div id="skillDescription">Restores 10 health.</div>
             </div>
          </span>
        </div>
        <div className="toolbar">
           {specialSkills.map((skill) =>
            <span id={"toolbar"+skill.number} className="toolbarItem">{skill.number}
            <div className="toolbarTip">
              <p id="offensive">{skill.name}</p>
              <div id="skillDescription">{skill.description}</div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
         )}
         </div>
        <div className = "toolbar" id = "questItems">
          {this.state.questItems.map((questItem) =>
            <span><img src={questItem.url}></img></span>)}
           </div>
      </div>

      <div className="display-log">
        {this.state.mainLog.map((logLine) =>
       <div id="logLine">{logLine}</div>)}
      </div>
      <div className="display-log">
        {this.state.combatLog.map((combatEvent) =>
       <div id="logLine">{combatEvent}</div>)}
      </div>
    </div>
    <div className = "bottom">
      <div className="questLog">
        <p>Quests</p>
        {questsCurrent.map((current) =>
          <div className="questLogEntry">
            <div className="questLogName">{current.name}</div>
            <div className="questLogDescription">{current.description}</div>
          </div>
        )}
        {questsCompleted.map((complete) =>
          <div className="questLogEntry">
            <div className="questLogName">
              <img margin-right="5" src="https://www.ashlynnpai.com/assets/Coin_03.png" />
              {complete.name}
            </div>
            <div className="questLogDescription">{complete.description}</div>
          </div>
        )}
      </div>
      <div className="equipment">
        {this.state.weapons.map((w) =>
         <div>
           <img src={w.url} />
           <div>{w.name}</div>
         </div>
        )}
      </div>
      <div className="equipment">
        {this.state.equipment.map((piece) =>
         <div>
           <img src={piece.url} />
           <div>{piece.description}</div>
         </div>
        )}
      </div>
    </div>
  </div>
</div>
);
}}

const Rez = () => {
  return (
    <div>
      <h2>Want Rez?</h2>
      <p>Scrappy would like to revive you.</p>
      <div><img width="90" src="https://www.ashlynnpai.com/assets/yoppy.jpg" /></div>
    </div>
)};

const Tips = () => {
  return (
  <div className="tips">
    <h1>Silverhearth</h1>
    <p>The dwarven halls of Silverhearth have been overrun by goblins. Discover
      what leads them and destroy it.</p>
    <h3>Movement</h3>
    <span className="shortcutKey">W</span>
    <span className="shortcutKey">A</span>
    <span className="shortcutKey">S</span>
    <span className="shortcutKey">D</span>
    <p>Move into an occupied square to fight monsters or open chests.</p>
    <p>Stairs between levels are located at the ends of each hall.</p>
    <h3>Combat</h3>
    <span className="shortcutKey">1</span> -
    <span className="shortcutKey">0</span>
    <p>Combat is interactive. Mouse over the skill toolbar to read
      the tooltips. Press keys 1-0 to use skills.</p>
    <p>There is an autoattack but to beat the game you should use
      your skills.</p>
    <h3>Rest</h3>
    <span className="shortcutKey">R</span>
    <p>Press r to rest and regenerate health and mana. Your character
      cannot move until it is done resting.</p>
  </div>
)};

ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
