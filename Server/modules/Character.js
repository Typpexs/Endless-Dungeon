var classeEnumModule = require('./ClasseEnum');
let classeEnum = new classeEnumModule();
var toolsModule = require('./Tools');
let tools = new toolsModule();


module.exports = class Character {
    constructor(levelUser) {
        this.levelUser = levelUser;

        this.classe = 0;
        this.sexe = 0;
        this.name = "rodriguez";
        this.level = 1;
        this.experience = 0;
        this.hpMax = 0;
        this.manaMax = null;
        this.principaleStats = {
            stamina: 0,
            armor: 0,
            strength: 0,
            dexterity: 0,
            intelligence: 0,
            speed: 0
        }
        this.secondaryStats = { 
            criticalRate: 0,
            criticalDamage: 0,
            spirit: 0,
            touch: 0,
            dodge: 0,
            block: 0,
            resistance: 0
        }
        this.secondaryStatsTab = [
            "criticalRate",
            "criticalDamage",
            "spirit",
            "touch",
            "dodge",
            "block",
            "resistance"
        ]
    }

    createNewCharacter() {
        this.classe = tools.getRandomIntInclusive(0, classeEnum.getSizeClassEnum());
        this.sexe = tools.getRandomIntInclusive(0, 1);
        this.level = tools.getRandomIntInclusive(1, this.levelUser);
        this.hpMax = tools.getRandomIntInclusive(10, 30)+this.level;
        console.log(this.classe);
        if (classeEnum.getClassEnum(this.classe) != "warrior" && classeEnum.getClassEnum(this.classe) != "rogue") {
            this.manaMax = tools.getRandomIntInclusive(10, 30)+this.level;
        }
        this.principaleStats = {
            stamina: tools.getRandomIntInclusive(0+this.level*0.1, 8+this.level*0.5),
            armor: tools.getRandomIntInclusive(0+this.level*0.1, 8+this.level*0.5),
            strength: tools.getRandomIntInclusive(0+this.level*0.1, 8+this.level*0.5),
            dexterity: tools.getRandomIntInclusive(0+this.level*0.1, 8+this.level*0.5),
            intelligence: tools.getRandomIntInclusive(0+this.level*0.1, 8+this.level*0.5),
            speed: tools.getRandomIntInclusive(0+this.level*0.1, 8+this.level*0.3)
        }
        let i = 0;
        while (i < 4)
        {
            let iteratorStats = tools.getRandomIntInclusive(0, Object.keys(this.secondaryStats).length-1);
            console.log(iteratorStats);
            console.log(this.secondaryStats["criticalRate"]);
            if (this.secondaryStats[this.secondaryStatsTab[iteratorStats]] == 0) {
                this.secondaryStats[this.secondaryStatsTab[iteratorStats]] = tools.getRandomIntInclusive(this.level*0.1, 5+this.level*0.3);
                i++;
            }
        }
    }
};