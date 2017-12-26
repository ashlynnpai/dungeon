class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 10;
    this.maxHealth = 10;
    this.mobInfo = [{name: "goblin1", attack: 1, health: 8, level: 1, url: "https://www.ashlynnpai.com/assets/opengameart_goblin1.png"}];
    this.weaponsInfo = [{type: "hands", attack: 1}, {type: "starter_sword", attack: 2}, {type: "other_sword", attack: 2}];
    const startPoint = 0;
    var grids = Array(this.size).fill("S");
    let level1 = Array.from(Array(10).keys())
    let room1 = [11, 12, 13, 14, 20, 21, 22, 23, 24];
    let room2 = [16, 17, 18, 27, 28, 29, 39, 38, 37, 36, 35, 49, 59, 58, 57];
    let hall1 = [45, 44, 43, 42, 41, 40, 50, 60, 61, 62, 63, 64, 61, 62, 63, 64, 65, 66]
    let boss1 = []
    level1.concat(room1);
    level1.concat(room2);
    level1.push.apply(level1, room1.concat(room2));
    level1.push.apply(level1, hall1.concat(boss1));
    let level2 = []
    let spaces = level1.concat(level2);
    
    for (let i=0; i<grids.length; i++) {
      if(spaces.includes(i)) {
        grids[i] = null;
      }
    }
    grids[startPoint] = "P";
    grids[11] = "starter_sword";
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
      health: 10,
      level: 1,
      xp: 0,
      specialSkill: null,
      pet: null,
      living: true,
      weapons: ["hands"],
      inventory: [{type: "health pots", quantity: 1}],
      current_mob: "",
      mob_hp: 0,
      target_index: null,
      busy: false,
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
    if (this.mobInfo.filter(mobInfo => mobInfo.name == mob).length > 0) {
      return true;
    };
  }
  
  weaponLookup(weapon) {
    if (this.weaponsInfo.filter(weaponInfo => weaponInfo.type == weapon).length > 0) {
      return true;
    }
  }
  
  fightMob(mob) {
      if (this.mobInfo.filter(mobInfo => mobInfo.name == mob)) {
        this.setState({
          current_mob: mob
        });
        var mob_hp = this.mobInfo[0].health;
        this.state.mob_hp = mob_hp;
        var mobLevel = this.mobInfo[0].level;
        var mob_attack = this.mobInfo[0].attack;
    }
    let player_hp = this.state.health;
    let filtered_weapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.type == this.state.weapons[0]);
    let player_attack = filtered_weapons[0].attack;
    let mobSpecial = "fire";
    var action = mob + " is casting " + mobSpecial;
    this.state.combatLog.unshift(action);
    this.setState({
      combatLog: this.state.combatLog,
      message: action
    });
    console.log(this.state.message);
    this.combatSequence(mob, mob_hp, mob_attack, mobLevel, mobSpecial, player_hp, player_attack);     
  }
  
  combatSequence(mob, mob_hp, mob_attack, mobLevel, mobSpecial, player_hp, player_attack) {
    var log = this.state.combatLog;
    let hitChance = .7;
    var modifiedPlayerAttack = player_attack + (Math.round(Math.random()) * this.state.level);
    var modifiedMobAttack = mob_attack + (Math.round(Math.random()) * mobLevel);
    let player_roll = Math.random();
    let specialInfo = {fire: "water"};
    let specialCounter = specialInfo[mobSpecial];

    if (player_roll <= hitChance) {
      mob_hp = mob_hp - modifiedPlayerAttack;
      this.setState({
        mob_hp: mob_hp
      });
      let action = "Player hits " + mob + " for " + modifiedPlayerAttack;
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
      let action = mob + " dies.";
      log.unshift(action);
      this.state.busy=false;
      let xp = this.state.xp += 5;
      let level = this.checkLevel();
      this.setState({
        mob_hp: 0,
        xp: xp,
        level: level,
        log: log, 
        playerSpecial: null
      });
      return;
    }
    
    if (this.state.playerSpecial != specialCounter) {
      let specialDamage = modifiedMobAttack;
      player_hp = player_hp - modifiedMobAttack;
      this.setState({
        health: player_hp
      });
      let action = mob + " casts " + mobSpecial + " for " + modifiedMobAttack;
      log.unshift(action);
    }
    else {
      mob_hp = mob_hp - this.state.level;
      let action = "You counter with " + specialCounter + " for " + this.state.level;
      log.unshift(action);
    }
    this.setState({
      log: log, 
    });
    
    let mob_roll = Math.random();
    if (mob_roll <= hitChance) {
      player_hp = player_hp - modifiedMobAttack;
      this.setState({
        health: player_hp
      });
      let action = mob + " hits you for " + modifiedMobAttack;
      log.unshift(action);
    }
    else {
      let action = mob + " misses."
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
    setTimeout(this.combatSequence.bind(this), 3000, mob, mob_hp, mob_attack, mobLevel, mobSpecial, player_hp, player_attack);   
  }
  
  regenerateHealth(health) {
    var maxHealth = this.maxHealth;
    if (health >= maxHealth) {
      this.state.health = maxHealth;
      this.state.busy = false;
      return;
    }
    else {
      health += this.state.level;
      this.setState({
        health: health
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
      console.log("You are now level " + level);
    }
    return level;
  }
  
  onKeyPressed(e) {
    let current_square = this.state.player_index;
    let squares = this.state.squares;
    let boardDiv = document.getElementById("board");
    if (this.state.living) {
      if(!this.state.busy){
        if(e.key == 'd'){
          var next_square = current_square + 1;
        }
        else if(e.key =='a') {
          var next_square = current_square - 1;
        }  
        else if(e.key =='w') {
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
        else if(e.key =='s') {
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
          this.state.busy = true;
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
          this.state.busy = true;
          this.fightMob(squares[next_square]);
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(this.weaponLookup(squares[next_square])) {
          let weapons = this.state.weapons;
          weapons.unshift(squares[next_square]);
            this.setState({
              weapons: weapons, 
              message: "You equip " + weapons[0]
            });
          squares[current_square] = null;
          squares[next_square] = "P";
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
      if (this.state.busy) {
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
    let mobHealth = this.state.mob_hp;
    for(var i=0; i<this.mobInfo.length; i++) {
      if(this.mobInfo[i].name == this.state.current_mob) {
        var mob = this.mobInfo[i];
        var mobMaxHealth = mob.health;
      }
  else {
    //var mob = {name: "none", attack: 0, health: 0, url: ""}
    var mob = null;
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
  let filtered_weapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.type == weapon);
  var attack_value = filtered_weapons[0].attack;
     }
    
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
          <div className = {healthColor + " progress-bar"}>
            <span style={healthBar}>{health}/{this.maxHealth}</span> 
          </div>
        </div>
    
        
        <div>
          {mob ? (
            <div>   
              <div className = "nameplate">
                <div>{mob.name}</div>
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
             <div className = "avatar">
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
        <span>3</span>
        <span>4</span>
        <span id="toolbar5">5</span>
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
