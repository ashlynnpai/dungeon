class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 10;
    this.maxPetEnergy = 10;
    this.mobsInfo = [{name: "goblin1", displayName: "Goblin Footsoldier", attack: 1, health: 20, level: 1,
    url: "https://www.ashlynnpai.com/assets/Jinn_goblin.png"},
    {name: "goblin2", displayName: "Goblin Lieutenant", attack: 2, health: 30, level: 2,
    url: "https://www.ashlynnpai.com/assets/Jinn_goblin.png"},
    {name: "orc1", displayName: "Orc Captain", attack: 3, health: 50, level: 3,
    url: "https://www.ashlynnpai.com/assets/Jinn_orc.png"}
    ];
    this.weaponsInfo = [{name: "Hands", attack: 1, description: "These are deadly weapons."},
    {name: "Meatchopper", attack: 2, description: "A rusty knife from someone's kitchen"},
    {name: "Slicer", attack: 3, description: "Finally, a decent weapon worthy of your skills."},
    {name: "Iceblade", attack: 5, description: "A legendary sword forged by the dwarves."}
  ];
    this.itemsInfo = [{name: "Boots", bonus: ["dodgeChance", .03], url: "https://www.ashlynnpai.com/assets/Light%20Boot_1.png", description: "Dodge +.03"},
    {name: "Bracers", bonus: ["hitChance", .03], url: "https://www.ashlynnpai.com/assets/Leather%20Bracelet_1.PNG", description: "Hit +.03"},
    {name: "Helm", bonus: ["hitChance", .04], url: "https://www.ashlynnpai.com/assets/Light%20Helm_1.PNG", description: "Hit +.04"},
    {name: "Belt", bonus: ["dodgeChance", .04], url: "https://www.ashlynnpai.com/assets/Light%20Belt_1.png", description: "Dodge +.04"},
    {name: "Gloves", bonus: ["attack", 1], url: "https://www.ashlynnpai.com/assets/Leather%20Glove_1.png", description: "Attack +1"},
    {name: "Breastplate", bonus: ["hitChance", .05], url: "https://www.ashlynnpai.com/assets/Light%20Armor_1.png", description: "Hit +.05"}
  ];
  this.findableItems = [{index: 9, item: "Rune"}, {index: 11, item: "Meatchopper"}, {index: 59, item: "Brooch"},
{index: 110, item: "Necklace"}, {index: 114, item: "Slicer"},
{index: 119, item: "Book"}, {index: 152, item: "Iceblade"}, {index: 190, item: "Orb"}];
    this.questItemsInfo = [{name: "Rune", longName: "Rune of Narheru", description:
    "This rune was created by the elves for protection.", url: "https://www.ashlynnpai.com/assets/Ruin%20Stone_01.png"},
    {name: "Brooch", longName: "Brooch of Wisdom", description:
    "Grants enlightenment.", url: "https://www.ashlynnpai.com/assets/Ornament_03.png"},
    {name: "Necklace", longName: "Necklace of Flight", description:
    "You feel lighter than air.", url: "https://www.ashlynnpai.com/assets/Necklace_03.png"},
    {name: "Book", longName: "Book of the Art of Combat", description:
    "You have learned the secrets of swordplay.", url: ""}, {name: "Orb", longName: "Orb of Seeing", description:
    "You see into your enemys mind.", url: ""}];
    this.dropsHash = {1: ["Boots", "healthPotion", "manaPotion", "healthPotion", "Bracers"],
      2: ["Helm", "healthPotion", "manaPotion", "healthPotion", "Belt"],
      3: ["Gloves", "healthPotion", "manaPotion", "manaPotion", "Breastplate"]
      };
    this.mobSkills = [{name: "Firebomb", action: "throws", counter: "water"}, {name: "Ice Spars", action: "summons", counter: "fire"},
    {name: "Shadow", action: "casts", counter: "light"}];
    const startPoint = 0;

    let squares = Array(this.size).fill("S");
    let level1 = Array.from(Array(10).keys())
    let room1 = [3, 4, 12, 13, 14, 20, 21, 22, 23, 24, 25, 30];
    let room2 = [16, 17, 18, 26, 27, 28, 29, 39, 38, 37, 36, 35, 49, 59, 58, 57];
    let hall1 = [40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 60, 61, 61, 62, 62, 63, 63, 64, 64, 65, 66];
    level1.push.apply(level1, room1.concat(room2).concat(hall1));

    let room3 = [75, 76, 77, 78, 79, 89, 88, 87, 86, 96, 97, 98, 99];
    let room4 = [85, 84, 83, 82, 81, 80, 90, 91, 92, 93, 100, 101, 102, 103, 110, 111, 112];
    let room5 = [104, 105, 106, 107, 108, 109, 119, 118, 117, 116, 115, 114, 113]
    let miniboss = [126, 127, 128, 136, 137, 138, 139, 146, 147, 148];
    let level2 = []
    level2.push.apply(level2, room3.concat(room4).concat(room5).concat(miniboss));


    let room6 = [135, 134, 133, 132, 131, 130, 145, 144, 143, 142, 141, 140];
    let room7 = [150, 151, 152, 160, 161, 162, 170, 171, 172, 180, 181, 190, 191];
    let room8 = [163, 164, 165, 166, 167, 168, 169, 173, 174, 175, 176, 177, 178, 179];
    let boss = [185, 186, 187, 188, 189, 195, 196, 197, 198, 199]
    let level3= [];
    level3.push.apply(level3, room6.concat(room7).concat(room8).concat(boss));
    let spaces = level1.concat(level2).concat(level3);

    for (let i=0; i<squares.length; i++) {
      if(spaces.includes(i)) {
        squares[i] = null;
      }
    }
    //make a copy of empty squares for modification
    let spacesCopy = spaces.slice();
    //seed the player and remove the square from empty squares
    squares[startPoint] = "P";
    spacesCopy.splice(startPoint, 2);
    //seed the pet
    let petStartPoint = 79;
    squares[petStartPoint] = "pet";
    let petIndex = spacesCopy.indexOf(petStartPoint);
    spacesCopy.splice(petIndex, 1);

    // seed the findable items (quest items and weapons)

    for (let i=0; i<this.findableItems.length; i++) {
      let itemIndex = this.findableItems[i].index;
      squares[itemIndex] = "I";
      let indexOfSpacesCopy = spacesCopy.indexOf(itemIndex);
      spacesCopy.splice(indexOfSpacesCopy, 1);
     }

    let seeds = [{room: room1, amount: 1, mob: "goblin1"}, {room: room2, amount: 2, mob: "goblin1"},
  {room: hall1, amount: 2, mob: "goblin1"}, {room: room3, amount: 1, mob: "goblin2"}, {room: room4, amount: 2, mob: "goblin2"},
  {room: room5, amount: 2, mob: "goblin2"}, {room: room6, amount: 1, mob: "orc1"}, {room: room7, amount: 2, mob: "orc1"},
  {room: room8, amount: 2, mob: "orc1"}
   ];

    for (let i=0; i<seeds.length; i++) {
      for (let j=0; j<seeds[i].amount; j++) {
        let seededMob = false;
        while (!seededMob) {
          let mobIndex = Math.floor(Math.random() * seeds[i].room.length);
          let squareChoice = seeds[i].room[mobIndex];
          if (spacesCopy.includes(squareChoice)) {
            squares[squareChoice] = seeds[i].mob;
            let indexOfSpacesCopy = spacesCopy.indexOf(mobIndex);
            spacesCopy.splice(indexOfSpacesCopy, 1);
            seededMob = true;
          }
        }
      }
    }

    this.state = {
      squares: squares,
      hidden: [],
      player_index: startPoint,
      yCoord: 0,
      health: 20,
      maxHealth: 20, //has to increase on level
      mana: 10,
      maxMana: 10, //has to increase on level
      level: 1,
      xp: 0,
      hitChance: .70,
      dodgeChance: 0,
      specialSkill: null,
      pet: true,
      petEnergy: 10,
      living: true,
      weapons: ["Hands"],
      attack: 1,
      inventory: [{healthPotion: 1}, {manaPotion: 0}],
      equipment: [],
      questItems: [],
      quests: [
       {name: "Find the Orb", description: "Find the Orb.",
        item: "Orb", completed: false, xp: 30},
       {name: "Find the Book", description: "Find the Book.",
       item: "Book", completed: false, xp: 20},
       {name: "Find the Necklace", description: "Find the Necklace.",
       item: "Necklace", completed: false, xp: 20},
       {name: "Find the Brooch", description: "Find the brooch.",
       item: "Brooch", completed: false, xp: 10},
       {name: "A Small Clue", description: "This hall was built by the dwarves. Find some clue about what happened here.",
       item: "Rune", completed: false, xp: 10}
      ],
      current_mob: "",
      mob_hp: 0,
      targetIndex: null,
      currentAction: null,
      mainLog: [],
      combatLog: [],
      message: ""
      };
  }

  componentWillMount() {
    document.addEventListener("keypress", this.onKeyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPressed.bind(this));
  }

  checkVisible() {
    let squares = this.state.squares;
    let p = this.state.player_index;
    let r = Math.floor(p/10);
    let n = 10;
    let visible = [];
    const aura = [p, p-2, p-1, p+1, p+2, p-n-2, p-n-1, p-n, p-n+1, p-n+2, p+n-2, p+n-1, p+n, p+n+1, p+n+2, p+3, p-3, p-n-3, p-n+3, p+n-3, p+n+3, p-n*2, p+n*2, p-n*2-1, p-n*2+1, p+n*2+1, p+n*2-1, p+4, p-n+4,p+n+4];
    for (let i=0; i<aura.length; i++) {
      if (Math.abs(aura[i]%10-p%10)<4 && aura[i]>=0 && aura[i]<=squares.length) {
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
    let squares = this.state.squares;
    this.setState({
      squares: squares
    })
  }

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

  fightMob(mob) {
    for (let i=0; i<this.mobsInfo.length; i++) {
      if (this.mobsInfo[i].name == mob) {
        var mobHash = this.mobsInfo[i];
      }
    }
    //choose mob's special skill
    let mobSpecialIndex = Math.floor(Math.random() * this.mobSkills.length);
    let mobSpecial = this.mobSkills[mobSpecialIndex];
    let action = mobHash.displayName + " " + mobSpecial.action + " " + mobSpecial.name;
    this.state.combatLog.unshift(action);
    this.setState({
      current_mob: mobHash,
      mob_hp: mobHash.health,
      combatLog: this.state.combatLog,
      message: action
    });
    this.combatSequence(mobSpecial);
  }

  combatSequence(mobSpecial) {
    //update the mob health on this.state.mob_hp not in the {}
    //this.state.playerSpecial gets updated in the keypress listener
    let log = this.state.combatLog;
    let mainLog = this.state.mainLog;
    let mob = this.state.current_mob;
    let playerHealth = this.state.health;
    let mobHealth = this.state.mob_hp;
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
    let playerRoll = Math.random();

    if (playerRoll <= playerHitChance) {
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

    let pet = this.state.pet;
    if (pet) {
      let petRoll = Math.random();
      if (petRoll <= .8) {
        let petDamage = this.state.level;
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
      mob_hp: mobHealth,
      combatLog: log
    });

    if (mobHealth <= 0) {
      let action1 = mob.displayName + " dies.";
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
      let level = this.checkLevel();
      let mobIndex = this.state.targetIndex;
      let squares = this.state.squares;
      let tip = "Press R to rest and regain health."
      mainLog.unshift(tip);
      squares[mobIndex] = null;
      squares[this.state.player_index] = null;
      squares[mobIndex] = "P";
      this.setState({
        mob_hp: 0,
        xp: xp,
        level: level,
        combatLog: log,
        mainLog: mainLog,
        playerSpecial: null,
        current_mob: null,
        currentAction: null,
        player_index: mobIndex,
        squares: squares
      });
      return;
    }

    if (mobSpecial) {
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
    }
    this.setState({
      health: playerHealth,
      mob_hp: mobHealth,
      combatLog: log
    });

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
      let action = "You die."
      log.unshift(action);
      this.setState({
        health: 0,
        living: false,
        combatLog: log,
        message: action
        //death scene
      });
      return;
    }
    setTimeout(this.combatSequence.bind(this), 2000, mobSpecial);
  }

  regenerateHealth() {
    let health = this.state.health;
    let mana = this.state.mana;
    let maxHealth = this.state.maxHealth;
    let maxMana = this.state.maxMana;
    let energy = this.state.petEnergy;

    if (health >= maxHealth && mana >= maxMana && energy >= this.maxPetEnergy) {
      this.setState({
        health: maxHealth,
        mana: maxMana,
        petEnergy: this.maxPetEnergy,
        currentAction: null
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
      petEnergy: energy
    });
    setTimeout(this.regenerateHealth.bind(this), 1500);
  }

  checkLevel() {
    let levelInfo = {1:50, 2:150, 3:300, 4:1000};
    let level = this.state.level;
    let xp = this.state.xp;
    let log = this.state.mainLog;
    if (levelInfo[level] <= xp) {
      level++;
      let message = "You are now level " + level;
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
        xp: 0,
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
  }

  equipWeapon(newWeapon) {
    let squares = this.state.squares;
    let weapons = this.state.weapons;
    let currentSquare = this.state.player_index;
    weapons.unshift(newWeapon);
    let message = "You equip " + weapons[0];
    let mainLog = this.state.mainLog;
    let filteredWeapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.name == weapons[0]);
    let attack = filteredWeapons[0].attack;
    mainLog.unshift(message);
      this.setState({
        weapons: weapons,
        attack: attack,
        mainLog: mainLog,
        squares: squares
      });
  }

  onKeyPressed(e) {
    let current_square = this.state.player_index;
    let squares = this.state.squares;
    let boardDiv = document.getElementById("board");
    if (this.state.living) {
      if(!this.state.currentAction){
        if(e.key == 'd' && current_square % 10 != 9){
          var next_square = current_square + 1;
        }
        else if(e.key =='a' && current_square % 10 != 0) {
          var next_square = current_square - 1;
        }
        else if(e.key =='w' && current_square > 9) {
          var next_square = current_square - this.rowSize;
           if(squares[next_square] == null) {
            let yCoord = this.state.yCoord;
            yCoord -= 75
            this.setState({
              yCoord: yCoord
            })
            boardDiv.scrollTo(0, yCoord);
          }
        }
        else if(e.key =='s' && current_square < 190) {
          var next_square = current_square + this.rowSize;
          if(squares[next_square] == null) {
            let yCoord = this.state.yCoord;
            yCoord += 75
            this.setState({
              yCoord: yCoord
            })
            boardDiv.scrollTo(0, yCoord);
          }
        }
        else if(e.key == 'r') {
          this.state.currentAction = "resting";
          var next_square = current_square;
          this.regenerateHealth();
        }
        else {
          return;
        }
        if(squares[next_square] == null) {
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(squares[next_square] == "pet") {
          this.state.pet = true;
          let action = "Scrappy would like to join you on your adventure. You have gained a skill BITE."
          this.state.mainLog.unshift(action);
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(this.mobLookup(squares[next_square])) {
          //this.state.current_mob = squares[next_square];
          this.state.targetIndex = next_square;
          this.state.currentAction = "fighting";
          this.fightMob(squares[next_square]);
          return;
        }
        else if(squares[next_square] == "I") {
          this.processFindableItems(next_square);
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else {
          return;
        }
        this.setState({
          player_index: next_square,
          squares: squares
         });
        this.checkVisible();
        }
      if (this.state.currentAction) {
        //set a special state and in combat check if state is true
        //only one state can be active at a time
        let log = this.state.combatLog;
        let skillKeys = {1: "Fury", 2: "whatever", 3: "heal", 4: "mana potion", 5: "health potion",
        6: "water", 7: "fire", 8: "light", 9: "cloak", 0: "nimble"};
        let health = this.state.health;
        let mana = this.state.mana;
        let mobHealth = this.state.mob_hp;
        let level = this.state.level;
        let attack = this.state.attack;

        if (e.key in skillKeys) {
          if (e.key =="1") {
            if (mana >= 3) {
              let furyDamage = level * 2 + attack + Math.round(Math.random() * attack);
              mana -= 3;
              mobHealth -= furyDamage;
              if (mobHealth < 0) {
                mobHealth = 0;
              }
              let action = "You use Fury for " + furyDamage + ".";
              log.unshift(action);
            }
            else {
              let action = "Out of mana.";
              log.unshift(action);
            }
          }
          else if (e.key =="2") {
            let pet = this.state.pet;
            if (pet) {
              var energy = this.state.petEnergy;
              if (energy >= 5) {
                mobHealth -= (level * 2);
                energy -= 5;
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
              mana -= 4;
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
              this.state.inventory[1].manaPotion--;
            }
            let action = "You consume mana potion.";
            log.unshift(action);
          }
          else if (e.key =="5") {
            if (this.state.inventory[0].healthPotion > 0) {
              health += 10;
              this.state.inventory[0].healthPotion--;
            }
            let action = "You consume health potion.";
            log.unshift(action);
          }
          else if (e.key == "6" || e.key == "7" || e.key == "8" || e.key == "9" || e.key == "0") {
            let skill = skillKeys[e.key];
            this.state.playerSpecial = skill;
            let action = "You use " + skill;
            log.unshift(action);
          }
          this.setState({
            health: health,
            mob_hp: mobHealth,
            mana: mana,
            combatLog: log
          })
        }
        else {
          return;
        }
      }
    }
  }

  render() {
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

    let mob = this.state.current_mob;
      if (mob) {
        var mobUrl = mob.url;
        var mobHealth = this.state.mob_hp;
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

    var weapon = this.state.weapons[0];

    let levelInfo = {1:50, 2:100, 3:200};
    let level = this.state.level;
    var xpGoal = levelInfo[level];
    let xpPercent = Math.round((this.state.xp/xpGoal)*100);
    var xpBar = {
        width: xpPercent + "%",
        color: "#fff"
    };

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
      <div className = "ui">
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
               <div className="nameplate" id="petNameplate">
                <div>Scrappy</div>
               </div>
               <div className={"orange progress-bar"} id="petBar">
                <span style={petEnergyBar}>{petEnergy}/{maxPetEnergy}</span>
               </div>
             </div>
            ) : (
              <div className = "blankMob">
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
        </div>


        <div>
          {mob ? (
            <div>
              <div className = "nameplate">
                <div>{mob.displayName}</div>
              </div>
              <div className = {mobHealthColor + " progress-bar"}>
                <span style={mobHealthBar}>{mobHealth}/{mobMaxHealth}</span>
              </div>
              <div className = {mobHealthColor + " progress-bar"}>
                <span style={mobHealthBar}>{mobHealth}/{mobMaxHealth}</span>
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
          <p>Hit {this.state.hitChance} </p>
          <p>Dodge {this.state.dodgeChance} </p>
        </div>
        <div className="messageDisplay">{this.state.message}</div>
     </div>

    <div id="board" className="flex-container" >
      {this.state.squares.map((square,index) =>
       <div className={square + "color"}  id={"square" + index} key={index}>{index} {square}
         <div className='squareInfo'>
           {(() => {
             switch (square) {
               case "goblin1": return "Goblin Footsoldier Level 1";
               case "goblin2": return "Goblin Lieutenant Level 2";
               case "orc1": return "Orc Captain Level 3";
             }
           })()}
         </div>
       </div>)}
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
              <p id="skillCost">Costs 2 mana.</p>
              <div>You become enraged and land a forceful hit on your enemy.</div>
            </div>
          </span>
          <span id="toolbar2" className="toolbarItem">2
            {pet ? (
            <div className="toolbarTip">
              <p id="offensive">BITE</p>
              <p id="skillCost">Costs 5 energy</p>
              <div>Scrappys bite wounds the enemy.</div>
            </div>
            ) : (
            <div className="toolbarTip">
              <p id="offensive">BITE</p>
              <div>Do you really want to bite your target?</div>
            </div>
            )}
          </span>
          <span id="toolbar3" className="toolbarItem">3
            <div className="toolbarTip">
              <p id="defensive">HEAL</p>
              <p id="skillCost">Costs 5 mana.</p>
              <div>HEAL yourself for half your total health.</div>
             </div>
          </span>
          <span id="toolbar4" className="toolbarItem">4
            <div className="potionCount">{this.state.inventory[1].manaPotion}</div>
            <div className="toolbarTip">
              <p id="defensive">MANA POTION</p>
              <p id="skillCost">Consumes one potion.</p>
              <div>Restores 10 mana.</div>
            </div>
          </span>
          <span id="toolbar5" className="toolbarItem">5
             <div className="potionCount">{this.state.inventory[0].healthPotion}</div>
             <div className="toolbarTip">
               <p id="defensive">HEALING POTION</p>
               <p id="skillCost">Consumes one potion.</p>
               <div>Restores 10 health.</div>
             </div>
          </span>
        </div>
        <div className="toolbar">
          <span id="toolbar6" className="toolbarItem">6
            <div className="toolbarTip">
              <p id="offensive">FLOOD</p>
              <div>A spray of water from your flask extinguishes flame. </div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
          <span id="toolbar7" className="toolbarItem">7
            <div className="toolbarTip">
              <p id="offensive">FIRE</p>
              <div>Flame from your torch melts spears of ice.</div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
          <span id="toolbar8" className="toolbarItem">8
            <div className="toolbarTip">
              <p id="offensive">LIGHT</p>
              <div>Light banishes the shadow.</div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
          <span id="toolbar9" className="toolbarItem">9
            <div className="toolbarTip">
              <p id="defensive">CLOAK</p>
              <div>Decreases both your and your enemys chance to hit.</div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
          <span id="toolbar0" className="toolbarItem">0
            <div className="toolbarTip">
              <p id="offensive">NIMBLE</p>
              <div>Increases both your and your enemys chance to hit.</div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
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
              <img width="20" src="https://www.ashlynnpai.com/assets/check.png" />
              {complete.name}
            </div>
            <div className="questLogDescription">{complete.description}</div>
          </div>
        )}
      </div>
      <div className="equipment">
        {this.state.equipment.map((piece) =>
        <div>
           <img width="50" src={piece.url} />
           <div>{piece.description}</div>
        </div>
        )}
      </div>
    </div>
  </div>
</div>
    );
  }
}



ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
