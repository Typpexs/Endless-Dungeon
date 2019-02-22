using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Fight_system : MonoBehaviour
{
    public GameObject friendParty;
    public GameObject enemyParty;

    void Start()
    {
        Debug.Log(friendParty.transform.childCount);
    }

    void Update()
    {
        for (int i = 0; i < friendParty.transform.childCount; ++i)
        {
            var unitToCheck = friendParty.transform.GetChild(i).GetComponent<Character_template>();
            var isHeGettingTurn = unitToCheck.takeTurn();

            if (isHeGettingTurn)
            {
                Debug.Log(unitToCheck.name + " a pris un tour");
            }
        }
    }
}
