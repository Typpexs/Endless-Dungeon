using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateGridLaneHorizontal : MonoBehaviour
{

    public Button lane;
    public GameObject noneLane;
    public int rows = 3;
    public int columns = 3;

    private float buttonWidth;
    private float buttonHeight;

    void Start()
    {
        Populate();
    }

    public void Populate()
    {
        GameObject newObj;
        Button currentLaneButton;

        for (int x = 0; x < rows; x++)
        {
            for (int y = 0; y < columns; y++)
            {
                if (IsALane(x, y))
                {
                    currentLaneButton = Instantiate(lane, transform);
                    int tmpx = x;
                    int tmpy = y;
                    if (!IsAlredyALane(tmpx, tmpy))
                        EditorManager.Instance.AddLaneHorizontal(x, y);
                    currentLaneButton.onClick.AddListener(delegate { EditorManager.Instance.ClickOneLane(WichLane(tmpx, tmpy)); });
                }
                else
                {
                    newObj = Instantiate(noneLane, transform);
                }
            }
        }
    }

    public void UnPopulate()
    {
        foreach (Transform t in transform)
        {
            Destroy(t.gameObject);
        }
    }

    Lane WichLane(int x, int y)
    {
        foreach (Lane lane in EditorManager.Instance.GetLaneHorizontals())
        {
            if (lane.GetCoordinates().x == x && lane.GetCoordinates().y == y)
                return lane;
        }
        return new Lane(x, y);
    }

    bool IsAlredyALane(int x, int y)
    {
        foreach (Lane lane in EditorManager.Instance.GetLaneHorizontals())
        {
            if (lane.GetCoordinates().x == x && lane.GetCoordinates().y == y)
                return true;
        }
        return false;
    }

    bool IsALane(int x, int y)
    {
        foreach (Room room in EditorManager.Instance.GetRooms())
            if (room.GetCoordinates().x == x && room.GetCoordinates().y == y + 1)
                foreach (Room room2 in EditorManager.Instance.GetRooms())
                    if (room2.GetCoordinates().x == x && room2.GetCoordinates().y == y)
                        return true;
        return false;
    }
}
