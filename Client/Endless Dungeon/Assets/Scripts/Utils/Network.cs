using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using MiniJSON;

public class Network : MonoBehaviour
{
    private Dictionary<string, object> response;
    private bool isResponseFilled = false;

    public void Request(string route, List<IMultipartFormSection> formData = null, string token=null)
    {

        UnityWebRequest request = UnityWebRequest.Post(route, formData);
        if (token != null)
            request.SetRequestHeader("Authorization", "Bearer " + token);

        StartCoroutine(OnReponse(request));
    }

    private IEnumerator OnReponse(UnityWebRequest req)
    {
        yield return req.SendWebRequest();
        response = Json.Deserialize(req.downloadHandler.text) as Dictionary<string, object>;
        isResponseFilled = true;
    }

    public Dictionary<string, object> GetResponse()
    {
        isResponseFilled = false;
        return response;
    }

    public bool GetIsResponseFilled()
    {
        return isResponseFilled;
    }
}
