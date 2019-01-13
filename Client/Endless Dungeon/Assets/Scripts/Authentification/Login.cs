﻿using System.Collections;
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
    private Network network;

    void Start()
    {
        network = gameObject.AddComponent<Network>();
        loginButton.onClick.AddListener(ClickLogin);
    }

    void ClickLogin()
    {
        loginButton.interactable = false;
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        formData.Add(new MultipartFormDataSection("email", email.text));
        formData.Add(new MultipartFormDataSection("password", password.text));

        network.Request("http://192.168.0.22:3000/authentification/signin", (response) => {
            if (Utils.ChangeObjectStringToString(response["succes"].ToString()) == "true")
            {
                errorText.text = "";
                string token = Utils.ChangeObjectStringToString(response["token"].ToString());
                TokenTODELETE.text = token;
            }
            else
            {
                errorText.text = response["error"].ToString();
            }
            loginButton.interactable = true;
        }, formData);
    }
}