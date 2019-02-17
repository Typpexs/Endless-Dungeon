using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Mob
{
    private string name;

    public Mob(string rename)
    {
        name = rename;
    }

    public void SetName(string rename)
    {
        name = rename;
    }

    public string GetName()
    {
        return name;
    }
}
