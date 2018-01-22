let squares = createSquares(0, []);

function createSquares(n, arr) {
  if (n == 3) {
  	console.log(arr);
    return arr;
  }
else {
   let level = Array.from(Array(60).fill(null));
   arr.push(level);
   return createSquares(n + 1, arr);
  }
}

//seed player, pet, fixtures

let fixtures = [[25, 30, 31, 32], [25, 30, 35], [25, 30, 32, 34]];
fixtures.forEach(function(level, i) {
  level.forEach(function(item, j) {
    squares[i][item] = "F";
  });
});

//stairs "down" "up"
//switch level in keypress
let stairs = [{level:0, index:59, direction:"down"}, {level:1, index:0, direction:"up"}];




//random seed mobs, items




//define each level for where char is at
//render each level separately
