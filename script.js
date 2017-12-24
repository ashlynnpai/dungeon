class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 10;
    this.mobInfo = [{name: "rat", attack: 1, health: 8, url: "https://southparkstudios.mtvnimages.com/shared/characters/non-human/lemmiwinks.png"}];
    this.weaponsInfo = [{type: "hands", attack: 1}, {type: "starter_sword", attack: 2}, {type: "other_sword", attack: 2}];
    const startPoint = 0;
    var grids = Array(this.size).fill("S");
    let level1 = Array.from(Array(10).keys())
    let room1 = [11, 12, 13, 14, 21, 22, 23, 24];
    let room2 = [16, 17, 18, 28];
    level1.concat(room1);
    level1.concat(room2);
    level1.push.apply(level1, room1.concat(room2));
    let level2 = [38, 37, 36]
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
    for (let i=0; i<5; i++) {
      let level1Index = Math.floor(Math.random() * level1Copy.length);
      let occupySquare = level1Copy[level1Index];
      grids[occupySquare] = "rat";
      level1Copy.splice(level1Index, 1);
    }
    
    this.state = {
      squares: grids,
      hidden: [],
      player_index: startPoint,
      health: 10,
      level: 1,
      xp: 0,
      living: true,
      weapons: ["hands"],
      inventory: [{type: "health pots", quantity: 1}],
      current_mob: "",
      mob_hp: 0,
      target_index: null,
      inCombat: false,
      log: [],
      messages: []
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
      var mob_hp = this.mobInfo[0].health;
      this.state.mob_hp = mob_hp;
      var mob_attack = this.mobInfo[0].attack;
    }
    let player_hp = this.state.health;
    let filtered_weapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.type == this.state.weapons[0]);
    let player_attack = filtered_weapons[0].attack;
    this.combatSequence(mob, mob_hp, mob_attack, player_hp, player_attack);     
  }
  
  combatSequence(mob, mob_hp, mob_attack, player_hp, player_attack) {
    var log = this.state.log;
    let hitChance = .7;
    if (player_hp == 0) {
      this.state.living=false;
      return;
    }
    if (mob_hp == 0) {
      this.state.inCombat=false;
      return;
    }
    let player_roll = Math.random();
    if (player_roll <= hitChance) {
      mob_hp = mob_hp - player_attack;
      this.setState({
        mob_hp: mob_hp
      });
      let action = "Player hits " + mob + " for " + player_attack
      log.unshift(action);
    }
    else {
      let action = "Player misses."
      log.unshift(action);
    }
    if (mob_hp == 0) {
      let action = mob + " dies."
      log.unshift(action);
      this.state.inCombat=false;
      return;
    }
    let mob_roll = Math.random();
    if (mob_roll <= hitChance) {
      player_hp = player_hp - mob_attack;
      this.setState({
        health: player_hp
      });
      let action = mob + " hits you for " + mob_attack;
      console.log(action);
      console.log(log);
      log.unshift(action);
    }
    else {
      let action = mob + " misses."
      console.log(action);
      console.log(log);
      log.unshift(action);
    }
    if (player_hp == 0) {
      let action = "You die."
      log.unshift(action);
      this.setState({
        living: false
        //death scene
      });
      return;
    }
    setTimeout(this.combatSequence.bind(this), 2000, mob, mob_hp, mob_attack, player_hp, player_attack);   
  }
  
  onKeyPressed(e) {
    let current_square = this.state.player_index;
    let squares = this.state.squares;
    if (this.state.living) {
      if(!this.state.inCombat){
        if(e.key == 'd'){
          var next_square = current_square + 1;
        }
        else if(e.key =='a') {
          var next_square = current_square - 1;
        }  
        else if(e.key =='w') {
          var next_square = current_square - this.rowSize;
        }  
        else if(e.key =='s') {
          var next_square = current_square + this.rowSize;
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
          this.state.inCombat=true;
          this.fightMob(squares[next_square]);
          squares[current_square] = null;
          squares[next_square] = "P";
        }
        else if(this.weaponLookup(squares[next_square])) {
          let weapons = this.state.weapons;
          weapons.unshift(squares[next_square]);
            this.setState({
              weapons: weapons    
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
      if (this.state.inCombat) {
        if(e.key == '1'){
          console.log("do something");
        }
        else {
          return;
        }
      }
    }
  }

  render() {
    for(var i=0; i<this.mobInfo.length; i++) {
  if(this.mobInfo[i].name==this.state.current_mob) {
    var mob = this.mobInfo[i];
    }
  else {
    var mob = {name: "none", attack: 0, health: 0, url: ""}
  }

  var weapon = this.state.weapons[0];        
  let filtered_weapons = this.weaponsInfo.filter(weaponInfo => weaponInfo.type == weapon);
  var attack_value = filtered_weapons[0].attack;
     }
    return (
      <div onKeyPress={(e) => this.onKeyPressed(e)}>
      <div id="display">
        <div id="display-box">
          <p>Health: {this.state.health}</p>
          <p>Level: {this.state.level}</p>
          <p>XP: {this.state.xp}</p>
          <p>Weapon: {weapon}</p>
          <p>Attack: {attack_value}</p>
        </div>  
        <div id="display-box">
          <p>{mob.name}</p>
          <p>Health: {this.state.mob_hp}</p>
          <p>Level: {mob.level}</p>
          <p>Attack: {mob.attack}</p>
        </div>  
        <div id="display-box">
          <p>Inventory</p>
          {this.state.inventory.map((inv) => 
         <div>{inv.type} {inv.quantity}</div>)}
        </div>  
      </div>
     <div id="display-log">
        {this.state.log.map((line) => 
       <div>{line}</div>)}
      </div>  
      <div id="messages">
        {this.state.messages.map((message) => 
       <div>{message}</div>)}
      </div>
       
        <div id="board" className="flex-container" >      
          {this.state.squares.map((square,index) => 
           <div className={square + "color"}  id={"square" + index} key={index}>{index} {square}</div>)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
