using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Home : MonoBehaviour
{
    void Start()
    {
        Debug.Log(NetworkManager.Instance.getToken());
    }

}
