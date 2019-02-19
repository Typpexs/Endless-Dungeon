/*
 * This class is the first basic spell of mages.
 */

public class Spell_Fireball : Basic_spell
{
    public Spell_Fireball() : base()
    {
        spellName = "Boule de feu";
        spellCost = 10;
        description = "Lance une boule de feu qui inflige des points de dégâts de Feu.";
        spellType = SpellTypes.MAGIC;
        spellElem = SpellElement.FIRE;
    }

    public override void use()
    {

    }

    /*
     * Use this function when a spell is assign to a character.
     */
    public override void update(/* Replace here with the char class */)
    {
        //spellCost += level;
        //damage = (level * 0.6) + (spellPower * 60 / 100);
        //exactDescription = string.Format("Lance une boule de feu qui inflige {0:D} points de dégâts de Feu.", damage);
    }
}
