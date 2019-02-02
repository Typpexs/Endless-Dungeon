module.exports = class ClasseEnum {
    constructor() {
        this.classEnum = Object.freeze({
            "mage":0,
            "paladin":1,
            "warrior":2,
            "ranger":3,
            "rogue":4,
            "priest":5
        })

        this.classTab = [
            "mage",
            "paladin",
            "warrior",
            "ranger",
            "rogue",
            "priest"
        ]
    }

    getClassEnum(numEnum) {
        return this.classEnum[numEnum];
    }

    getSizeClassEnum() {
        return Object.keys(this.classEnum).length;
    }

    getClassTab(numEnum) {
        return this.classTab[numEnum];
    }
};