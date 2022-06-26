LoadSites();

function LoadSites(){
    chrome.storage.local.get(["tagsubhid"], (tagsys) => {
    const getTags = document.getElementsByClassName("Link TagItem-name");
    let tagsinhtml = "";
    for(let i = 0; i < getTags.length ; i++){
        tagsinhtml = tagsinhtml + getTags[i].textContent + " ";
    }
    console.log("この動画には「" + tagsinhtml + "」のタグが含まれています")
    if(tagsys.tagsubhid == null){
        chrome.storage.local.set({tagsubhid: ""},function(){
            console.log("tagsubhid in local strage is set to null");
        });
        return;
    }else{
        console.log("tagsubhid in local strage is not null");
        let insertUrl = "";
        let tagsubhids = tagsys.tagsubhid.split(" ");
        let count = false;
        for( let j = 0; j < tagsubhids.length ; j++){
            if(tagsubhids[j] == ""){
                console.log(tagsubhids[j] +"が空白:");
            }else{
                for( let i = 0; i < getTags.length ; i++){
                    if(tagsubhids[j] == getTags[i].textContent){
                        count = true;
                        console.log(tagsubhids[j] +"と"+ getTags[i].textContent+"が一致:");
                        insertUrl = insertUrl + getTags[i].textContent + " ";
                    }
                }
            }
        }
        if(count){
            alert("この動画には除外タグ\n「" + tagsys.tagsubhid + "」\nのうち\n「" + insertUrl + "」\nが含まれています\n視聴には十分ご注意ください");
            console.log("この動画には除外タグ「" + tagsys.tagsubhid + "」のうち「" + insertUrl + "」が含まれています");
        }else{
            console.log("この動画には除外タグ「" + tagsys.tagsubhid + "」は含まれていません");
        }
    }
});
}