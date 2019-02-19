﻿/*
 * This class is the mother of all spells.
 * Every spell in the game will derived from this class
 */

public class Basic_spell
{
    public enum SpellTypes
    {
        MAGIC = 0,
        PHYSICAL = 1,
        PASSIVE
    };
    public enum SpellElement
    {
        FIRE = 0,
        FROST = 1,
        ARCANE = 2
    };

    protected string    description;
    protected string    exactDescription;
    protected string    spellName;
    protected double    damage;
    protected byte      spellCost;
    protected SpellTypes spellType;
    protected SpellElement spellElem;

    public Basic_spell()
    {
    }

    public virtual void use()
    {
    }

    public virtual void update()
    {
    }
}