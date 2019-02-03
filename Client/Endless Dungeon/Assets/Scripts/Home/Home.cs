using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;


public class Home : MonoBehaviour
{
    public Text pseudo;
    public Text gold;
    public Text blood;
    public Text level;
    public Text current_experience;
    public Text rank;
    public Button tavernButton;
    public Button leaveTavern;
    public GameObject TavernCanvas;
    public Button dungeonEditorButton;

    private Network network;
   // private List<GameObject> canvasList;

    void Start()
    {
        network = gameObject.AddComponent<Network>();
        //canvasList = new List<GameObject>();
        //canvasList.Add(TavernCanvas);

        Debug.Log(NetworkManager.Instance.getToken());
        network.RequestGet(NetworkManager.Instance.getIpServer() + "/home/", (response) =>
        {
            if (Utils.ChangeObjectStringToString(response["success"].ToString()) == "true")
            {
                Dictionary<string, object> dictOfResult = (Dictionary<string, object>) response["result"];
                foreach (var dictResult in (List<object>)dictOfResult["result"])
                {
                    Dictionary<string, object> result = (Dictionary<string, object>)dictResult;
                    pseudo.text = result["pseudo"].ToString();
                    gold.text = result["gold"].ToString();
                    blood.text = result["blood"].ToString();
                    level.text = result["level"].ToString();
                    current_experience.text = result["experience"].ToString();
                    rank.text = result["rank_point"].ToString();
                }

            }
            else
            {
                Debug.Log("CA PASSE PAS");
            }
        }, NetworkManager.Instance.getToken());

        tavernButton.onClick.AddListener(ClickTavern);
        leaveTavern.onClick.AddListener(ClickLeaveTavern);
        dungeonEditorButton.onClick.AddListener(ClickEditor);
    }

    //void Update()
    //{
    //    HideIfClickedOutside();
    //}

    //private void HideIfClickedOutside()
    //{
    //    foreach (GameObject canvas in canvasList)
    //    {
    //        if (Input.GetMouseButton(0) && canvas.activeSelf &&
    //            !RectTransformUtility.RectangleContainsScreenPoint(
    //                canvas.GetComponent<RectTransform>(),
    //                Input.mousePosition,
    //                Camera.main))
    //        {
    //            canvas.SetActive(false);
    //        }
    //    }
    //}

    void ClickTavern()
    {
        TavernCanvas.SetActive(true);
    }

    void ClickLeaveTavern()
    {
        TavernCanvas.SetActive(false);
    }

    void ClickEditor()
    {
        SceneManager.LoadScene("Editor");
    }
}
