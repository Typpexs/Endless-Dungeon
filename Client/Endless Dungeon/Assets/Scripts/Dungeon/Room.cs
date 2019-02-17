using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Room
{
    private Vector2 coordinates;

    private Mob mobOne;
    private Mob mobTwo;
    private Mob mobThree;
    private bool chest;

    public Room(int x, int y)
    {
        coordinates = new Vector2(x, y);
        mobOne = new Mob("");
        mobTwo = new Mob("");
        mobThree = new Mob("");
        chest = false;
    }

    // CHANGER LE NOM PAR L'ID
    public void SetMobOne(string name)
    {
        mobOne.SetName(name);  
    }

    public void SetMobTwo(string name)
    {
        mobTwo.SetName(name);
    }

    public void SetMobThree(string name)
    {
        mobThree.SetName(name);
    }

    public void SetChest(bool isChest)
    {
        chest = isChest;
    }

    public Vector2 GetCoordinates()
    {
        return coordinates;
    }

    // CHANGER LE NOM PAR L'ID
    public string GetMobOne()
    {
        return mobOne.GetName();
    }

    public string GetMobTwo()
    {
        return mobTwo.GetName();
    }

    public string GetMobThree()
    {
        return mobThree.GetName();
    }

    public bool GetChest()
    {
        return chest;
    }
}
