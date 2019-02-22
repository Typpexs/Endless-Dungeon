using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Character_template : MonoBehaviour
{
    protected Basic_spell[] spellsInActionBar = new Basic_spell[Constants.numberOfSpellInActionBar];
    protected Basic_class template;
    protected byte speedForTurn;
    public byte level;

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
}
