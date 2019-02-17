using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateGrid : MonoBehaviour
{
    public Button room;
    public Button newRoom;
    public Button lane;
    public GameObject noneRoom;
    public GameObject gridLane;

    public int rows = 4;
    public int columns = 4;
    private float buttonWidth;
    private float buttonHeight;


    void Start()
    {

        EditorManager.Instance.AddRoom(0, 0);
        Populate();
    }

    void Populate()
    {
        GameObject newObj;
        Button newRoomButton;
        Button currentRoomButton;

        for (int x = 0; x < rows; x++)
        {
            for (int y = 0; y < columns; y++)
            {
                if (IsARoom(x, y))
                {
                    currentRoomButton = Instantiate(room, transform);
                    int tmpxDuCul = x;
                    int tmpyDuCul = y;
                    currentRoomButton.onClick.AddListener(delegate { EditorManager.Instance.ClickOnRoom(WichRoom(tmpxDuCul, tmpyDuCul)); });
                }
                else if (CalculateIfCreateNewRoom(x, y))
                {
                    newRoomButton = Instantiate(newRoom, transform);
                    int tmpx = x;
                    int tmpy = y;
                    newRoomButton.onClick.AddListener(delegate { ClickAddNewRoom(tmpx, tmpy); });
                }
                else
                {
                    newObj = Instantiate(noneRoom, transform);
                }

            }
        }
    }

    void UnPopulate()
    {
        foreach (Transform t in transform)
        {
            Destroy(t.gameObject);
        }
    }

    Room WichRoom(int x, int y)
    {
        foreach (Room room in EditorManager.Instance.GetRooms())
        {
            if (room.GetCoordinates().x == x && room.GetCoordinates().y == y)
                return room;
        }
        return new Room(x, y);
    }

    bool IsARoom(int x, int y)
    {
        foreach (Room room in EditorManager.Instance.GetRooms())
        {
            if (room.GetCoordinates().x == x && room.GetCoordinates().y == y)
                return true;
        }
        return false;
    }

    bool CalculateIfCreateNewRoom(int x, int y)
    {
        foreach (Room room in EditorManager.Instance.GetRooms())
        {
            if ((room.GetCoordinates().x == x - 1 && room.GetCoordinates().y == y) || (room.GetCoordinates().x == x && room.GetCoordinates().y == y - 1) 
                || (room.GetCoordinates().x == x + 1 && room.GetCoordinates().y == y) || (room.GetCoordinates().x == x && room.GetCoordinates().y == y + 1))
                return true;
        }
        return false;
    }   

    void ClickAddNewRoom(int x, int y)
    {
        EditorManager.Instance.AddRoom(x, y);
        UnPopulate();
        GameObject.Find("ContentLaneHorizontal").GetComponent<PopulateGridLaneHorizontal>().UnPopulate();
        GameObject.Find("ContentLaneVertical").GetComponent<PopulateGridLaneVertical>().UnPopulate();
        Populate();
        GameObject.Find("ContentLaneHorizontal").GetComponent<PopulateGridLaneHorizontal>().Populate();
        GameObject.Find("ContentLaneVertical").GetComponent<PopulateGridLaneVertical>().Populate();
    }

}
