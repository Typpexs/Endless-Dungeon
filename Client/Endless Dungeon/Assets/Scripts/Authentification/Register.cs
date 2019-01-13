using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class Register : MonoBehaviour
{
    public InputField email;
    public InputField password;
    public InputField repassword;
    public Button registerButton;
    public Button backButton;
    public Text errorText;

    private Dictionary<string, object> response;
    private Network network;

    void Start()
    {
        network = gameObject.AddComponent<Network>();
        registerButton.onClick.AddListener(ClickRegister);
        backButton.onClick.AddListener(ClickBack);
    }

    void ClickRegister()
    {
        registerButton.interactable = false;
        if (string.Compare(password.text, repassword.text) != 0)
        {
            errorText.text = "Password and Retype password are not the same.";
            registerButton.interactable = true;
            return;
        }
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        formData.Add(new MultipartFormDataSection("email", email.text));
        formData.Add(new MultipartFormDataSection("password", password.text));

        network.Request(NetworkManager.Instance.getIpServer()+"/authentification/signup", (response) => {
            if (Utils.ChangeObjectStringToString(response["succes"].ToString()) == "true")
            {
                SceneManager.LoadScene("Login");
            }
            else
            {
                errorText.text = response["error"].ToString();
            }
            registerButton.interactable = true;
        }, formData);
    }

    void ClickBack()
    {
        SceneManager.LoadScene("Login");
    }
}
