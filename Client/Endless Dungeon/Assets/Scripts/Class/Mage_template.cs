using System.Collections.Generic;
using UnityEngine;

/*
 * This class is designing what a mage is. 
 * Mage uses mana to cast spells.
 * Spells will be listed here.
 */
public class Mage_template : Mana_class
{
    public Mage_template(ushort[] initStatArray) : base(initStatArray)
    {
        attacks[(int)Basic_spell.SpellPosition.BASIC] = new List<Basic_spell>
        {
            new Spell_Fireball()
        };
    }

    public override void spellUpdate(byte level)
    {
        for (int i = 0; i < attacks.Length; ++i)
        {
            for (int j = 0; j < attacks[i].Count; ++j)
                attacks[i][j].update(this, level);
        }
    }
}

