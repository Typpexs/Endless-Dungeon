using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Dungeon
{
    private List<Room> roomList;
    private List<Lane> laneListVertical;
    private List<Lane> laneListHorizontal;

    public Dungeon(List<Room> rml, List<Lane> llv, List<Lane> llh)
    {
        roomList = rml;
        laneListVertical = llv;
        laneListHorizontal = llh;
    }

    public List<Room> GetRoomList()
    {
        return roomList;
    }

    public List<Lane> GetLaneListVertical()
    {
        return laneListVertical;
    }

    public List<Lane> GetLaneListHorizontalt()
    {
        return laneListHorizontal;
    }
}
