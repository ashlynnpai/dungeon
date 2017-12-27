class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 10;
    this.maxHealth = 20;
    this.maxMana = 10;
    this.mobsInfo = [{name: "goblin1", displayName: "Goblin Footsoldier", attack: 1, health: 18, level: 1, url: "https://www.ashlynnpai.com/assets/opengameart_goblin1.png"}, {name: "goblin2", displayName: "Goblin Lieutenant", attack: 2, health: 24, level: 2, url: "https://www.ashlynnpai.com/assets/opengameart_goblin1.png"}
                    ];
    this.weaponsInfo = [{name: "Hands", attack: 1, description: "These are deadly weapons."}, {name: "Meatchopper", attack: 2, 
    description: "A rusty knife from someone's kitchen"}];
    this.itemsInfo = [[{name: "Pointe", bonus: "dodgeChance: 1", description: "These shoes were made for dancing"}]];
    const startPoint = 0;
    var grids = Array(this.size).fill("S");
    let level1 = Array.from(Array(10).keys())
    let room1 = [11, 12, 13, 14, 20, 21, 22, 23, 24];
    let room2 = [16, 17, 18, 27, 28, 29, 39, 38, 37, 36, 35, 49, 59, 58, 57];
    let hall1 = [45, 44, 43, 42, 41, 40, 50, 51, 52, 53, 54, 60, 61, 62, 63, 64, 61, 62, 63, 64, 65, 66]
    let boss1 = []
    level1.concat(room1);
    level1.concat(room2);
    level1.push.apply(level1, room1.concat(room2).concat(hall1));
    let level2 = []
    let spaces = level1.concat(level2);
    
    for (let i=0; i<grids.length; i++) {
      if(spaces.includes(i)) {
        grids[i] = null;
      }
    }
    grids[startPoint] = "P";
    grids[11] = "Meatchopper";
    //seed a random square with a mob or item and then remove it from a copy of the floor plan array so multiple items don't get put on the same square
    let level1Copy = level1.slice();
    level1Copy.splice(startPoint, 2);
    let starterSwordIndex = level1Copy.indexOf(11);
    level1Copy.splice(starterSwordIndex, 1);
    //change to picking a random point in each room
    for (let i=0; i<5; i++) {
      let level1Index = Math.floor(Math.random() * level1Copy.length);
      let occupySquare = level1Copy[level1Index];
      grids[occupySquare] = "goblin1";
      level1Copy.splice(level1Index, 1);
    }
    
    this.state = {
      squares: grids,
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
      inventory: [{type: "healthPotion", quantity: 1}],
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
  
  itemLookup(item) {
    if (this.itemsInfo.filter(itemInfo => itemInfo.name == item).length > 0) {
      return true;
    }
  }
  
  fightMob(mob) {
    for (let i=0; i<this.mobsInfo.length; i++) {
      if (this.mobsInfo[i].name == mob) {
        var mobDisplayName = this.mobsInfo[i].displayName;
        var mob_hp = this.mobsInfo[i].health;
        var mobLevel = this.mobsInfo[i].level;
        var mob_attack = this.mobsInfo[i].attack;
      }
    }
    this.setState({
      current_mob: mob
    });  
    this.state.mob_hp = mob_hp;
    let player_hp = this.state.health;
    let filtered_weapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.name == this.state.weapons[0]);
    let player_attack = filtered_weapons[0].attack;
    let mobSpecial = "fire";
    var action = mobDisplayName + " is casting " + mobSpecial;
    this.state.combatLog.unshift(action);
    this.setState({
      combatLog: this.state.combatLog,
      message: action
    });
    this.combatSequence(mobDisplayName, mob_hp, mob_attack, mobLevel, mobSpecial, player_hp, player_attack);     
  }
  
  combatSequence(mobDisplayName, mob_hp, mob_attack, mobLevel, mobSpecial, player_hp, player_attack) {
    var log = this.state.combatLog;
    let mobHitChance = .7;
    mobHitChance -= this.state.dodgeChance;
    var modifiedPlayerAttack = player_attack + (Math.round(Math.random()) * this.state.level);
    var modifiedMobAttack = mob_attack + (Math.round(Math.random()) * mobLevel);
    let player_roll = Math.random();
    let specialInfo = {fire: "water"};
    let specialCounter = specialInfo[mobSpecial];

    if (player_roll <= this.state.hitChance) {
      mob_hp = mob_hp - modifiedPlayerAttack;
      this.setState({
        mob_hp: mob_hp
      });
      let action = "Player hits " + mobDisplayName + " for " + modifiedPlayerAttack;
      log.unshift(action);
    }
    else {
      let action = "Player misses.";
      log.unshift(action);
    }
    
    this.setState({
      log: log
    });
    
    if (mob_hp <= 0) {
      let action = mobDisplayName + " dies.";
      log.unshift(action);
      this.state.currentAction = null;
      let xp = this.state.xp += 5;
      let level = this.checkLevel();
      this.setState({
        mob_hp: 0,
        xp: xp,
        level: level,
        log: log, 
        playerSpecial: null,
        current_mob: null
      });
      return;
    }
    
    if (this.state.playerSpecial != specialCounter && specialCounter) {
      let specialDamage = modifiedMobAttack;
      player_hp = player_hp - modifiedMobAttack;
      this.setState({
        health: player_hp
      });
      let action = mobDisplayName + " casts " + mobSpecial + " for " + modifiedMobAttack;
      log.unshift(action);
    }
    else if (this.state.playerSpecial == specialCounter) {
      mob_hp = mob_hp - this.state.level;
      let action = "You counter " + mobSpecial + " with " + specialCounter + " for " + this.state.level;
      log.unshift(action);
      mobSpecial = null;
    }
    this.setState({
      log: log, 
    });
    
    let mob_roll = Math.random();
    if (mob_roll <= mobHitChance) {
      player_hp = player_hp - modifiedMobAttack;
      this.setState({
        health: player_hp
      });
      let action = mobDisplayName + " hits you for " + modifiedMobAttack;
      log.unshift(action);
    }
    else {
      let action = mobDisplayName + " misses."
      log.unshift(action);
    }

    if (player_hp <= 0) {
      player_hp = 0;
      let action = "You die."
      log.unshift(action);
      this.setState({
        health: 0,
        living: false,
        log: log
        //death scene
      });
      return;
    }
    setTimeout(this.combatSequence.bind(this), 3000, mobDisplayName, mob_hp, mob_attack, mobLevel, mobSpecial, player_hp, player_attack);   
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
        mana: this.state.mana += 10
      })
    }
    return level;
  }
  
  processItem(item) {
    let inventory = this.state.inventory;
    if(item == "healthPotion") {
     inventory.healthPotion++;
    }
    else if (this.itemsInfo.filter(itemsInfo => itemsInfo.name == item)) {
      console.log(itemsInfo.bonus);
      inventory.push(item);
    }
    this.setState({
      inventory: inventory
    })
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
          //fight the mob
          this.state.currentAction = "fighting";
          this.fightMob(squares[next_square]);
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(this.weaponLookup(squares[next_square])) {
          let weapons = this.state.weapons;
          weapons.unshift(squares[next_square]);
          console.log(this.state.mainLog);
          let message = "You equip " + weapons[0];
          let mainLog = this.state.mainLog;
          mainLog.push(message);
            this.setState({
              weapons: weapons, 
              message: "You equip " + weapons[0],
              mainLog: mainLog
            });
          
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(this.itemLookup(squares[next_square])) {
          console.log("item lookup");
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
        if(e.key == '1'){
          //set a special state and in combat check if state is true
          //only one state can be active
          let skill1 = "water";
          this.state.playerSpecial = skill1;
          let action = "You use " + skill1
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
    for(let i=0; i<this.mobsInfo.length; i++) {
      if(this.mobsInfo[i].name == mob) {
        var mobMaxHealth = this.mobsInfo[i].health;
      }
    }

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
    let filtered_weapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.name == weapon);
    var attack_value = filtered_weapons[0].attack;
      
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
       <div className={square + "color"}  id={"square" + index} key={index}>{index} {square}</div>)}
    </div>
    <div className='ui'>
      <div>
      <div className = "blue xp-bar">
         <span style={xpBar}>{this.state.xp}/{xpGoal}</span> 
       </div>
      <div className="toolbar">
        <span id="toolbar1">1</span>
        <span id="toolbar2">2</span>
        <span id="toolbar3">3</span>
        <span id="toolbar4">4</span>
        <span id="toolbar5">5</span>
      </div>  
      <div className="toolbar">  
        <span id="toolbar6">6</span>
        <span id="toolbar7">7</span>
        <span id="toolbar8">8</span>
        <span id="toolbar9">9</span>
        <span id="toolbar0">0</span>
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
        
    <div className="display-log">      
         <p>{weapon}</p>
        {this.state.inventory.map((item) => 
       <div>{item.type} {item.quantity}</div>                       
        )}
      
      </div>     
   </div>     
      
    );
  }
}
 


ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
