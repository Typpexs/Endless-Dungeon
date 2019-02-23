using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Character_template : MonoBehaviour
{
    protected Basic_spell[] spellsInActionBar = new Basic_spell[Constants.numberOfSpellInActionBar];
    protected Basic_class template;
    protected byte speedForTurn;
    public byte level;
    public Slider healthBar;

    // A CHANGER APRES LES TESTS
    protected ushort currentHealth;
    protected ushort maxHealth;

    public void Update()
    {
        if (currentHealth == 0)
        {
            healthBar.value = 0;
            gameObject.SetActive(false);
            healthBar.gameObject.SetActive(false);
        }
        else
            healthBar.value = ((float)currentHealth / maxHealth) * 100;
    }

    public bool takeTurn()
    {
        speedForTurn += (byte)template.speed;
        if (speedForTurn >= Constants.speedForTakingATurn)
        {
            speedForTurn -= Constants.speedForTakingATurn;
            return true;
        }
        return false;
    }

    public string getSpellName(int spellIndex)
    {
        return (spellsInActionBar[spellIndex].getSpellName());
    }

    public bool hasSpellIn(int spellIndex)
    {
        if (spellIndex + 1 > Constants.numberOfSpellInActionBar)
            return false;
        if (spellsInActionBar[spellIndex] != null)
            return true;
        return false;
    }

    public void useSpell(int spellIndex, GameObject target)
    {
        spellsInActionBar[spellIndex].use(target);
    }

    public void TakeDamage(ushort dmg)
    {
        if (dmg > currentHealth)
        {
            currentHealth = 0;
        }
        else
            currentHealth -= dmg;
    }
}
