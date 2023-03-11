loadData();

//データの読み込み
function loadData(){
  console.log("start load");
  chrome.storage.local.get(["tagsubhid","popadapt","searchadapt"], (tagsys) => {
    if(tagsys.tagsubhid == null){
      chrome.storage.local.set({tagsubhid: ""},() => {
        console.log("tagsubhid in local strage is set to none");
      });
    }else{
      console.log("tagsubhid in local strage is not null");
      let insertUrl = "";
      let urladds = tagsys.tagsubhid.split(" ");
      for(let i = 0; i < urladds.length; i++){
        if(urladds[i] != "") insertUrl = insertUrl + urladds[i] + "\n";
      }
      console.log("tagsubhid in local strage is" + insertUrl);
      document.getElementById('tagsubhid').value = insertUrl;
      console.log("set finished : tagsubhid was set in textbox");
    }
    if(tagsys.popadapt == null){
      chrome.storage.local.set({popadapt: true},() => {
        console.log("popadapt in local strage is set to true");
      });
    }else{
      console.log("popadapt in local strage is not null");
      if(!tagsys.popadapt)document.getElementById("popupexclusioncheck").checked = false;
    }
    if(tagsys.searchadapt == null){
      chrome.storage.local.set({searchadapt: true},() => {
        console.log("searchadapt in local strage is set to true");
      });
    }else{
      console.log("searchadapt in local strage is not null");
      if(!tagsys.searchadapt)document.getElementById("tagsearchexclusioncheck").checked = false;
    }
  });
}

document.getElementById('save').onclick = () => {
  console.log("save button clicked");
  let insertUrl = "";
  let urladds = document.getElementById('tagsubhid').value.split(/\n| /);
  for(let i = 0; i < urladds.length; i++){
    if(urladds[i] != "") insertUrl = insertUrl + urladds[i] + " ";
  }
  let popupcheck = document.getElementById("popupexclusioncheck").checked;
  let searchcheck = document.getElementById("tagsearchexclusioncheck").checked;
  console.log("start save :" + insertUrl + " popup:" + popupcheck + " search:" + searchcheck);
  chrome.storage.local.set({tagsubhid: insertUrl, popadapt: popupcheck, searchadapt: searchcheck}, () => {
    document.getElementById('savechange').textContent = "保存しました";
    console.log("save finished");
  });
  alert("完全に適応するにはブラウザを再起動してください");
};

