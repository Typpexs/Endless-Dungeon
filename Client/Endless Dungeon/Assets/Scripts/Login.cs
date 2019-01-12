using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class Login : MonoBehaviour
{
    public InputField email;
    public InputField password;
    public Button loginButton;
    public Text errorText;
    public Text TokenTODELETE;

    private Dictionary<string, object> response;
    private bool loginClicked = false;
    private Network network;

    void Start()
    {
        network = gameObject.AddComponent<Network>();
        loginButton.onClick.AddListener(ClickLogin);
    }

    void Update()
    {
        if (loginClicked)
        {
            if (response == null || response != network.GetResponse())
            {
                response = network.GetResponse();
            }
            else
            {
                //foreach (KeyValuePair<string, object> kvp in response)
                //{
                //    Debug.Log(string.Format("Key = {0}, Value = {1}", kvp.Key, kvp.Value));
                //}
                if (Utils.ChangeObjectStringToString(response["succes"].ToString()) == "true" )
                {
                    errorText.text = "";
                    string token = Utils.ChangeObjectStringToString(response["token"].ToString());
                    TokenTODELETE.text = token;
                }
                else
                {
                    errorText.text = response["error"].ToString();
                }
              loginClicked = false;
            }
        }

    }

    void ClickLogin()
    {
        Debug.Log("RECLIC");
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        formData.Add(new MultipartFormDataSection("email", email.text));
        formData.Add(new MultipartFormDataSection("password", password.text));

        network.Request("http://127.0.0.1:3000/authentification/signin", formData);
        loginClicked = true;
    }

}