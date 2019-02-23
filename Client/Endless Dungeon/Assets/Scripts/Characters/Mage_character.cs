using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Mage_character : Character_template
{
    void Start()
    {
        template = new Mage_template(new ushort[] 
            { 10, 2, 3, 10, 1, 10, 50, 6, 5, 0, 0, 1});
        template.spellUpdate(level);
        spellsInActionBar[(int)Basic_spell.SpellPosition.BASIC] = 
                template.attacks[(int)Basic_spell.SpellPosition.BASIC][0];
        maxHealth = template.stamina;
        maxHealth *= 3;
        currentHealth = maxHealth;
        speedForTurn = 0;
    }
}
