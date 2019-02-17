using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lane
{
    private Vector2 coordinates;
    private Trap trap;

    public Lane(int x, int y)
    {
        coordinates = new Vector2(x, y);
        trap = new Trap("");
    }

    // CHANGER LE NOM PAR L'ID
    public void SetTrap(string name)
    {
        trap.SetName(name);
    }

    public Vector2 GetCoordinates()
    {
        return coordinates;
    }

    // CHANGER LE NOM PAR L'ID
    public string GetTrapOne()
    {
        return trap.GetName();
    }

}
