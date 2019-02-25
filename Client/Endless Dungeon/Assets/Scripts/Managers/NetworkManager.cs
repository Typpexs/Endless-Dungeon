using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NetworkManager : Singleton<NetworkManager>
{

    private string token;
    private string IpServer;

    protected override void init()
    {
        DontDestroyOnLoad(this.gameObject);
        // IpServer = "http://192.168.0.22:3000";
        IpServer = "http://192.168.1.67:3000";
        token = "";
    }

    public string getIpServer()
    {
        return IpServer;
    }

    public void setToken(string addToken)
    {
        token = addToken;
    }

    public string getToken()
    {
        return token;
    }
}