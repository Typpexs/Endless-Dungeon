using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EditorRoom : MonoBehaviour
{

    public Button openEditRoom;
    public Button saveEditRooom;
    public InputField mob1;
    public InputField mob2;
    public InputField mob3;
    public Toggle chest;

    public GameObject EditRoomCanvas;
    public Button leaveEditRooom;


    // Start is called before the first frame update
    void Start()
    {
//        EditRoomCanvas = GameObject.Find("CanvasForRoom");
        openEditRoom.onClick.AddListener(ActiveEditRoom);
    }


    public void ActiveEditRoom()
    {
        EditRoomCanvas.SetActive(true);
        leaveEditRooom = GameObject.Find("ExitEditRoom").GetComponent<Button>();
        leaveEditRooom.onClick.AddListener(ExitEditRoom);
    }

    void ExitEditRoom()
    {
        EditRoomCanvas.SetActive(false);
    }
}
