using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Fight_system : MonoBehaviour
{
    public GameObject friendParty;
    public GameObject enemyParty;
    public GameObject spellsCanvas;
    public Sprite     defaultButtonSprite;

    private GameObject spellTarget;
    private int        spellToUse;

    void Start()
    {
        Debug.Log(friendParty.transform.childCount);
        for (int i = 0; i < enemyParty.transform.childCount; ++i)
        {
            var enemyCharacter = enemyParty.transform.GetChild(i);
            var button = enemyCharacter.GetComponent<Button>();

            Debug.Log(button);
            button.onClick.AddListener(() => whichTarget(enemyCharacter.gameObject));
        }
    }

    void whichSpellToUse(int spellIndex)
    {
        Debug.Log("Spell numero: " + spellIndex + " a été choisi.");
        spellToUse = spellIndex;
    }

    void whichTarget(GameObject target)
    {
        Debug.Log("Le spell " + spellToUse + " est lancé sur la cible " + target.name);
        spellTarget = target;
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
                spellOnCanvas.GetComponent<Button>().onClick.AddListener(() => whichSpellToUse(spellIndex));
            }
            else
                image.sprite = defaultButtonSprite;
        }
    }

    void givePlayerATurn(Character_template player)
    {
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
