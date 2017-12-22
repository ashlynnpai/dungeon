class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 400;
    this.rowSize = 20;
    this.mobInfo = [{name: "rat", attack: 1, health: 8, url: "https://southparkstudios.mtvnimages.com/shared/characters/non-human/lemmiwinks.png"}];
    this.weaponsInfo = [{type: "hands", attack: 1}, {type: "starter_sword", attack: 2}, {type: "other_sword", attack: 2}];
    const startPoint = 20;
    var grids = Array(this.size).fill("S");
    let l1 = [21, 22, 23, 24, 42, 43, 44, 62, 63, 64, 25, 26, 27, 46, 47, 66, 67, 86, 87, 48, 49, 50, 29, 30, 69, 70, 89, 90, 71, 32, 33, 52, 53, 72, 73, 34, 35, 36, 55, 56, 75, 76, 57, 58];
    let l2 = [78, 98, 118, 117, 116, 115, 137, 157, 177, 176, 175, 155, 154, 153, 133, 113]
    let spaces = l1.concat(l2);
    
    for (let i=0; i<grids.length; i++) {
      if(spaces.includes(i)) {
        grids[i] = null;
      }
    }
    grids[startPoint] = "P";
    grids[42] = "starter_sword";
    let l1copy = l1.slice();
    l1copy.splice(0, 7);
    l1copy.splice(3, 1);
    for (let i=0; i<5; i++) {
      let l1Index = Math.floor(Math.random() * l1copy.length);
      let occupySquare = l1copy[l1Index];
      grids[occupySquare] = "rat";
      l1copy.splice(l1Index, 1);
    }
    
    this.state = {
      squares: grids,
      hidden: [75, 76, 57, 58],
      player_index: startPoint,
      health: 10,
      level: 1,
      xp: 0,
      living: true,
      weapons: ["hands"],
      inventory: [{type: "health pots", quantity: 1}],
      current_mob: "",
      mob_hp: 0,
      target_index: null
                 };
  }
  
  componentWillMount() {
    document.addEventListener("keypress", this.onKeyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPressed.bind(this));
  }      

  checkVisible() {
    let p = this.state.player_index;
    let r = Math.floor(p/20);
    let n = 20;
    let visible = [p, p-2, p-1, p+1, p+2, p-n-2, p-n-1, p-n, p-n+1, p-n+2, p+n-2, p+n-1, p+n, p+n+1, p+n+2];
    console.log(p);
    console.log(visible);
    this.setVisible(visible);
  

    //10 squares in each row between row number - 1 * 20 and row number * 20 - 1
    //if not in visible, set className to hidden
    let squares = this.state.squares;
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
    let hitChance = .7;
    console.log("fight " + mob);
    if (player_hp == 0) {
      this.setState({
        living: false
      });
      return;
    }
    if (mob_hp == 0) {
      return;
    }
    let player_roll = Math.random();
    if (player_roll <= hitChance) {
      mob_hp = mob_hp - player_attack;
      console.log("mob hp " + mob_hp);
      this.setState({
        mob_hp: mob_hp
      });

      console.log("Player hits " + mob + " for " + player_attack);
    }
    else {
      console.log("Player misses.");
    }
    if (mob_hp == 0) {
      console.log(mob + " dies");
      return;
    }
    let mob_roll = Math.random();
    if (mob_roll <= hitChance) {
      player_hp = player_hp - mob_attack;
      this.setState({
        health: player_hp
      });

      console.log("Mob hits player for " + mob_attack);
    }
    else {
      console.log(mob + " misses.");
    }
    if (player_hp == 0) {
      console.log("You die.");
      this.setState({
        living: false
        //death scene
      });
      return;
    }
    setTimeout(this.combatSequence.bind(this), 2000, mob, mob_hp, mob_attack, player_hp, player_attack);   
  }
  
  onKeyPressed(e) {
    if (this.state.living) {
    let current_square = this.state.player_index;
    let squares = this.state.squares;
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
          <div>
            <img id="display-box" className="avatar" src="https://www.ashlynnpai.com/assets/Idle__000.png" />
          </div>  
          <div id="display-box">
            <p>{mob.name}</p>
            <p>Health: {this.state.mob_hp}</p>
            <p>Level: {mob.level}</p>
            <p>Attack: {mob.attack}</p>
          </div>  
          <div>
            <img id="display-box" className="avatar" src="{}" /> 
          </div>
          <div id="display-box">
            <p>Inventory</p>
            {this.state.inventory.map((inv) => 
           <div>{inv.type} {inv.quantity}</div>)}
          </div>  
          <div id="display-box">
            <p>More Stuff</p>
          </div>  
          <div id="display-box">
            <p>More Stuff</p>
          </div>  
        </div>
        <div>

          <span>{this.state.health}</span>
          Messages</div>
          <span>{this.state.mob_hp}</span>
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
