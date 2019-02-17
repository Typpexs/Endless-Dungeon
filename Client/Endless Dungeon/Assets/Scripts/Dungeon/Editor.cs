using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class Editor : MonoBehaviour
{
    // Start is called before the first frame update
    public Button saveButton;
    public Button exitButton;

    private Dungeon dj;

    void Start()
    {
        saveButton.onClick.AddListener(ClickOnSave);
        exitButton.onClick.AddListener(ClickOnExit);
    }

    void ClickOnSave()
    {
        //SAVE DANS LA DB
        dj = new Dungeon(EditorManager.Instance.GetRooms(), EditorManager.Instance.GetLaneVerticals(), EditorManager.Instance.GetLaneHorizontals());
        Destroy(EditorManager.Instance);
        SceneManager.LoadScene("Home");
    }

    void ClickOnExit()
    {
        Destroy(EditorManager.Instance);
        SceneManager.LoadScene("Home");
    }
}
