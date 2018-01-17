class Game extends React.Component {
  constructor(props) {
    super(props);

    this.maxPetEnergy = 10;
    this.mobsInfo = [{name: "balrog", displayName: "Balrog", attack: 5, health: 100, level: 3,
    url: "https://www.ashlynnpai.com/assets/balrog11.jpg"}
    ];
    this.weaponsInfo = [
    {name: "Iceblade", attack: 5, description: "A legendary sword forged by the dwarves.", url: "https://www.ashlynnpai.com/assets/greatsword.png"}
  ];


    this.mobSkills = [{name: "Firebomb", action: "throws", counter: "water"}, {name: "Ice Spars", action: "summons", counter: "fire"},
    {name: "Shadow", action: "casts", counter: "light"}];

    this.state = {
      health: 60,
      maxHealth: 60, //has to increase on level
      mana: 30,
      maxMana: 30, //has to increase on level
      level: 3,
      hitChance: .77,
      dodgeChance: .04,
      specialSkill: null,
      buff: null,
      pet: true,
      petEnergy: 10,
      weapons: [{name: "Iceblade", attack: 5, url: "https://www.ashlynnpai.com/assets/Power%20of%20blessing.png"}],
      attack: 6,
      inventory: [{healthPotion: 6}, {manaPotion: 4}],
      equipment: [],
      questItems:
      [1, 2, 3, 4, 5],
      current_mob: {name: "balrog", displayName: "Balrog", attack: 5, health: 100, level: 3,
    url: "https://www.ashlynnpai.com/assets/balrog11.jpg"},
      mobHp: 100,
      targetIndex: null,
      currentAction: null,
      mainLog: [],
      combatLog: [],
      message: "",
      sound: true,
      overlay: true
     };
  }

  componentWillMount() {
    document.addEventListener("keypress", this.onKeyPressed.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPressed.bind(this));
  }

  toggleSound() {
    if (this.state.sound) {
      this.setState({
        sound: false
      })
    }
    else {
      this.setState({
        sound: true
      })
    }
  }

  computeBonus() {
    //this is the length of this.state.questItems
    let count = 5;
    this.state.hitChance += count * .01;
    this.state.dodgeChance += count * .01;
  }

  startBossFight() {
    this.state.currentAction = "combat";
    this.computeBonus();
    this.mainBossFight(0, null);
  }

  mainBossFight(round, mobSpecial) {
    let log = this.state.combatLog;
    let mainLog = this.state.mainLog;
    let mob = this.state.current_mob;
    let playerHealth = this.state.health;
    let mobHealth = this.state.mobHp;
    let bossMaxHealth = 200;
    if (mob.level > this.state.level) {
      var levelDiff =  mob.level - this.state.level;
    }
    else {
      var levelDiff = 0;
    }
    let playerHitChance = this.state.hitChance - .1 * levelDiff;
    let mobHitChance = .7 + .1 * levelDiff;
    if (this.state.playerSpecial == "cloak") {
      playerHitChance -= .2;
      mobHitChance -= .2;
    }
    if (this.state.playerSpecial == "nimble") {
      playerHitChance += .2;
      mobHitChance += .2;
    }
    mobHitChance -= this.state.dodgeChance;
    let attack = this.state.attack;
    if (levelDiff >= this.state.level) {
      var modifiedPlayerAttack = attack;
    }
    else {
      let randomHit = Math.round(Math.random() * this.state.level);
      var modifiedPlayerAttack = attack + randomHit;
    }
    var modifiedMobAttack = mob.attack + (Math.round(Math.random()) * mob.level);

   // cast mob special attacks

    switch (round) {
      case 0:
        var mobSpecial = {name: "Shadow", action: "casts", counter: "light"};
        let action = "Balrog " + mobSpecial.action + " " + mobSpecial.name;
          if (this.state.sound) {
            let alertAudio = new Audio('https://www.ashlynnpai.com/assets/sms-alert-5-daniel_simon.mp3');
            alertAudio.play();
          }
        this.state.buff = mobSpecial.name;
        this.state.combatLog.unshift(action);
        this.setState({
          combatLog: this.state.combatLog,
          message: action
        });
        break;
      case 1:
      console.log(round);
      break;
      case 2:
      console.log(round);
      return
    }

    //player and pet autoattack
    let playerRoll = Math.random();

    if (playerRoll <= playerHitChance) {
      if (this.state.sound) {
        let fightAudio = new Audio('https://www.ashlynnpai.com/assets/Swords_Collide-Sound_Explorer-2015600826.mp3');
        fightAudio.play();
      }
      mobHealth -= modifiedPlayerAttack;
      let action = "Player hits " + mob.displayName + " for " + modifiedPlayerAttack;
      if (mobHealth < 0) {
        mobHealth = 0;
      }
      log.unshift(action);
    }
    else {
      let action = "Player misses.";
      log.unshift(action);
    }

    let pet = this.state.pet;
    if (pet) {
      let petRoll = Math.random();
      if (petRoll <= .8) {
        let petDamage = this.state.level;
        mobHealth -= petDamage;
        let action = "Scrappy hits " + mob.displayName + " for " + petDamage;
        if (mobHealth < 0) {
          mobHealth = 0;
        }
        log.unshift(action);
      }
      else {
        let action = "Scrappy misses.";
        log.unshift(action);
      }
    }

    this.setState({
      mobHp: mobHealth,
      combatLog: log
    });

    if (mobHealth <= 0) {
      let action1 = mob.displayName + " dies. You have reclaimed Silverhearth.";
      log.unshift(action1);
      mainLog.unshift(action1);
      this.setState({
        mobHp: 0,
        combatLog: log,
        mainLog: mainLog,
        buff: null,
        playerSpecial: null,
        current_mob: null,
        currentAction: null,
      });
      return;
    }

    //mob autoattack and damage from special attacks

    if (mobSpecial) {
      if (this.state.playerSpecial != mobSpecial.counter) {
        playerHealth -= modifiedMobAttack;
        let action = mob.displayName + " " + mobSpecial.action + " " + mobSpecial.name
        + " for " + modifiedMobAttack;
        log.unshift(action);
      }
      else if (this.state.playerSpecial == mobSpecial.counter) {
        mobHealth -= modifiedPlayerAttack;
        let action = "You counter " + mobSpecial.name + " with " + mobSpecial.counter + " for " + modifiedPlayerAttack;
        if (mobHealth < 0) {
          mobHealth = 0;
        }
        log.unshift(action);
        mobSpecial = null;
      }
    }
    this.setState({
      health: playerHealth,
      mobHp: mobHealth,
      combatLog: log
    });

    let mobRoll = Math.random();
    if (mobRoll <= mobHitChance) {
      playerHealth -= modifiedMobAttack;
      let action = mob.displayName + " hits you for " + modifiedMobAttack;
      log.unshift(action);
    }
    else {
      let action = mob.displayName + " misses."
      log.unshift(action);
    }
    this.setState({
      health: playerHealth,
      combatLog: log
    });

    if (playerHealth <= 0) {
      let action = "You die."
      log.unshift(action);
      this.setState({
        health: 0,
        living: false,
        combatLog: log,
        message: action,
        currentAction: null
      });
      return;
    }

    round++;

    setTimeout(this.mainBossFight.bind(this), 5000, round, mobSpecial);
  }

  fightMob(mob) {
    for (let i=0; i<this.mobsInfo.length; i++) {
      if (this.mobsInfo[i].name == mob) {
        var mobHash = this.mobsInfo[i];
      }
    }

    //choose mob's special skill
    let mobSpecialIndex = Math.floor(Math.random() * this.mobSkills.length);
    let mobSpecial = this.mobSkills[mobSpecialIndex];
    let action = mobHash.displayName + " " + mobSpecial.action + " " + mobSpecial.name;
    if (this.state.sound) {
      let alertAudio = new Audio('https://www.ashlynnpai.com/assets/sms-alert-5-daniel_simon.mp3');
      alertAudio.play();
    }
    let buff = this.state.buff;
    buff = mobSpecial.name;
    this.state.combatLog.unshift(action);
    this.setState({
      current_mob: mobHash,
      mobHp: mobHash.health,
      combatLog: this.state.combatLog,
      message: action,
      buff: buff
    });
    this.combatSequence(mobSpecial);
  }

  combatSequence(mobSpecial) {
    //update the mob health on this.state.mobHp not in the {}
    //this.state.playerSpecial gets updated in the keypress listener
    let log = this.state.combatLog;
    let mainLog = this.state.mainLog;
    let mob = this.state.current_mob;
    let playerHealth = this.state.health;
    let mobHealth = this.state.mobHp;
    if (mob.level > this.state.level) {
      var levelDiff =  mob.level - this.state.level;
    }
    else {
      var levelDiff = 0;
    }
    let playerHitChance = this.state.hitChance - .1 * levelDiff;
    let mobHitChance = .7 + .1 * levelDiff;
    if (this.state.playerSpecial == "cloak") {
      playerHitChance -= .2;
      mobHitChance -= .2;
    }
    if (this.state.playerSpecial == "nimble") {
      playerHitChance += .2;
      mobHitChance += .2;
    }
    mobHitChance -= this.state.dodgeChance;
    let attack = this.state.attack;
    if (levelDiff >= this.state.level) {
      var modifiedPlayerAttack = attack;
    }
    else {
      let randomHit = Math.round(Math.random() * this.state.level);
      var modifiedPlayerAttack = attack + randomHit;
    }
    var modifiedMobAttack = mob.attack + (Math.round(Math.random()) * mob.level);

    let playerRoll = Math.random();

    if (playerRoll <= playerHitChance) {
      if (this.state.sound) {
        let fightAudio = new Audio('https://www.ashlynnpai.com/assets/Swords_Collide-Sound_Explorer-2015600826.mp3');
        fightAudio.play();
      }
      mobHealth -= modifiedPlayerAttack;
      let action = "Player hits " + mob.displayName + " for " + modifiedPlayerAttack;
      if (mobHealth < 0) {
        mobHealth = 0;
      }
      log.unshift(action);
    }
    else {
      let action = "Player misses.";
      log.unshift(action);
    }

    let pet = this.state.pet;
    if (pet) {
      let petRoll = Math.random();
      if (petRoll <= .8) {
        let petDamage = this.state.level;
        mobHealth -= petDamage;
        let action = "Scrappy hits " + mob.displayName + " for " + petDamage;
        if (mobHealth < 0) {
          mobHealth = 0;
        }
        log.unshift(action);
      }
      else {
        let action = "Scrappy misses.";
        log.unshift(action);
      }
    }

    this.setState({
      mobHp: mobHealth,
      combatLog: log
    });

    if (mobHealth <= 0) {
      let action1 = mob.displayName + " dies.";
      this.state.buff = null;
      log.unshift(action1);
      mainLog.unshift(action1);
      let random = Math.floor(Math.random() * this.dropsHash[mob.level].length);
      let loot = this.dropsHash[mob.level][random];
      this.dropsHash[mob.level].splice(random, 1);
      this.processItem(loot);
      let killXp = 10 * mob.level;
      let xp = this.state.xp
      xp += killXp;
      let action2 = "You receive " + killXp + " xp.";
      mainLog.unshift(action2);
      let mobIndex = this.state.targetIndex;
      let squares = this.state.squares;
      let tip = "Press R to rest and regain health."
      mainLog.unshift(tip);
      squares[mobIndex] = null;
      squares[this.state.playerIndex] = null;
      squares[mobIndex] = "P";
      this.setState({
        mobHp: 0,
        xp: xp,
        combatLog: log,
        mainLog: mainLog,
        playerSpecial: null,
        current_mob: null,
        currentAction: null,
        playerIndex: mobIndex,
        squares: squares
      });
      this.checkLevel();
      return;
    }

    if (mobSpecial) {
      if (this.state.playerSpecial != mobSpecial.counter) {
        playerHealth -= modifiedMobAttack;
        let action = mob.displayName + " " + mobSpecial.action + " " + mobSpecial.name
        + " for " + modifiedMobAttack;
        log.unshift(action);
      }
      else if (this.state.playerSpecial == mobSpecial.counter) {
        mobHealth -= modifiedPlayerAttack;
        let action = "You counter " + mobSpecial.name + " with " + mobSpecial.counter + " for " + modifiedPlayerAttack;
        if (mobHealth < 0) {
          mobHealth = 0;
        }
        log.unshift(action);
        mobSpecial = null;
      }
    }
    this.setState({
      health: playerHealth,
      mobHp: mobHealth,
      combatLog: log
    });

    let mobRoll = Math.random();
    if (mobRoll <= mobHitChance) {
      playerHealth -= modifiedMobAttack;
      let action = mob.displayName + " hits you for " + modifiedMobAttack;
      log.unshift(action);
    }
    else {
      let action = mob.displayName + " misses."
      log.unshift(action);
    }
    this.setState({
      health: playerHealth,
      combatLog: log
    });

    if (playerHealth <= 0) {
      let action = "You die."
      log.unshift(action);
      this.setState({
        health: 0,
        living: false,
        combatLog: log,
        message: action,
        currentAction: null
      });
      return;
    }
    setTimeout(this.combatSequence.bind(this), 2000, mobSpecial);
  }

 onKeyPressed(e) {
      if (this.state.currentAction) {
        //set a special state and in combat check if state is true
        //only one state can be active at a time
        let log = this.state.combatLog;
        let skillKeys = {1: "fury", 2: "bite", 3: "heal", 4: "mana potion", 5: "health potion",
        6: "water", 7: "fire", 8: "light", 9: "cloak", 0: "nimble"};
        let health = this.state.health;
        let mana = this.state.mana;
        let mobHealth = this.state.mobHp;
        let level = this.state.level;
        let attack = this.state.attack;

        if (e.key in skillKeys) {
          if (e.key =="1") {
            if (mana >= 3) {
              let furyDamage = level * 2 + attack + Math.round(Math.random() * attack);
              mana -= 3;
              mobHealth -= furyDamage;
              if (mobHealth < 0) {
                mobHealth = 0;
              }
              let action = "You use Fury for " + furyDamage + ".";
              log.unshift(action);
            }
            else {
              let action = "Out of mana.";
              log.unshift(action);
            }
          }
          else if (e.key =="2") {
            let pet = this.state.pet;
            if (pet) {
              var energy = this.state.petEnergy;
              if (energy >= 3) {
                if (this.state.sound) {
                  let catAudio = new Audio('https://www.ashlynnpai.com/assets/Kitten%20Meow-SoundBible.com-1295572573.mp3');
                  catAudio.play();
                }
                mobHealth -= (level * 2);
                energy -= 3;
                let action = "Scrappy bites for " + (level * 2) + ".";
                log.unshift(action);
                this.state.petEnergy = energy;
              }
            }
            else {
              let action = "Your mouth is filled with fleas but you do no damage.";
              log.unshift(action);
            }
          }
          else if (e.key =="3") {
            if (mana >= 4) {
              health += 10;
              mana -= 4;
              if (this.state.sound) {
                let healAudio = new Audio('https://www.ashlynnpai.com/assets/blessing.ogg');
                healAudio.play();
              }
              let action = "You cast heal for 10 health.";
              log.unshift(action);
            }
            else {
              let action = "Out of mana.";
              log.unshift(action);
            }
          }
          else if (e.key =="4") {
            if (this.state.inventory[1].manaPotion > 0) {
              mana += 10;
              if (this.state.sound) {
                let healAudio = new Audio('https://www.ashlynnpai.com/assets/blessing2.ogg');
                healAudio.play();
              }
              let action = "You consume mana potion.";
              log.unshift(action);
              if (mana > this.state.maxMana) {
                mana = this.state.maxMana;
              }
              this.state.inventory[1].manaPotion--;
            }
          }
          else if (e.key =="5") {
            if (this.state.inventory[0].healthPotion > 0) {
              health += 10;
              if (this.state.sound) {
                let healAudio = new Audio('https://www.ashlynnpai.com/assets/blessing.ogg');
                healAudio.play();
              }
              let action = "You consume health potion.";
              log.unshift(action);
              if (health > this.state.maxHealth) {
                health = this.state.maxHealth;
              }
              this.state.inventory[0].healthPotion--;
            }
          }
          else if (e.key == "6" || e.key == "7" || e.key == "8" || e.key == "9" || e.key == "0") {
            let sounds = [
              {6: 'https://www.ashlynnpai.com/assets/water.ogg'},
              {7: 'https://www.ashlynnpai.com/assets/flamethrower.ogg'},
              {8: 'https://www.ashlynnpai.com/assets/blessing.ogg'},
              {9: 'https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3'},
              {0: 'https://www.ashlynnpai.com/assets/Electronic_Chime-KevanGC-495939803.mp3'}
            ]

            let skill = skillKeys[e.key];
            this.state.playerSpecial = skill;
            let action = "You use " + skill;
            if (this.state.sound) {
              let audio = new Audio(sounds[e.key]);
              audio.play();
            }
            var buff = this.state.buff;
            buff = skill;
            log.unshift(action);
            this.setState({
              buff: buff
            })
          }
          this.setState({
            health: health,
            mobHp: mobHealth,
            mana: mana,
            combatLog: log,
          })
        }
        else {
          return;
        }
    }
  }

  render() {
    let health = this.state.health;
    let healthPercent = Math.round((health/this.state.maxHealth)*100);
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

    let mana = this.state.mana;
    let manaPercent = Math.round((mana/this.state.maxMana)*100);
    var manaBar = {
      width: manaPercent + "%",
      color: "#fff"
    };

    let pet = this.state.pet;
    let petUrl = "https://www.ashlynnpai.com/assets/yoppy.png";
    if (pet) {
      var petEnergy = this.state.petEnergy;
      var maxPetEnergy = this.maxPetEnergy;
      var petEnergyPercent = Math.round((petEnergy/maxPetEnergy)*100);
      var petEnergyBar = {
        width: petEnergyPercent + "%",
        color: "#fff"
      };
    }

    let mob = this.state.current_mob;
      if (mob) {
        var mobUrl = mob.url;
        var mobHealth = this.state.mobHp;
        var mobMaxHealth = mob.health;
        var mobHealthPercent = Math.round((mobHealth/mobMaxHealth)*100);
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
    }

    let levelInfo = {1:50, 2:100, 3:200, 4:1000};
    let level = this.state.level;
    var xpGoal = levelInfo[level];
    let xpPercent = Math.round((this.state.xp/xpGoal)*100);
    var xpBar = {
        width: xpPercent + "%",
        color: "#fff"
    };

    const specialSkills = [
{number: 6, name: "FLOOD", description: "A spray of water from your flask extinguishes flame."},
{number: 7, name: "FIRE", description: "Flame from your torch melts spears of ice."},
{number: 8, name: "LIGHT", description: "Light banishes the shadow."},
{number: 9, name: "CLOAK", description: "Decreases both your and your enemys chance to hit."},
{number: 0, name: "NIMBLE", description: "Increases both your and your enemys chance to hit."}
 ]

    const buffs = [
      {name: "water", url: "https://www.ashlynnpai.com/assets/horropen_water.png", type: "good"},
      {name: "fire", url: "https://www.ashlynnpai.com/assets/14.png", type: "good"},
      {name: "light", url: "https://www.ashlynnpai.com/assets/18.png", type: "good"},
      {name: "cloak", url: "https://www.ashlynnpai.com/assets/horrorpen_124.png", type: "good"},
      {name: "nimble", url: "https://www.ashlynnpai.com/assets/70.png", type: "good"},
      {name: "Firebomb", url: "https://www.ashlynnpai.com/assets/Wall%20of%20Fire.png", type: "bad"},
      {name: "Ice Spars", url: "https://www.ashlynnpai.com/assets/Blizzard.png", type: "bad"},
      {name: "Shadow", url: "https://www.ashlynnpai.com/assets/shadow.png", type: "bad"},
      {name: "rest", url: "https://www.ashlynnpai.com/assets/Tent-Sleep-icon.png", type: "good"}
    ]

    var weapon = this.state.weapons[0].name;

    if (this.state.buff) {
      let currentBuff = buffs.filter(b => b.name == this.state.buff);
      var buffUrl = currentBuff[0].url;
      if (currentBuff[0].type == "good") {
        var buffStyle = {
          border: '3px solid #000'
        };
      }
      else {
        var buffStyle = {
          border: '3px solid red'
        };
      }
    }
    else {
      var buffUrl = null;
    }




    return (
      <div onKeyPress={(e) => this.onKeyPressed(e)}>
      <div className = "main">

      <div className = "ui">
        <div>
          {this.state.sound ? (
            <div>
              <img onClick={() => this.toggleSound()} width="40" src="https://www.ashlynnpai.com/assets/if_speaker_40842.png" />
            </div>
          ) : (
            <div>
              <img onClick={() => this.toggleSound()} width="40" src="https://www.ashlynnpai.com/assets/if_speaker_mute_40843.png" />
            </div>
          )}
          <div>
            <img onClick={() => this.toggleOverlay()} width="40" src="https://www.ashlynnpai.com/assets/if_help_black_40796.png" />
          </div>
        </div>
        <div>
          {pet ? (
            <div className="avatar" id="petAvatar">
              <img width="30" src="https://www.ashlynnpai.com/assets/yoppy.jpg" />
            </div>
          ) : (
            <div className = "blankAvatar">
            </div>
          )}
        </div>
        <div>
          {pet ? (
             <div>
               <div className="petNameplate">
                <div>Scrappy</div>
               </div>
               <div className={"orange progress-bar"} id="petBar">
                <span style={petEnergyBar}>{petEnergy}/{maxPetEnergy}</span>
               </div>
             </div>
            ) : (
              <div className="blankPet">
              </div>
            )}
       </div>

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
            <span style={healthBar}>{health}/{this.state.maxHealth}</span>
          </div>
          <div className = {"blue progress-bar"}>
            <span style={manaBar}>{mana}/{this.state.maxMana}</span>
          </div>
          <div className="buffSection">
            <img style={buffStyle} width="30" src={buffUrl}/>
          </div>
        </div>


        <div>
          {mob ? (
            <div>
              <div className = "nameplate">
                <div>{mob.displayName}</div>
              </div>
              <div className = {mobHealthColor + " progress-bar"}>
                <span style={mobHealthBar}>{mobHealth}/{mobMaxHealth}   </span>
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
                <img src ={mob.url} width="50"/>
              </div>
            </div>
          ) : (
             <div className = "blankAvatar">
             </div>
          )}
        </div>
     </div>
     <button onClick={() => this.startBossFight()}>Start Fight</button>
     <div className="topInfo">
       <div className="fastStats">
          <p>Level {this.state.level}</p>
          <p>{weapon}</p>
          <p>Attack {this.state.attack}</p>
       </div>
       <div className="fastStats">
          <p>Hit {this.state.hitChance.toFixed(2)} </p>
          <p>Dodge {this.state.dodgeChance.toFixed(2)} </p>
        </div>
        <div className="messageDisplay">{this.state.message}</div>
     </div>


    <div className='ui'>
      <div>
        <div className="toolbar">
          <span id="toolbar1" className="toolbarItem">1
            <div className="toolbarTip">
              <p id="offensive">FURY</p>
              <p id="skillCost">Costs 2 mana.</p>
              <div id="skillDescription">You become enraged and land a forceful hit on your enemy.</div>
            </div>
          </span>
          <span id="toolbar2" className="toolbarItem">2
            {pet ? (
            <div className="toolbarTip">
              <p id="offensive">BITE</p>
              <p id="skillCost">Costs 5 energy</p>
              <div id="skillDescription">Scrappys bite wounds the enemy.</div>
            </div>
            ) : (
            <div className="toolbarTip">
              <p id="offensive">BITE</p>
              <div id="skillDescription">Do you really want to bite your target?</div>
            </div>
            )}
          </span>
          <span id="toolbar3" className="toolbarItem">3
            <div className="toolbarTip">
              <p id="defensive">HEAL</p>
              <p id="skillCost">Costs 5 mana.</p>
              <div id="skillDescription">HEAL yourself for half your total health.</div>
             </div>
          </span>
          <span id="toolbar4" className="toolbarItem">4
            <div className="potionCount">{this.state.inventory[1].manaPotion}</div>
            <div className="toolbarTip">
              <p id="defensive">MANA POTION</p>
              <p id="skillCost">Consumes one potion.</p>
              <div id="skillDescription">Restores 10 mana.</div>
            </div>
          </span>
          <span id="toolbar5" className="toolbarItem">5
             <div className="potionCount">{this.state.inventory[0].healthPotion}</div>
             <div className="toolbarTip">
               <p id="defensive">HEALING POTION</p>
               <p id="skillCost">Consumes one potion.</p>
               <div id="skillDescription">Restores 10 health.</div>
             </div>
          </span>
        </div>
        <div className="toolbar">
           {specialSkills.map((skill) =>
            <span id={"toolbar"+skill.number} className="toolbarItem">{skill.number}
            <div className="toolbarTip">
              <p id="offensive">{skill.name}</p>
              <div id="skillDescription">{skill.description}</div>
              <div id="skillCost">SPECIAL. Only one special skill can be active at a time</div>
            </div>
          </span>
         )}
         </div>
        <div className = "toolbar" id = "questItems">
          {this.state.questItems.map((questItem) =>
            <span><img src={questItem.url}></img></span>)}
           </div>
      </div>

      <div className="display-log">
        {this.state.mainLog.map((logLine) =>
       <div id="logLine">{logLine}</div>)}
      </div>
      <div className="display-log">
        {this.state.combatLog.map((combatEvent) =>
       <div id="logLine">{combatEvent}</div>)}
      </div>
    </div>
  </div>
</div>
);
}}





ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
