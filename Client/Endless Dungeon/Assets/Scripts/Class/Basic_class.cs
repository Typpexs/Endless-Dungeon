using System.Collections.Generic;

/*
 * This class is the mother of all classes in the game.
 */
public class            Basic_class
{
    public ushort    stamina { get { return statArray[0]; } }
    public ushort    strength { get { return statArray[1]; } }
    public ushort    dexterity { get { return statArray[2]; } }
    public ushort    intelligence { get { return statArray[3]; } }
    public ushort    speed { get { return statArray[4]; } }
    public ushort    critRate { get { return statArray[5]; } }
    public ushort    critDmg { get { return statArray[6]; } }
    public ushort    spirit { get { return statArray[7]; } }
    public ushort    hitRating { get { return statArray[8]; } }
    public ushort    dodge { get { return statArray[9]; } }
    public ushort    block { get { return statArray[10]; } }
    public ushort    resistance { get { return statArray[11]; } }
    // All above stats are default class stats. 
    // They need to be initialize every time you create a new character (12 total)
    // You WILL init them all with an array of ushort[12]
    protected ushort[] statArray;
    public ushort    spellPower { get; }
    // Here is the list of attacks for every class.
    public List<Basic_spell>[] attacks = new List<Basic_spell>[Constants.numberOfSpellInActionBar];

    public Basic_class(ushort[] initStatArray)
    {
        statArray = initStatArray;
        spellPower = intelligence;
        spellPower *= 2;
    }

    public virtual void spellUpdate(byte level)
    {
    }
}
