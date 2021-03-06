﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using MiniJSON;
using System;

public class Network : MonoBehaviour
{
    private Dictionary<string, object> response;

    public void Request(string route, Action<Dictionary<string, object>> cb, List<IMultipartFormSection> formData = null, string token=null)
    {

        UnityWebRequest request = UnityWebRequest.Post(route, formData);
        if (token != null)
            request.SetRequestHeader("Authorization", "Bearer " + token);

        StartCoroutine(OnReponse(request, cb));
    }

    private IEnumerator OnReponse(UnityWebRequest req, Action<Dictionary<string, object>> cb)
    {
        yield return req.SendWebRequest();
        response = Json.Deserialize(req.downloadHandler.text) as Dictionary<string, object>;
        cb(response);
    }

    public Dictionary<string, object> GetResponse()
    {
        return response;
    }

    public void RequestGet(string route, Action<Dictionary<string, object>> cb, string token=null)
    {
        UnityWebRequest request = UnityWebRequest.Get(route);
        if (token != null)
            request.SetRequestHeader("Authorization", "Bearer " + token);

        Debug.Log("Avant coroutine");
        StartCoroutine(OnReponseGet(request, cb));
    }

    private IEnumerator OnReponseGet(UnityWebRequest req, Action<Dictionary<string, object>> cb)
    {
        yield return req.SendWebRequest();
        Debug.Log(req.downloadHandler.text);
        response = Json.Deserialize(req.downloadHandler.text) as Dictionary<string, object>;
        cb(response);
    }
}
