loadData();

//データの読み込み
function loadData(){
  //ローカルストレージに情報があったらtagsubhidsに保存する
  chrome.storage.local.get(["tagsubhid","popadapt"], function(tagsys) {
    let tagsubhids = [""];
    if(tagsys.tagsubhid == null){
      chrome.storage.local.set({tagsubhid: ""},function(){
        console.log("tagsubhid in local strage is set to null");
      });
      return;
    }else{
      console.log("tagsubhid in local strage is " + tagsys.tagsubhid);
      tagsubhids = tagsys.tagsubhid.split(" ");
    }
    if(tagsys.popadapt == null){
      chrome.storage.local.set({popadapt: true},() => {
        console.log("popadapt in local strage is set to true");
      });
    }
    //クエリで現在選択しているタブのurlの中からニコニコのtag検索を読みだす
    chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
      const url = tabs[0].url.split("/");
      if(url[3]=="tag"){
        const tags = decodeURI(url[4].split("\?")[0]).split(/\+| /);
        for( let i = 0; i < tags.length ; i++){
          let con = true;
          if(tagsys.popadapt){
            console.log("popadapt")
            for( let j = 0; j < tagsubhids.length ; j++){
              if("-"+tagsubhids[j]==tags[i]){con = false}
            }
          }
          if(con&&tags[i][0]=="-"){
            document.getElementById('tagsub').value = (document.getElementById('tagsub').value + tags[i] + "\n");
          }else if(con){
            document.getElementById('tagadd').value = (document.getElementById('tagadd').value + tags[i] + "\n");
          }
        }
      }
    });
  });
}

//現在のタブ、新しいタブで検索のクリック時の動作
document.getElementById('current').onclick = () => {
  openAnchor(false);
};
document.getElementById('newtab').onclick = () => {
  openAnchor(true);
};


function openAnchor(tabselect) {
  //ローカルストレージに情報があったらtagsubhidsに保存する
  chrome.storage.local.get(["tagsubhid","popadapt"], (tagsys) => {
    let tagsubhids = [""];
    if(tagsys.tagsubhid == null){
      chrome.storage.local.set({tagsubhid: ""},function(){
        console.log("tagsubhid in local strage is set to null");
      });
      return;
    }else{
      console.log("tagsubhid in local strage is " + tagsys.tagsubhid);
      tagsubhids = tagsys.tagsubhid.split(" ");
    }
    //テキストエリアと除外設定からタグ検索URLを作成
    let insertUrl = "https://nicovideo.jp/tag/";
    let urladds = document.getElementById('tagadd').value.split(/\n| /);
    let urlsubs = document.getElementById('tagsub').value.split(/\n| /);
    for(let i = 0; i < urladds.length; i++){
      if(urladds[i] != "") insertUrl = insertUrl + urladds[i] + " ";
    }
    for(let i = 0; i < urlsubs.length; i++){
      let con = true;
      if(tagsys.popadapt){
        for( let j = 0; j < tagsubhids.length ; j++){
          if(tagsubhids[j]==tagsys[i]){
            con = false;
          }
        }
      }
      if(urlsubs[i] != "" && con) insertUrl = insertUrl + "-" + urlsubs[i] + " ";
    }
    if(tagsys.popadapt){
      for(let i = 0; i < tagsubhids.length; i++){
        if(tagsubhids[i] != "") insertUrl = insertUrl + "-" + tagsubhids[i] + " ";
      }
    }


    //新しいタブか今のタブでそのURLを表示
    if(tabselect){
      chrome.tabs.create({url: insertUrl});
    }else{
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabID = tabs[0].id;
          if (tabID === undefined) {
              return;
          }
          chrome.tabs.update(tabID, {
            url : insertUrl
          });
      });
      document.getElementById("urlchange").textContent = "移動しました";
    }
  });
}