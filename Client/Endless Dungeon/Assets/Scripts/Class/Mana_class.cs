using System;

/*
 * This class is representing classes using mana.
 */
public class Mana_class : Basic_class
{
    protected ushort manaMax;
    protected ushort spellPower;

    public Mana_class() : base()
    {
    }

    public virtual ushort manaRegen()
    {
        return (ushort)Math.Round(spirit * 0.8);
    }
}
