using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Utils : MonoBehaviour
{
    static public string ChangeObjectStringToString(string stringToChange)
    {
        string[] stringToChangeTab = stringToChange.Split(' ');
        return stringToChangeTab[0];
    }
}
