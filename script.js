class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 400;
    this.rowSize = 20;
    this.mobInfo = [{name: "rat", attack: 1, health: 8, url: "https://southparkstudios.mtvnimages.com/shared/characters/non-human/lemmiwinks.png"}];
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
    let l1copy = l1.slice();
    l1copy.splice(0, 7);
    for (let i=0; i<5; i++) {
      let l1Index = Math.floor(Math.random() * l1copy.length);
      let occupySquare = l1copy[l1Index];
      grids[occupySquare] = "rat";
      l1copy.splice(l1Index, 1);
    }
    
    this.state = {
    squares: grids,
    player_index: startPoint,
    health: 10,
    level: 1,
    xp: 0,
    weapons: [{type: "hands", attack: 1}],
    inventory: [{type: "health pots", quantity: 1}],
    current_mob: "",
    mob_hp: 0
                 };
  }
  
  componentWillMount() {
    document.addEventListener("keypress", this.onKeyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPressed.bind(this));
  }      

  mobLookup(mob) {
    for(var i=0; i<this.mobInfo.length; i++) {
      if(this.mobInfo[i].name==mob ){
        return true;
      }
    }
  }
  
  fightMob(mob) {
    for(var i=0; i<this.mobInfo.length; i++) {
      if(this.mobInfo[i].name==mob) {
        var mob_hp = this.mobInfo[i].health;
        var mob_attack = this.mobInfo[i].attack;
      }
    }
    let player_hp = this.state.health;
    let player_attack = this.state.weapons[0].attack;
    let hitChance = .7;
    console.log("fight " + mob);
    while (player_hp > 0 && mob_hp > 0) {
      let player_roll = Math.random();
      if (player_roll <= hitChance) {
        mob_hp = mob_hp - player_attack;
        this.state.mob_hp = mob_hp;
        console.log("Player hits " + mob + "for " + player_attack);
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
        this.state.health = player_hp;
        console.log("Mob hits player for " + mob_attack);
      }
      else {
        console.log(mob + " misses.");
      }
      if (player_hp == 0) {
        console.log("You die.");
        return;
      }
    }
  }
  
  onKeyPressed(e) {
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
    else if(this.mobLookup(squares[next_square]))       { 
        this.setState({
          current_mob: squares[next_square]
        });
        this.fightMob(squares[next_square]);
      }
    else {
      return;
    }
    this.setState({
          squares: squares,
          player_index: next_square
     });
  }

  render() {
    for(var i=0; i<this.mobInfo.length; i++) {
  if(this.mobInfo[i].name==this.state.current_mob) {
    var mob = this.mobInfo[i];
    }
  else {
    var mob = {name: "none", attack: 0, health: 0, url: ""}
  }
     }
    return (
      <div onKeyPress={(e) => this.onKeyPressed(e)}>
        <div id="display">
          <div id="display-box">
            <p>Health: {this.state.health}</p>
            <p>Level: {this.state.level}</p>
            <p>XP: {this.state.xp}</p>
            <p>Weapon: {this.state.weapons[0].type}</p>
            <p>Attack: {this.state.weapons[0].attack}</p>
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
