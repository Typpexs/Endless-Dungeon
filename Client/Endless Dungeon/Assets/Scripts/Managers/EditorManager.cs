using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EditorManager : Singleton<EditorManager>
{

    public GameObject canvasForRoom;
    public GameObject canvasForLane;
    public Button exitRoom;
    public Button save;
    public Button saveLane;
    public Button exitLane;
    public InputField mobOne;
    public InputField mobTwo;
    public InputField mobThree;
    public InputField trapOne;
    public Toggle chest;

    private Room room;
    private Lane lane;
    private List<Room> roomList;
    private List<Lane> laneListVertical;
    private List<Lane> laneListHorizontal;


    protected override void init()
    {
        roomList = new List<Room>();
        laneListVertical = new List<Lane>();
        laneListHorizontal = new List<Lane>();
        exitRoom.onClick.AddListener(ExitRoom);
        save.onClick.AddListener(SaveRoom);
        saveLane.onClick.AddListener(SaveLane);
        exitLane.onClick.AddListener(ExitLane);
    }

    public void AddRoom(int x, int y)
    {
        roomList.Add(new Room(x, y));
    }

    public void AddLaneVertical(int x, int y)
    {
        laneListVertical.Add(new Lane(x, y));
    }

    public void AddLaneHorizontal(int x, int y)
    {
        laneListHorizontal.Add(new Lane(x, y));
    }

    public List<Room> GetRooms()
    {
        return roomList;
    }

    public List<Lane> GetLaneVerticals()
    {
        return laneListVertical;
    }

    public List<Lane> GetLaneHorizontals()
    {
        return laneListHorizontal;
    }

    public void ClickOnRoom(Room _room)
    {
        room = _room;
        canvasForRoom.SetActive(true);
        mobOne.text = room.GetMobOne();
        mobTwo.text = room.GetMobTwo();
        mobThree.text = room.GetMobThree();
        chest.isOn = room.GetChest();
    }

    void ExitRoom()
    {
        canvasForRoom.SetActive(false);
    }

    void SaveRoom()
    {
        room.SetMobOne(mobOne.text);
        room.SetMobTwo(mobTwo.text);
        room.SetMobThree(mobThree.text);
        room.SetChest(chest.isOn);
        ExitRoom();
    }

    public void ClickOneLane(Lane _lane)
    {
        lane = _lane;
        canvasForLane.SetActive(true);
        trapOne.text = lane.GetTrapOne();
    }

    void ExitLane()
    {
        canvasForLane.SetActive(false);
    }

    void SaveLane()
    {
        lane.SetTrap(trapOne.text);
        ExitLane();
    }
}