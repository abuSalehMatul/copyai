var aivaDescriptionNode;
//var copyAiSpecServer = "https://copy-ai.aiva-apps.com";
var copyAiSpecServer = 'https://copyai.ngrok.io';
function hideDescriptionAiva() {
    let aivaOriginal = "{{productDescriptionMain}}"
    aivaOriginal = aivaOriginal.replaceAll("&amp;", "&");
    let allDoc = document.getElementsByTagName("*");
    for (let i = 0; i < allDoc.length; i++) {
        let processDoc = allDoc[i].innerText;
        if (processDoc != null) {
            processDoc = processDoc.replace(/(\r\n|\n|\r)/gm, "");
            processDoc = processDoc.replaceAll('"', "'");
        }
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
function runAivaAiSpac(myShopifyDomain) {
    let apiHandler = new ApiAiSpacHandler();
    let productHandle = getProductHandleForAivaAiSpac(__st.pageurl);
    apiHandler.ajax_call("https://" + Shopify.shop + "/products/" + productHandle + ".js", "GET", data = null, header = ["application/json"], (apiResult) => {
        apiResult = JSON.parse(apiResult);
        var aivaMeta = "";

        apiHandler.ajax_call(copyAiSpecServer + "/dami-detais/" + myShopifyDomain, "GET", data = null, header = ["application/x-www-form-urlencoded"], (damidescription) => {
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

function aivaCopyAiViewToken() {
    let token = localStorage.getItem("aiva-copy-ai-u-mat-token");
    console.log(token)
    if (token == null) {
        let random = Math.random().toString(36).substring(1) + Math.random().toString(36).substring(1);
        localStorage.setItem("aiva-copy-ai-u-mat-token", random);
    }
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
    let myShopifyDomain = getParameterByNameAivaCopyAi("shop");
    let load = getParameterByNameAivaCopyAi("load");
    let publish = getParameterByNameAivaCopyAi("publish")

    if (pera == "aispace" && load == "yes") {
        showDimLoaderCopyAi();
        hideDescriptionAiva();

        setTimeout(() => {
            runAivaAiSpac(myShopifyDomain)
        }, 4000);

    }
    else if (pera == "aispace") {
        runAivaAiSpac(myShopifyDomain)
    }
    else if (publish == "yes") {
        hideDescriptionAiva();
        runAivaAiSpac(myShopifyDomain)
    }

    else if (pera != "aispace" && load != "yes" && publish != "yes") {
        console.log('real product matul');
        aivaCopyAiViewToken();
        var xmlrequestListnerAivaCopyAi = new Object();
        xmlrequestListnerAivaCopyAi.tempOpen = XMLHttpRequest.prototype.open;
        xmlrequestListnerAivaCopyAi.tempSend = XMLHttpRequest.prototype.send;
        xmlrequestListnerAivaCopyAi.callback = function () {
            // this.method :the ajax method used
            // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
            // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)

            if (/cart\/add.js$/.test(this.url)) {
                console.log('cart added');
                window.copy_ai_cart_initiated = 1;
            }
        }

        XMLHttpRequest.prototype.open = function (a, b) {
            if (!a) var a = '';
            if (!b) var b = '';
            xmlrequestListnerAivaCopyAi.tempOpen.apply(this, arguments);
            xmlrequestListnerAivaCopyAi.method = a;
            xmlrequestListnerAivaCopyAi.url = b;
            if (a.toLowerCase() == 'get') {
                xmlrequestListnerAivaCopyAi.data = b.split('?');
                xmlrequestListnerAivaCopyAi.data = xmlrequestListnerAivaCopyAi.data[1];
            }
        }



        XMLHttpRequest.prototype.send = function (a, b) {
            if (!a) var a = '';
            if (!b) var b = '';
            xmlrequestListnerAivaCopyAi.tempSend.apply(this, arguments);
            this.addEventListener('readystatechange', function (e) {
                if (this.readyState === 4 && this.status === 200) {
                    let apiResult = this.responseText;
                    apiResult = JSON.parse(apiResult);

                    if (window.copy_ai_cart_initiated == 1) {
                        if (typeof apiResult.token != "undefined" && typeof apiResult.note != "undefined"
                            && typeof apiResult.currency != "undefined") {


                            let urlEncodedData = "",
                                urlEncodedDataPairs = [];
                            urlEncodedDataPairs.push(encodeURIComponent('token') + '=' + encodeURIComponent(apiResult.token));
                            urlEncodedDataPairs.push(encodeURIComponent('copy_user') + '=' + encodeURIComponent(localStorage.getItem("aiva-copy-ai-u-mat-token")));
                            urlEncodedDataPairs.push(encodeURIComponent('shop') + '=' + encodeURIComponent(Shopify.shop));
                            urlEncodedDataPairs.push(encodeURIComponent('copy_user_tz') + '=' + encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone));
                            urlEncodedDataPairs.push(encodeURIComponent('copy_product_id') + '=' + encodeURIComponent(meta.product.id));
                            urlEncodedDataPairs.push(encodeURIComponent('copy_total_price') + '=' + encodeURIComponent(apiResult.total_price));
                            urlEncodedDataPairs.push(encodeURIComponent('currency') + '=' + encodeURIComponent(apiResult.currency));
                            urlEncodedDataPairs.push(encodeURIComponent('discount') + '=' + encodeURIComponent(apiResult.total_discount));
                            urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
                            let handler = new ApiAiSpacHandler();
                            handler.ajax_call(copyAiSpecServer + "/save-cart-history", "POST", urlEncodedData, ['application/x-www-form-urlencoded'], (cartSavedRes) => {
                                console.log(cartSavedRes);
                            })
                            console.log(apiResult);
                        }
                    }

                } else if (this.readyState == 4 && this.status > 400) {
                    console.log("api error");
                }
            }, false);
            if (xmlrequestListnerAivaCopyAi.method.toLowerCase() == 'post') xmlrequestListnerAivaCopyAi.data = a;
            xmlrequestListnerAivaCopyAi.callback();
        }
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