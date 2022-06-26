DomCheangeFuncrion();

//画面から除外タブを見えなくする関数
function DomCheangeFuncrion(){
    let inputTextBox = document.getElementsByClassName("inputText")[0].getElementsByTagName("input")[0];
    let tagCaptionHeaderSpan = document.getElementsByClassName("tagCaption")[0].getElementsByClassName("contentHeader")[0].getElementsByTagName("span")[0];
    const inputTextValues = tagCaptionHeaderSpan.textContent.split(" ");
    let insertText = "";
    console.log("現在の検索タグは"+inputTextValues+"です");
    chrome.storage.local.get(["tagsubhid","searchadapt"], (tagobject) =>{
        if(tagobject.searchadapt == null){
            chrome.storage.local.set({searchadapt: true},() => {
              console.log("searchadapt in local strage is set to true");
            });
        }
        let tagsubhids = tagobject.tagsubhid.split(" ");
        for( let i = 0; i < inputTextValues.length ; i++){
            let con = true;
            if(tagobject.searchadapt){
              for( let j = 0; j < tagsubhids.length ; j++){
                if("-"+tagsubhids[j]==inputTextValues[i]){con = false;}
              }
            }
            if(con){
              insertText += inputTextValues[i];
            }
        }
        console.log("処理後の表示タグは"+insertText+"です");
    });
    setTimeout(() => {
        inputTextBox.value = insertText;
        tagCaptionHeaderSpan.textContent = insertText;   
    }, 200);
  }