using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NetworkManager : Singleton<NetworkManager>
{

    private string idUser;

    //public Text responsText;

    protected override void init()
    {
        DontDestroyOnLoad(this.gameObject);
    }

}