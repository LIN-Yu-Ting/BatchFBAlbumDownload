// ==UserScript==
// @name         Facebook photos bulk downloader
// @namespace    https://chriskyfung.github.io
// @version      1.0.0
// @description  Bulk download Facebook photos from facebook with the post link and captions
// @author       Chris KY Fung
// @match        https://www.facebook.com/*/photos/*
// @match        https://www.facebook.com/photo.php?*
// @match        https://www.facebook.com/photo?*
// @match        https://www.facebook.com/photo/*
// @grant        GM_download
// ==/UserScript==

const container = 'div[aria-label="放大"]';

var iter = 0;
var MAXITER = 3;
const isDebug = false;

(function(){
  let timer = setInterval(addFetchBtn, 500);
  function addFetchBtn() {
    if (document.querySelector(container)) {
      if (isDebug) console.log('Get the specified container!') ;
      let myFetchBtn = document.createElement("div");
      myFetchBtn.id = "my-fetch-btn";
      myFetchBtn.innerHTML = "⇩ Fetch";
      myFetchBtn.style.cssText = 'z-index:100;border-radius:15px;background-color:lightgray;padding: 8px 16px;align-self:center;cursor: pointer;';
      myFetchBtn.addEventListener("click", callbatchprocess);
      document.querySelector(container).parentElement.parentElement.prepend(myFetchBtn);
      clearInterval(timer);
    } else {
      if (isDebug) console.error('Cannot query the specified container!')
    };
  };
})();

function getImageUrl(){
    return document.querySelector('img[data-visualcompletion]').src;
};

function expandThreeDots(){
    document.querySelector('[aria-label="可對此貼文採取的動作"]').click();
};

function getDateTime(){
};

function getCaption(){
    return document.querySelector("#fbPhotoSnowliftCaption > span").innerText;
};

function nextImage(){
    document.querySelector('[aria-label="上一張相片"]').click();
    iter++;
    if (iter < MAXITER) {
        setTimeout(function(){
            batchprocess();
        }, 1000);
    };
}

function batchprocess(){
  expandThreeDots();
  let timer = setInterval(processEach, 500);
  function processEach(){
    let imgUrl = getImageUrl();
    if (imgUrl) {
      clearInterval(timer);
      var filename = imgUrl.match(/\/.+\/(.+)\?/)[1];
      console.log(filename)
      console.log("iter " + iter + ": " + imgUrl + ", " + filename);
      GM_download({'url': imgUrl, 'name': filename, 'saveAs': false});
      setTimeout(function(){
        nextImage();
      }, 500);
    }
  };
};

function callbatchprocess(){
    iter = 0;
    MAXITER = prompt("How many photos to fetch:", "3");
    batchprocess();
}
