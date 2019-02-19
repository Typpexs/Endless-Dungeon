using System.Collections.Generic;

/*
 * This class is designing what a mage is. 
 * Mage uses mana to cast spells.
 * Spells will be listed here.
 */

public class Mage_template : Mana_class
{
    public static List<Basic_spell> baseAttack = new List<Basic_spell>();

    public Mage_template() : base()
    {
        baseAttack.Add(new Spell_Fireball());
    }
}

