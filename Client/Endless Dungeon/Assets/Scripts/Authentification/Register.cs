using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class Register : MonoBehaviour
{
    public InputField email;
    public InputField password;
    public InputField repassword;
    public Button registerButton;
    public Text errorText;

    private Dictionary<string, object> response;
    private Network network;

    void Start()
    {
        network = gameObject.AddComponent<Network>();
        registerButton.onClick.AddListener(ClickRegister);
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

        network.Request("http://192.168.0.22:3000/authentification/signup", (response) => {
            if (Utils.ChangeObjectStringToString(response["succes"].ToString()) == "true")
            {
                errorText.text = "GOOD";
                // token = Utils.ChangeObjectStringToString(response["token"].ToString());
            }
            else
            {
                errorText.text = response["error"].ToString();
            }
            registerButton.interactable = true;
        }, formData);
    }
}
