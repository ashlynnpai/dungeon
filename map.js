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

squares = seedFixtures(squares);

function seedFixtures(squares) {
  let fixtures = [[25, 30, 31, 32, 39], [20, 25, 30, 35], [25, 30, 32, 34, 53]];
  fixtures.forEach(function(level, i) {
    level.forEach(function(item, j) {
      squares[i][item] = "F";
    });
  });
  return squares;
}

//seed reserve spots
squares = seedReserves(squares);
function seedReserves(squares) {
  let reserves = [[1, 2, 58], [1, 2, 58], [1, 2]];
  reserves.forEach(function(level, i) {
    level.forEach(function(item, j) {
      squares[i][item] = "R";
    });
  });
  return squares;
}

//stairs "down" "up"

squares = seedStairs(squares);

function seedStairs(squares) {
  let stairs = [{level:0, index:59, direction:"down"}, {level:1, index:0, direction:"up"},
  {level:1, index:59, direction:"down"}, {level:2, index:0, direction:"up"}];

  stairs.forEach(function(item) {
    squares[item.level][item.index] = item.direction;
  });
  return squares;
}

//random seed mobs, items
squares = seedMobs(squares, 0, 0);

function seedMobs(squares, count, index) {
  let mobSeeds = ["goblin1", "goblin2", "orc1"];
  let seeded = false;
  if (index == 3) {
    return squares;
  }
  while (!seeded) {
    let randomIndex = Math.floor(Math.random() * 60);
    if (squares[index][randomIndex] == null) {
      squares[index][randomIndex] = mobSeeds[index];
      seeded = true;
      count++;
    }
  }
  if (count == 4) {
    index++;
    count = 0;
  }
  return seedMobs(squares, count, index);
}

console.log(squares);

//switch level in keypress
//set image of square in render hash
let squareImages = [{name: "P", url: ""}];
//if square == "goblin", img == imgurl
//define each level for where char is at
//render each level separately
