// get elements from html
let bgpage=chrome.extension.getBackgroundPage();
let word=bgpage.word;
let url=bgpage.url;

let ps=document.getElementsByTagName('p');
let footers=document.getElementsByTagName('footer');
let footer=footers[0];
footer.innerHTML="";
let mains=document.getElementsByTagName('main');
let main=mains[0];
let p=ps[0];
p.innerHTML=word;

save();

main.innerHTML="";
let userid ="5f1faf7f2002dc0017aa23d4";

//openFeed button

let openFeedButton=document.getElementById('openFeed');
openFeedButton.addEventListener('click', openFeed);
openFeedButton.classList.add("waves-effect");
openFeedButton.classList.add("waves-light");
openFeedButton.classList.add("btn");

//searchLink button

let searchLinkButton=document.getElementById('searchLink');
searchLinkButton.addEventListener('click', searchLink);
searchLinkButton.classList.add("waves-effect");
searchLinkButton.classList.add("waves-light");
searchLinkButton.classList.add("btn");

//sumbitID button

let submitIDbutton=document.getElementById('idButton');
//submitIDbutton.addEventListener('click', submitID);
submitIDbutton.classList.add("waves-effect");
submitIDbutton.classList.add("waves-light");
submitIDbutton.classList.add("btn");

// function submitID(){
//     // userid = $('#userid').val();
//     userid = document.getElementById('useridinput').value;
    userid="5f1faf7f2002dc0017aa23d4";
//     chrome.extension.getBackgroundPage().console.log(userid);
//     submitIDbutton.classList.add("invisible");
// }
submitBotton.addEventListener('click',()=>{
    // insert code
    userid = document.getElementById('submitID').elements["useridinput"];
    console.log(userid);
    chrome.getBackgroundPage().console.log('Done');
})

function openFeed(){
    window.open("https://underscore-web.herokuapp.com/posts#");
}

function searchLink(){
    let linkToSearch = "https://underscore-web.herokuapp.com/posts/search?search="+url;
    window.open(linkToSearch);

}
// function to save highlighted snippet
function save(){
   
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        let found=0;
        for(let key of allKeys){
            if(key==url){
                found=1;
                chrome.storage.sync.get(key, function(item) {
                 
                    item[key].push(word);
                  });

            }
        }
        if(found==0){
        chrome.storage.sync.set({[word]: [url]}, function() {
       
      });
        }
        p.innerHTML="";
        getSaved();
  
    });
    footer.innerHtml="saved";
}


// function to retrieve the selected saved snippets
function getSaved(){

    
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        // if there are no snippets stored
        if(allKeys==null){
            main.innerHTML="No snippets to show";
            return;
        
        }
        // creates and shows an array of snippets
        for(let key of allKeys){
     
                    chrome.storage.sync.get(key, function(items) {
                        let itemsArray=items[key];
                        let card=document.createElement('div');
                        card.classList.add("card");

                        let cardText=document.createElement('h6');
                        cardText.classList.add("card-text");
                        
                        let cardContent =document.createElement('div');
                        cardContent.classList.add('card-content');

                        let cardUrl = document.createElement('p');
                        cardUrl.classList.add("card-action");
                        cardUrl.classList.add("card-text");
                        cardUrl.classList.add("link-bg-color");
                        //cardUrl.classList.add("right-align");

                        /*let cardClose = document.createElement('p');
                        cardClose.classList.add("card-action");
                        cardClose.classList.add("card-text");
                        cardClose.classList.add("right-align");*/

                        let cardActions=document.createElement('div');
                        cardActions.classList.add('card-action');

                        let deleteButton=document.createElement('button');
                        deleteButton.classList.add("waves-effect");
                        deleteButton.classList.add("waves-light");
                        deleteButton.classList.add("btn-small");
                        deleteButton.style.backgroundColor="#ff726f";
                        deleteButton.style.marginLeft="20px";

                        let postButton=document.createElement('button');
                        postButton.classList.add("waves-effect");
                        postButton.classList.add("waves-light");
                        postButton.classList.add("btn-small");
                        deleteButton.classList.add("btn-floating");

                        deleteButton.innerHTML="&times;";
                        postButton.innerHTML="Post";
                        deleteButton.addEventListener('click',()=>{
                            chrome.storage.sync.remove(key,()=>{
                                card.remove();
                                cardText.remove();
                            })
                            
                        })
                        postButton.addEventListener('click',()=>{
                            // insert code
                            fetch('https://underscore-web.herokuapp.com/posts/remote/new', {
	                            method: 'POST',
	                            body: JSON.stringify({
		                            "link": url,
		                            "snippet": word,
		                            "userid": userid
	                            }),
	                            headers: {
	                            	'Content-type': 'application/json; charset=UTF-8'
	                            }
                            }).then(function (response) {
                            	if (response.ok) {
                            		return response.json();
                            	}
                        	return Promise.reject(response);
                            }).then(function (data) {
                            	console.log(data);
                            }).catch(function (error) {
                            	console.warn('Something went wrong.', error);
                            });
                            chrome.storage.sync.remove(key,()=>{
                                cardText.remove();
                                cardUrl.remove();
                                card.remove();
                            })                            
                            
                        })
                        for(let item of itemsArray){
                            cardText.innerHTML+=key+"\n";
                            cardUrl.innerHTML+=item.toString()+"\n";
                        }
                    cardContent.appendChild(cardUrl);
                    cardContent.appendChild(cardText);
                    cardActions.appendChild(postButton);
                    cardActions.appendChild(deleteButton);
                    card.appendChild(cardContent);
                    card.appendChild(cardActions);
                    main.appendChild(card);
                  });

            
        }
       
    });
 
}