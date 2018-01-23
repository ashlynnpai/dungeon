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

squares = seedItems(squares, 0);

function seedItems(squares, i) {
  let findableItems = [{level: 0, item: "Rune"}, {level: 0, item: "Meatchopper"}, {level: 1, item: "Brooch"},
  {level: 1, item: "Necklace"}, {level: 1, item: "Slicer"},
  {level: 2, item: "Book"}, {level: 2, item: "Iceblade"}, {level: 2, item: "Orb"}];
  let seeded = false;

  if (i == findableItems.length) {
    return squares;
  }
  //change to this.findableItems
  else {
    while (!seeded) {
      let randomIndex = Math.floor(Math.random() * 60);
      if (squares[findableItems[i].level][randomIndex] == null) {
        squares[findableItems[i].level][randomIndex] = findableItems[i].item;
        seeded = true;
        i++;
      }
    }
    return seedItems(squares, i);
  }
}

//rewrite processFindableItems(nextIndex), not using "I"

processFoundItems(itemName) {
   if (this.weaponLookup(itemName)) {
     this.equipWeapon(itemName);
   }
   else if (this.questItemLookup(itemName)) {
     this.processQuestItem(itemName);
   }
 }

 foundItemLookup(squares[next_square]) {
   if (this.findableItems.filter(findableItem => findableItem.item == squares[next_square]).length > 0) {
      return true;
    };
 }

//keypress rewrite
 else if(this.foundItemLookup(squares[next_square])) {
   this.processFoundItems(squares[next_square]);
   squares[current_square] = null;
   squares[next_square] = "P";
   this.playSound('https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3');
 }


//switch maplevel in keypress when char hits stairs
//rewrite fixtures to put name of fixture and set background in css
