using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MiniJSON;

public class Utils : MonoBehaviour
{
    static public string ChangeObjectStringToString(string stringToChange)
    {
        string[] stringToChangeTab = stringToChange.Split(' ');
        return stringToChangeTab[0];
    }

    static public Dictionary<string, object> ChangeStringJsonToOjbect(string stringToChange)
    {
        return Json.Deserialize(stringToChange) as Dictionary<string, object>;
    }
}
