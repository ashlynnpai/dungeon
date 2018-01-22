let squares = createSquares(0, []);

function createSquares(n, arr) {
  if (n == 3) {
    return arr;
  }
else {
   let level = Array.from(Array(60).fill(null));
   arr.push(level);
   return createSquares(n + 1, arr);
  }
}

//seed player, pet, fixtures
squares[0][0] = "P";
squares[0][19] = "pet";
squares[2][57] = "balrog";

let fixtures = [[25, 30, 31, 32, 39], [20, 25, 30, 35], [25, 30, 32, 34, 53]];
fixtures.forEach(function(level, i) {
  level.forEach(function(item, j) {
    squares[i][item] = "F";
  });
});

//stairs "down" "up"
//switch level in keypress
let stairs = [{level:0, index:59, direction:"down"}, {level:1, index:0, direction:"up"},
{level:1, index:59, direction:"down"}, {level:2, index:0, direction:"up"}];

stairs.forEach(function(item) {
  squares[item.level][item.index] = item.direction;
});


//random seed mobs, items




//define each level for where char is at
//render each level separately
