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

let openFeedButton=document.getElementById('openFeed');
openFeedButton.addEventListener('click', openFeed);
openFeedButton.classList.add("waves-effect");
openFeedButton.classList.add("waves-light");
openFeedButton.classList.add("btn");

main.innerHTML="";
let userid='5f1faf7f2002dc0017aa23d4';

save();

let submitIDbutton=document.getElementById('idButton');
submitIDbutton.addEventListener('click', SubmitID);
submitIDbutton.classList.add("waves-effect");
submitIDbutton.classList.add("waves-light");
submitIDbutton.classList.add("btn");

function SubmitID(){
    submitIDbutton.style.display = "none";
}

function openFeed(){
    window.open("https://underscore-web.herokuapp.com/posts#");
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
                        
                        let cardUrl = document.createElement('p');
                        cardUrl.classList.add("card-action");
                        cardUrl.classList.add("card-text");
                        cardUrl.classList.add("link-bg-color");

                        let deleteButton=document.createElement('button');
                        deleteButton.classList.add("waves-effect");
                        deleteButton.classList.add("waves-light");
                        deleteButton.classList.add("btn");
                        deleteButton.classList.add("x-button");

                        let postButton=document.createElement('button');
                        postButton.classList.add("waves-effect");
                        postButton.classList.add("waves-light");
                        postButton.classList.add("btn");

                        deleteButton.innerHTML="x";
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
		                            "userid": '5f1faf7f2002dc0017aa23d4'
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
                    card.appendChild(cardUrl);
                    card.appendChild(cardText);
                    card.appendChild(postButton);
                    card.appendChild(deleteButton);
                    main.appendChild(card);
                  });

            
        }
       
    });
 
}