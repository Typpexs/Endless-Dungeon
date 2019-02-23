using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Fight_system : MonoBehaviour
{
    public GameObject friendParty;
    public GameObject enemyParty;
    public GameObject spellsCanvas;
    public GameObject targetButtonTemporary;
    public Sprite     defaultButtonSprite;

    private Character_template charPlaying;
    private GameObject spellTarget;
    private int        spellToUse;

    void Start()
    {
        for (int i = 0; i < enemyParty.transform.childCount; ++i)
        {
            var enemyCharacter = enemyParty.transform.GetChild(i);
            var enemyCharacterButton = targetButtonTemporary.transform.GetChild(i);
            var button = enemyCharacterButton.GetComponent<Button>();
            var tmpSpellTarget = enemyCharacter.gameObject;

            button.onClick.AddListener(() => whichTarget(tmpSpellTarget));
        }
        for (int i = 0; i < spellsCanvas.transform.childCount; ++i)
        {
            var spellOnCanvas = spellsCanvas.transform.GetChild(i);
            var spellIndex = i;

            spellOnCanvas.GetComponent<Button>().onClick.AddListener(() => whichSpellToUse(spellIndex));
        }
    }

    void whichSpellToUse(int spellIndex)
    {
        Debug.Log("Spell numero: " + spellIndex + " a été choisi.");
        spellToUse = spellIndex;
    }

    void whichTarget(GameObject target)
    {
        Debug.Log("Le spell " + spellToUse + " est lancé sur la cible " + target.name + " par " + charPlaying.name + ".");
        spellTarget = target;
        charPlaying.useSpell(spellToUse, target);
    }

    /*
     * Changing the display of each spell in canvas depending on the ally player taking a turn
     */
    void changeSpellCanvas(Character_template characterPlaying)
    {
        for (int i = 0; i < spellsCanvas.transform.childCount; ++i)
        {
            var spellOnCanvas = spellsCanvas.transform.GetChild(i);
            Image image = spellOnCanvas.GetComponent<Image>();

            if (characterPlaying.hasSpellIn(i))
            {
                int spellIndex = i;
                image.sprite = Resources.Load("Images/Spells/" + characterPlaying.getSpellName(i), typeof(Sprite)) as Sprite;
            }
            else
                image.sprite = defaultButtonSprite;
        }
    }

    void givePlayerATurn(Character_template player)
    {
        charPlaying = player;
        changeSpellCanvas(player);
    }

    void Update()
    {
        for (int i = 0; i < friendParty.transform.childCount; ++i)
        {
            var unitToCheck = friendParty.transform.GetChild(i).GetComponent<Character_template>();
            var isHeGettingTurn = unitToCheck.takeTurn();

            if (isHeGettingTurn)
            {
                givePlayerATurn(unitToCheck);
            }
        }
    }
}
