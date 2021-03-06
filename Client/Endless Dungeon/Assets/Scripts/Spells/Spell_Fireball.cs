﻿#undef DEBUG
//#define DEBUG
using UnityEngine;

/*
 * This class is the first basic spell of mages.
 */
public class Spell_Fireball : Basic_spell
{
    public Spell_Fireball() : base(10, "Boule de feu",
                                    "Lance une boule de feu qui inflige des points de dégâts de Feu.",
                                    SpellTypes.MAGIC, SpellElement.FIRE)
    {
    }

    public override void use(GameObject target)
    {
        target.GetComponent<Character_template>().TakeDamage((ushort)damage);
        Debug.Log("The player " + target.name + " a pris " + (ushort)damage + " points de dégats");
    }

    /*
     * Use this function when a spell is assign to a character.
     */
    public override void update(Basic_class player, byte level)
    {
        spellCost += level;
        damage = (level * 0.6) + (player.spellPower * 60 / 100);
        detailledDescription = string.Format("Lance une boule de feu qui inflige {0:D}" +
            " points de dégâts de Feu.", (uint)damage);
#if (DEBUG)
        Debug.Log("Debug du spell " + spellName + ":");
        Debug.Log("Le spell coute " + spellCost + " mana.");
        Debug.Log("Le joueur est niveau " + level + ".");
        Debug.Log("le joueur a " + player.intelligence + " d'intelligence donc "
                + player.spellPower + " de spell power.");
        Debug.Log("La formule est level * 0.6 + spellPower * 60%. Cela revient donc a "
            + damage + " de degats.");
        Debug.Log(detailledDescription);
#endif
    }
}
