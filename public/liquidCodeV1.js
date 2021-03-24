{% assign productDescriptionMain = product.description | strip_html | strip_newlines| replace: '"',"'" %}

<script> 
  var aivaDescriptionNode;
var copyAiSpecServer = "https://copy-ai.aiva-apps.com";
function hideDescriptionAiva() {
    let aivaOriginal = "{{productDescriptionMain}}"
    aivaOriginal = aivaOriginal.replaceAll("&amp;", "&");
    let allDoc = document.getElementsByTagName("*");
    for (let i = 0; i < allDoc.length; i++) {
        let processDoc = allDoc[i].innerText;
        if (processDoc != null) {
            processDoc = processDoc.replace(/(\r\n|\n|\r)/gm, "");
            processDoc = processDoc.replaceAll('"',"'");
        }
        console.log(aivaOriginal == processDoc);
        console.log(aivaOriginal);
        if (processDoc == aivaOriginal) {

            allDoc[i].innerText = "";
            aivaDescriptionNode = allDoc[i]
            break;
        }
    }
}

function showDimLoaderCopyAi() {
    let dimDiv = document.createElement("div");
    dimDiv.id = "copyAidimDiv";
    dimDiv.style.background = "rgba(0,0,0,.5)";
    dimDiv.style.position = "fixed";
    dimDiv.style.top = "0px";
    dimDiv.style.height = "100%";
    dimDiv.style.width = "100%";
    dimDiv.style.zIndex = "1000";
    dimDiv.innerHTML = "<p>Loading Preview</p>";
    document.body.append(dimDiv);
    let aispecLoader = document.createElement("style");
    aispecLoader.innerHTML = ".aiSpecloader{border:6px solid #f3f3f3;border-radius:50%;border-top:6px solid grey;width:80px;height:80px;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}#copyAidimDiv p{position:relative;top:40%;width:100%;color:#fff;font-size:20px;text-align:center}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}";
    document.head.append(aispecLoader);
    let loaderContainerDiv = document.createElement("div");

    let loaderDiv = document.createElement("div");
    loaderDiv.classList.add("aiSpecloader");
    loaderDiv.style.position = "fixed";
    loaderDiv.style.top = "48%";
    loaderDiv.style.left = "47.5%";
    loaderContainerDiv.append(loaderDiv);
    dimDiv.append(loaderContainerDiv);
}
function runAivaAiSpac(num) {
    let apiHandler = new ApiAiSpacHandler();
    let productHandle = getProductHandleForAivaAiSpac(__st.pageurl);
    apiHandler.ajax_call("https://" + Shopify.shop + "/products/" + productHandle + ".js", "GET", data = null, header = ["application/json"], (apiResult) => {
        apiResult = JSON.parse(apiResult);
        var aivaMeta = "";

        apiHandler.ajax_call(copyAiSpecServer + "/dami-detais/" + num, "GET", data = null, header = ["application/x-www-form-urlencoded"], (damidescription) => {
            damidescription = JSON.parse(damidescription);
          	console.log(damidescription)
            aivaMeta = damidescription.description;
            aivaDescriptionNode.innerHTML = aivaMeta;
            let dimDiv = document.getElementById("copyAidimDiv");
            dimDiv.remove();

        });


    });
}

function getProductHandleForAivaAiSpac(url) {
    let match = url.match(/products\/(.*?)$/);
    let unfilterHandle = match[1];
    let queryString = unfilterHandle.match(/\?([^&=]+)=([^&=]+)(?:&([^&=]+)=([^&=]+))*$/);
    let handle;
    if (queryString == null) {
        handle = unfilterHandle;
    } else {
        handle = unfilterHandle.replace(queryString[0], "");
    }
    return handle;
}

function aivaAiSpecReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function getParameterByNameAivaCopyAi(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

aivaAiSpecReady(function () {
    let pera = getParameterByNameAivaCopyAi("copypreview");
    let num = getParameterByNameAivaCopyAi("shop");
    let loa = getParameterByNameAivaCopyAi("load");
    let publish = getParameterByNameAivaCopyAi("publish")

    if (pera == "aispace" && loa == "yes") {
        showDimLoaderCopyAi();
        hideDescriptionAiva();

        setTimeout(() => {
            runAivaAiSpac(num)
        }, 4000);

    }
    else if (pera == "aispace") {
        runAivaAiSpac(num)
    }
    else if (publish == "yes") {
        hideDescriptionAiva();
        runAivaAiSpac(num)
    }

});


class ApiAiSpacHandler {
    ajax_call(url, type, data = null, header, response) {
        let httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                // Inserting the response from server into a variable and run a callback method 
                let apiResult = this.responseText;
                response(apiResult);

            } else if (this.readyState == 4 && this.status > 400) {
                response("api error");
            }
        };
        httpRequest.open(type, url, true);

        httpRequest.setRequestHeader("Content-type", header);
        if (data != null) {
            httpRequest.send(data);
        } else {

            httpRequest.send();
        }

    }

}
</script>