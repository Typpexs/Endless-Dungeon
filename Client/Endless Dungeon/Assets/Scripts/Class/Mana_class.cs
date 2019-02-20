using System;

/*
 * This class is representing classes using mana.
 */
public class Mana_class : Basic_class
{
    public ushort manaMax { get; }

    public Mana_class(ushort[] initStatArray) : base(initStatArray)
    {
        manaMax = intelligence;
        manaMax *= 3;
    }

    public virtual ushort manaRegen()
    {
        return (ushort)Math.Round(spirit * 0.8);
    }
}
