class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 10;
    this.maxHealth = 20;
    this.maxMana = 10;
    this.mobsInfo = [{name: "goblin1", displayName: "Goblin Footsoldier", attack: 1, health: 20, level: 1,
    url: "https://www.ashlynnpai.com/assets/opengameart_goblin1.png"},
    {name: "goblin2", displayName: "Goblin Lieutenant", attack: 2, health: 30, level: 2,
    url: "https://www.ashlynnpai.com/assets/opengameart_goblin2.png"},
    {name: "orc1", displayName: "Orc Captain", attack: 3, health: 50, level: 3,
    url: "https://www.ashlynnpai.com/assets/opengameart_orc1.png"}
    ];
    this.weaponsInfo = [{name: "Hands", attack: 1, description: "These are deadly weapons."}, {name: "Meatchopper", attack: 2,
    description: "A rusty knife from someone's kitchen"}];
    this.itemsInfo = [{name: "Clogs", bonus: ["dodgeChance", .03], description: "These shoes were made for dancing"}, {name: "Mittens",
    bonus: ["hitChance", .03], description: "A Goon's favorite Mittens"}];
    this.findableItems = [{index: 11, item: "Meatchopper"}];
    this.questItemsInfo = [{name: "Something"}];
    this.level1Drops = ["Clogs", "healthPotion", "manaPotion", "Gold", "Mittens"];
    this.mobSkills = [{name: "Firebomb", action: "throws", counter: "water"}, {name: "Lightning", action: "summons", counter: "reflect"},
    {name: "Shadow", action: "casts", counter: "crystal"}];
    const startPoint = 0;
    let squares = Array(this.size).fill("S");
    let level1 = Array.from(Array(10).keys())
    let room1 = [11, 12, 13, 14, 20, 21, 22, 23, 24];
    let room2 = [16, 17, 18, 27, 28, 29, 39, 38, 37, 36, 35, 49, 59, 58, 57];
    let hall1 = [30, 45, 44, 43, 42, 41, 40, 50, 51, 52, 53, 54, 56, 60, 61, 62, 63, 64, 61, 62, 63, 64, 65, 66]
    level1.push.apply(level1, room1.concat(room2).concat(hall1));

    let room3 = [76, 77, 78, 79, 89, 88, 87, 86, 96, 97, 98, 99];
    let room4 = [85, 84, 83, 82, 81, 80, 90, 91, 92, 93, 100, 101, 102, 103, 110];
    let room5 = [104, 105, 106, 107, 108, 109, 119, 118, 117, 116, 115, 114, 113]
    let miniboss = [126, 127, 128, 136, 137, 138, 139, 146, 147, 148];
    let level2 = []
    level2.push.apply(level2, room3.concat(room4).concat(room5).concat(miniboss));


    let room6 = [135, 134, 133, 132, 131, 130, 145, 144, 143, 142, 141, 140];
    let room7 = [150, 151, 152, 160, 161, 162, 170, 171, 172, 180, 181, 190, 191];
    let room8 = [163, 164, 165, 166, 167, 168, 169, 173, 174, 175, 176, 177, 178, 179];
    let boss = [186, 187, 188, 189, 196, 197, 198, 199]
    let level3= [];
    level3.push.apply(level3, room6.concat(room7).concat(room8).concat(boss));
    let spaces = level1.concat(level2).concat(level3);

    for (let i=0; i<squares.length; i++) {
      if(spaces.includes(i)) {
        squares[i] = null;
      }
    }
    squares[startPoint] = "P";
    squares[11] = "I";
    //seed a random square with a mob or item and then remove it from a copy of the floor plan array so multiple items don't get put on the same square
    let spacesCopy = spaces.slice();
    spacesCopy.splice(startPoint, 2);
    let starterSwordIndex = spacesCopy.indexOf(11);
    spacesCopy.splice(starterSwordIndex, 1);

    let seeds = [{room: room1, amount: 1, mob: "goblin1"}, {room: room2, amount: 1, mob: "goblin1"},
  {room: hall1, amount: 2, mob: "goblin1"}, {room: room3, amount: 1, mob: "goblin2"}, {room: room4, amount: 1, mob: "goblin2"},
  {room: room5, amount: 2, mob: "goblin2"}, {room: room6, amount: 1, mob: "orc1"}, {room: room7, amount: 1, mob: "orc1"},
  {room: room8, amount: 2, mob: "orc1"}
   ];
    for (let i=0; i<seeds.length; i++) {
      let chosenSquares = this.pickSquare(seeds[i].room, seeds[i].amount);
      squares = this.setGrid(chosenSquares, squares, seeds[i].mob);
      spacesCopy = this.removeSquareFromCopy(chosenSquares, spacesCopy);
    }

    this.state = {
      squares: squares,
      hidden: [],
      player_index: startPoint,
      yCoord: 0,
      health: 20,
      mana: 10,
      level: 1,
      xp: 0,
      hitChance: .70,
      dodgeChance: 0,
      specialSkill: null,
      pet: null,
      living: true,
      weapons: ["Hands"],
      attack: 1,
      inventory: [{healthPotion: 1}, {manaPotion: 0}, {gold: 0}],
      equipment: [],
      current_mob: "",
      mob_hp: 0,
      target_index: null,
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

  pickSquare(room, amount) {
    let squaresArray = [];
    for (let i=0; i<amount; i++) {
      let roomIndex = Math.floor(Math.random() * room.length);
      squaresArray.push(room[roomIndex]);
      }
    return squaresArray;
    }

  removeSquareFromCopy(squares, spacesCopy) {
    for (let i=0; i<squares.length; i++) {
      let spacesSquareIndex = spacesCopy.indexOf(squares[i]);
      spacesCopy.splice(spacesSquareIndex, 1);
    }
    return spacesCopy;
  }

  setGrid(chosenSquares, grids, mob) {
    for (let i=0; i<chosenSquares.length; i++) {
      grids[chosenSquares[i]] = mob;
    }
    return grids;
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
    if (this.questItemsInfo.filter(questItemInfo => questItem.name == questItem).length > 0) {
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
    let mob = this.state.current_mob;
    let playerHealth = this.state.health;
    let mobHealth = this.state.mob_hp;
    console.log("check1 " + mobHealth);
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
      log.unshift(action);
      console.log("check2 " + mobHealth);
    }
    else {
      let action = "Player misses.";
      log.unshift(action);
    }
    this.setState({
     mob_hp: mobHealth,
     combatLog: log
    });

    if (mobHealth <= 0) {
      let action = mob.displayName + " dies.";
      log.unshift(action);
      let drops = this.level1Drops;
      let loot = drops[Math.floor(Math.random() * drops.length)];
      this.processItem(loot);
      drops.splice(Math.floor(Math.random() * drops.length, 1));
      let xp = this.state.xp += (10 * mob.level);
      let level = this.checkLevel();
      this.setState({
        mob_hp: 0,
        xp: xp,
        level: level,
        combatLog: log,
        playerSpecial: null,
        current_mob: null,
        currentAction: null,
        level1Drops: drops
      });
      return;
    }
    if (mobSpecial) {
      if (this.state.playerSpecial != mobSpecial.counter) {
        playerHealth -= modifiedMobAttack;
        let action = mob.displayName + " " + mobSpecial.action + " " + mobSpecial.name;
        log.unshift(action);
      }
      else if (this.state.playerSpecial == mobSpecial.counter) {
        mobHealth -= this.state.level;
        console.log("check3 " + mobHealth);
        let action = "You counter " + mobSpecial.name + " with " + mobSpecial.counter + " for " + this.state.level;
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

  regenerateHealth(health) {
    var maxHealth = this.maxHealth;
    if (health >= maxHealth) {
      this.setState({
        health: maxHealth,
        currentAction: null
      });
      return;
    }
    else {
      health += this.state.level;
      this.setState({
        health: health,
      });
       setTimeout(this.regenerateHealth.bind(this), 3000, health);
    }
  }

  checkLevel() {
    let levelInfo = {1:50, 2:100, 3:200};
    let level = this.state.level;
    let xp = this.state.xp;
    if (levelInfo[level] <= xp) {
      level++;
      let message = "You are now level " + level;
      this.setState({
        message: message,
        mainLog: this.state.mainLog.push(message),
        health: this.state.health += 20,
        mana: this.state.mana += 10,
        xp: xp - levelInfo[level]
      })
    }
    return level;
  }

  processItem(item) {
    let inventory = this.state.inventory;
    let equipment = this.state.equipment;
    if(item == "healthPotion") {
      inventory[0].healthPotion++;
    }
    else if (item == "manaPotion") {
      inventory[1].manaPotion++;
    }
    else if (item == "Gold") {
      inventory[2].gold += 5 * this.state.level;
    }
    else {
      let items = this.itemsInfo;
      for (let i=0; i<items.length; i++) {
        let name = items[i].name;
        if (name == item) {
          var bonus = items[i].bonus;
          var hitChance = this.state.hitChance;
          var dodgeChance = this.state.dodgeChance;
          var attack = this.state.attack;
          if (bonus[0] == "hitChance") {
            hitChance += bonus[1];
          }
          else if (bonus[0] == "dodgeChance") {
            dodgeChance += bonus[1];
          }
          else if (bonus[0] == "attack") {
            attack += bonus[1];
          }
          equipment.push(items[i]);
        }
      }
    }
    this.setState({
      inventory: inventory,
      equipment: equipment,
      hitChance: hitChance,
      dodgeChance: dodgeChance,
      attack: attack
    })
  }

  processFindableItems(nextIndex) {
    let retrievedItem = this.findableItems.filter(findableItem => findableItem.index == nextIndex);
    let itemName = retrievedItem.item;
    if (this.weaponLookup(itemName)) {
      this.equipWeapon(itemName);
    }
    else if (this.questItemLookup(itemName)) {
      this.processQuestItem(itemName);
    }
  }

  processQuestItem(questItem) {

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
    squares[currentSquare] = null;
    squares[nextSquare] = "P";
    mainLog.push(message);
      this.setState({
        weapons: weapons,
        attack: attack,
        message: "You equip " + weapons[0],
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
          this.regenerateHealth(this.state.health);
        }
        else {
          return;
        }
        if(squares[next_square] == null) {
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(this.mobLookup(squares[next_square])) {
          this.state.currentAction = "fighting";
          this.fightMob(squares[next_square]);
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(squares[next_square] == "I") {
          this.processFindableItems(next_square);
        }
        else {
          return;
        }
        this.setState({
          squares: squares,
          player_index: next_square
         });
        this.checkVisible();
        }
      if (this.state.currentAction) {
        //set a special state and in combat check if state is true
        //only one state can be active
        let log = this.state.combatLog;
        let skillKeys = {1: "water", 2: "reflect", 3: "shadow", 4: "cloak", 5: "nimble",
        6: "heal", 7: "", 8: "", 9: "health potion", 0: "mana potion"};
        let health = this.state.health;
        let mana = this.state.mana;
        let mobHealth = this.state.mob_hp;
        if (e.key in skillKeys) {
          if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4" || e.key == "5") {
            let skill = skillKeys[e.key];
            this.state.playerSpecial = skill;
            let action = "You use " + skill;
            log.push(action);
          }
          else if (e.key =="6") {
            if (mana >= 10) {
              health += 10;
              mana -= 10;
              let action = "You cast heal for 10 health.";
              log.push(action);
            }
          }
          else if (e.key =="7") {
            mobHealth -= this.state.level*2
            let action = "Stuff";
            log.push(action);
          }
          else if (e.key =="8") {
            mobHealth -= this.state.level*2
            let action = "Stuff";
            log.push(action);
          }
          else if (e.key =="9") {
            if (this.state.inventory[1].manaPotion > 0) {
              mana += 10;
              this.state.inventory[1].manaPotion--;
            }
            let action = "You consume mana potion.";
            log.push(action);
          }
          else if (e.key =="0") {
            if (this.state.inventory[0].healthPotion > 0) {
              health += 10;
              this.state.inventory[0].healthPotion--;
            }
            let action = "You consume health potion.";
            log.push(action);
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
    let healthPercent = Math.round((health/this.maxHealth)*100);
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
    let manaPercent = Math.round((mana/this.maxMana)*100);
    var manaBar = {
      width: manaPercent + "%",
      color: "#fff"
    };

    let mob = this.state.current_mob;
    let mobHealth = this.state.mob_hp;
    // for(let i=0; i<this.mobsInfo.length; i++) {
    //   if(this.mobsInfo[i].name == mob) {
    //     var mobMaxHealth = this.mobsInfo[i].health;
    //   }
    // }
    let mobMaxHealth = mob.health;
    let mobHealthPercent = Math.round((mobHealth/mobMaxHealth)*100);
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

    var weapon = this.state.weapons[0];

    let levelInfo = {1:50, 2:100, 3:200};
    let level = this.state.level;
    var xpGoal = levelInfo[level];
    let xpPercent = Math.round((this.state.xp/xpGoal)*100);
    var xpBar = {
        width: xpPercent + "%",
        color: "#fff"
    };


    return (
      <div onKeyPress={(e) => this.onKeyPressed(e)}>

      <div className = "ui">
        <p>{this.state.level}</p>
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
            <span style={healthBar}>{health}/{this.maxHealth}</span>
          </div>
          <div className = {"blue progress-bar"}>
            <span style={manaBar}>{mana}/{this.maxMana}</span>
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
                <img src ="https://www.ashlynnpai.com/assets/Jinn_goblin.png" />
              </div>
              <p>{mob.level}</p>
            </div>

          ) : (
             <div className = "blankAvatar">
             </div>
          )}
        </div>
     </div>

     <div className="messageDisplay">
        <p>{this.state.message}</p>
     </div>

    <div id="board" className="flex-container" >
      {this.state.squares.map((square,index) =>
       <div className={square + "color"}  id={"square" + index} key={index}>{index} {square}
         <div className='squareInfo'>
           {(() => {
             switch (square) {
               case "goblin1": return "Goblin Footsoldier Level 1";
               case "goblin2": return "Goblin Lieutenant Level 2";
             }
           })()}
         </div>
       </div>)}
    </div>
    <div className='ui'>
      <div>
        <div className = "blue xp-bar">
           <span style={xpBar}>{this.state.xp}/{xpGoal}</span>
         </div>
        <div className="toolbar">
          <span id="toolbar1">1
            <div className="toolbarTip">WATER from your flask can put out flames. DEFENSIVE MOVE</div>
          </span>
          <span id="toolbar2">2
            <div className="toolbarTip">REFLECT magic of the arcane. DEFENSIVE MOVE</div>
          </span>
          <span id="toolbar3">3
            <div className="toolbarTip">CRYSTAL of shadow wards against evil. DEFENSIVE MOVE</div>
          </span>
          <span id="toolbar4">4</span>
          <span id="toolbar5">5</span>
        </div>
        <div className="toolbar">
          <span id="toolbar6">6
            <div className="toolbarTip">HEAL yourself for half your total health. Costs 10 mana.</div>
          </span>
          <span id="toolbar7">7</span>
          <span id="toolbar8">8</span>
          <span id="toolbar9">9
            <div className="toolbarTip">HEALING POTION grants 10 health.</div>
          </span>
          <span id="toolbar0">0</span>
            <div className="toolbarTip">MANA POTION grants 10 mana.</div>
         </div>
      </div>

      <div className="display-log">
        {this.state.mainLog.map((logLine) =>
       <div>{logLine}</div>)}
      </div>
      <div className="display-log">
        {this.state.combatLog.map((combatEvent) =>
       <div>{combatEvent}</div>)}
      </div>
    </div>
    <div className="displayStats">

      <h2>Inventory</h2>
      <p>{weapon} Attack: {this.state.attack}</p>
      <p>Health Potions: {this.state.inventory[0].healthPotion}</p>
      <p>Mana Potions: {this.state.inventory[1].manaPotion}</p>
      <p>Gold: {this.state.inventory[2].gold}</p>

      {this.state.equipment.map((piece) =>
      <div>
        <p>{piece.name} {piece.bonus[0]}:{piece.bonus[1]}</p>
        <p>{piece.description}</p>
      </div>
      )}
    </div>
    <div className="displayStats">
      <div>
        <h2>Character</h2>
        <p>Attack: {this.state.attack}</p>
        <p>Hit Chance: {this.state.hitChance}</p>
        <p>Dodge Chance: {this.state.dodgeChance}</p>
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
