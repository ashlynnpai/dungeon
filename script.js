class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    this.rowSize = 20;
    const startPoint = 20;
    let grids = Array(this.size).fill("S");
    let spaces = [21, 22, 23, 24, 42, 43, 44, 62, 63, 64,
                 25, 26, 27, 46, 47, 66, 67, 86, 87, 48, 49, 50];
    
    for (let i=0; i<grids.length; i++) {
      if(spaces.includes(i)) {
        grids[i] = null;
      }
    }
    grids[startPoint] = "P";

    this.state = {
    squares: grids,
    player_index: startPoint
                 };
  }
  
  componentWillMount() {
    document.addEventListener("keypress", this.onKeyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPressed.bind(this));
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
    if (squares[next_square] == null) {
      squares[current_square] = null;
      squares[next_square] = "P";
    }
    else {
      return;
    }
    console.log("current: " + current_square);
    console.log("next: " + next_square);
    this.setState({
          squares: squares,
          player_index: next_square
     });
  }

  render() {
    return (
      <div onKeyPress={(e) => this.onKeyPressed(e)}>
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
