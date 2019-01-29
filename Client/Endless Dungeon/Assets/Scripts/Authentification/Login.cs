using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class Login : MonoBehaviour
{
    public InputField email;
    public InputField password;
    public Button loginButton;
    public Button registerButton;
    public Text errorText;

    private Dictionary<string, object> response;
    private Network network;

    void Start()
    {
        network = gameObject.AddComponent<Network>();
        loginButton.onClick.AddListener(ClickLogin);
        registerButton.onClick.AddListener(ClickRegister);
    }

    void ClickLogin()
    {
        loginButton.interactable = false;
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        formData.Add(new MultipartFormDataSection("email", email.text));
        formData.Add(new MultipartFormDataSection("password", password.text));

        network.Request(NetworkManager.Instance.getIpServer()+"/authentification/signin", (response) => {
            if (Utils.ChangeObjectStringToString(response["success"].ToString()) == "true")
            {
                errorText.text = "";
                string token = Utils.ChangeObjectStringToString(response["token"].ToString());
                NetworkManager.Instance.setToken(token);
                SceneManager.LoadScene("Home");
            }
            else
            {
                errorText.text = response["error"].ToString();
            }
            loginButton.interactable = true;
        }, formData);
    }

    void ClickRegister()
    {
        SceneManager.LoadScene("Register");
    }
}