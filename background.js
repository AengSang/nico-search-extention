// 拡張機能がインストールされたときの処理
chrome.runtime.onInstalled.addListener(() => {

    // メニューを生成
    chrome.contextMenus.create({
      id: "exclusion",
      contexts : ["link"],
      title: "このタグを除外する"
    });
});
  
//インストール後に更新したタブにのみ適応できる
//メニュークリック時
chrome.contextMenus.onClicked.addListener((info,tab) => {
    if(info.menuItemId == "exclusion"){
      console.log("クリック検知");
      let nicourls = info.linkUrl.split("/");
      if(nicourls[2]== "www.nicovideo.jp" && nicourls[3] == "tag"){
        console.log("リンク先がニコニコタグであることを確認");
        chrome.storage.local.get("tagsubhid", (tagsys) =>  {
          console.log("ローカルからタグ群を持ってくる");
          let count = true;
          let splittags = tagsys.tagsubhid.split(" ");
          let currenttag = decodeURI(nicourls[4]).split("\?")[0];
          for(let i = 0; i < splittags.length; i++){
            if(currenttag == splittags[i])count = false;
          }
          if(count){
            console.log("重複なし");
            let inserttags = tagsys.tagsubhid  + currenttag + " ";
            chrome.storage.local.set({tagsubhid: inserttags}, () => {
              console.log(decodeURI(nicourls[4]) + " added to tagsubhid");
            });
          }
        console.log("保存終了");
        });
      }else{
        console.log("リンク先がニコニコタグでないことを確認");

        chrome.tabs.query( {active:true, currentWindow:true}, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: alertFunction
          });
          console.log("通知完了");
        })
      }
    }
    console.log("メニュー終了");
});

//URL更新時のタグ追加処理
chrome.tabs.onUpdated.addListener((tabid, info, tab) => {
  console.log("読み込みを確認");
  chrome.storage.local.get(["tagsubhid","searchadapt"], (tagsys) => {
    if(tagsys.searchadapt == null){
      chrome.storage.local.set({searchadapt: true},() => {
        console.log("searchadapt in local strage is set to true");
      });
    }
    if(tagsys.searchadapt){
      const url = tab.url.split("/");
      if(info.status === 'complete' && url[2].split(".")[1] == "nicovideo" && url[3]=="tag"){
        console.log("nicovideoのタグ検索画面を検知");
          console.log("ローカルから除外タグを持ってくる");
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
          const tags = decodeURI(url[4].split("\?")[0]).split(/\+| /);
          let count = 0;
          for( let j = 0; j < tagsubhids.length ; j++){
            if(tagsubhids[j] == ""){
              count++;console.log(tagsubhids[j] +"が空白:" + count);
            }else{
              for( let i = 0; i < tags.length ; i++){
                if("-"+tagsubhids[j]==tags[i]){
                  count++;
                  console.log(tagsubhids[j] +"と"+tags[i]+"が一致:" + count);
                }
              }
            }
          }
          console.log("タグと設定を比較\nタグ:" + tags.length + "\n除外タグ:" +  tagsubhids.length + "\n一致: " + count);
          if(count != tagsubhids.length){
            let insertUrl = "https://www.nicovideo.jp/tag/";
            for(let i = 0; i < tags.length; i++){
              let con = true;
              for( let j = 0; j < tagsubhids.length ; j++)if("-"+tagsubhids[j]==tags[i])con = false;      
              if(tags[i] != "" && con) insertUrl = insertUrl + tags[i] + " ";
            }
            for(let i = 0; i < tagsubhids.length; i++){
              if(tagsubhids[i] != "") insertUrl = insertUrl + "-" + tagsubhids[i] + " ";
            }
            console.log("作成したurl:" + insertUrl);
            if (tab.id === undefined) {
              return;
            }else{
              console.log("現在のタブを"+ insertUrl + "に変更");
              chrome.tabs.update(tab.id, {
                url : insertUrl
              });
            }
          }else{
            console.log("タグ内に除外タブがすべて含まれている=>画面の更新待ち");
          }
      }else{
        console.log("ニコニコのタグ検索でないのを確認");
      }
    }
  });
});

//アラート用の関数
function alertFunction(){
  alert("nico search extentionより\nタグが見つかりませんでした");
}