class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 200;
    let grids = Array(this.size).fill("S");
    let spaces = [1, 2, 3, 4, 22, 23, 24, 42, 43, 44,
                 25, 26, 27, 46, 47, 66, 67];
    
    for (let i=0; i<grids.length; i++) {
      if(spaces.includes(i)) {
        grids[i] = null;
      }
    }
    grids[0] = "P";

    this.state = {
    squares: grids,
    player_index: 0
                 };
  }

 handleEvent() {
   const current_square = this.state.player_index;
   const next_square = current_square + 1;
   const squares = this.state.squares;
   if (next_square == squares[null]) {
     squares[current_square] = null;
     squares[next_square] = "P";
   }
   this.setState({
        squares: squares,
        player_index: next_square
    });
 }
  render() {
    return (
      <div>
        <div id="board" className="flex-container">
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
