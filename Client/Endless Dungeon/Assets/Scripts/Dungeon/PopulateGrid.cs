using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateGrid : MonoBehaviour
{

    public Button room;
    public Button newRoom;
    public GameObject noneRoom;

    public int rows = 4;
    public int columns = 4;
    private float buttonWidth;
    private float buttonHeight;

    private List<Vector2> roomList;

    void Start()
    {
        roomList = new List<Vector2>();
        roomList.Add(new Vector2(0, 0));
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
                    roomList.Add(new Vector2(x, y));
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

    bool IsARoom(int x, int y)
    {
        foreach (Vector2 room in roomList)
        {
            if (room.x == x && room.y == y)
                return true;
        }
        return false;
    }

    bool CalculateIfCreateNewRoom(int x, int y)
    {
        foreach (Vector2 room in roomList)
        {
            if ((room.x == x - 1 && room.y == y) || (room.x == x && room.y == y - 1) || (room.x == x + 1 && room.y == y) || (room.x == x && room.y == y + 1))
                return true;
        }
        return false;
    }

    void ClickAddNewRoom(int x, int y)
    {
        roomList.Add(new Vector2(x, y));
        UnPopulate();
        Populate();
    }
}
