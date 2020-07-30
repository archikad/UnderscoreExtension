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

// save and create a snippet of whatever was just highlighted
save();

main.innerHTML="";

//hard-set userid TODO figure out how to pass field to variable
//let userid ="5f1faf7f2002dc0017aa23d4";

// create/style openFeed button

let openFeedButton=document.getElementById('openFeed');
openFeedButton.addEventListener('click', openFeed);
openFeedButton.classList.add("waves-effect");
openFeedButton.classList.add("waves-light");
openFeedButton.classList.add("btn");

// create/style searchLink button

let searchLinkButton=document.getElementById('searchLink');
searchLinkButton.addEventListener('click', searchLink);
searchLinkButton.classList.add("waves-effect");
searchLinkButton.classList.add("waves-light");
searchLinkButton.classList.add("btn");

//create/style sumbitID button

let submitIDbutton=document.getElementById('idButton');
//submitIDbutton.addEventListener('click', submitID);
submitIDbutton.classList.add("waves-effect");
submitIDbutton.classList.add("waves-light");
submitIDbutton.classList.add("btn");

var userid;

submitIDbutton.onclick = function submitID(e) {
    e.preventDefault();
    userid = document.getElementById('useridinput').value;
    console.log(userid);

    return false;
}

//opens feed function for feed button

function openFeed(){
    window.open("https://underscore-web.herokuapp.com/posts#");
}

//searches the link for the most recent article you snipped from (NOT CURRENT PAGE, maybe fix?)

function searchLink(){
    let linkToSearch = "https://underscore-web.herokuapp.com/posts/search?search="+url;
    window.open(linkToSearch);

}

// function to save highlighted snippet and show it, calls getSaved() within
function save(){
   

    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        let found=0;
        //
        for(let key of allKeys){
            if(key==word){
                found=1;
                chrome.storage.sync.get(key, function(item) {
                 
                    item[key].push(url);
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


// function to retrieve and create the cards for the selected saved snippets
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

                        //snippet on card
                        let cardText=document.createElement('h6');
                        cardText.classList.add("card-text");
                        
                        //actual card
                        let cardContent =document.createElement('div');
                        cardContent.classList.add('card-content');

                        //url on card
                        let cardUrl = document.createElement('p');
                        cardUrl.classList.add("card-action");
                        cardUrl.classList.add("card-text");
                        cardUrl.classList.add("link-bg-color");

                        let cardActions=document.createElement('div');
                        cardActions.classList.add('card-action');

                        //create delete button in card
                        let deleteButton=document.createElement('button');
                        deleteButton.classList.add("waves-effect");
                        deleteButton.classList.add("waves-light");
                        deleteButton.classList.add("btn-small");
                        deleteButton.style.backgroundColor="#ff726f";
                        deleteButton.style.marginLeft="20px";

                        //create post button in card
                        let postButton=document.createElement('button');
                        postButton.classList.add("waves-effect");
                        postButton.classList.add("waves-light");
                        postButton.classList.add("btn-small");
                        deleteButton.classList.add("btn-floating");

                        deleteButton.innerHTML="&times;";
                        postButton.innerHTML="Post";

                        // delete card when post button is clicked
                        deleteButton.addEventListener('click',()=>{
                            chrome.storage.sync.remove(key,()=>{
                                card.remove();
                                cardText.remove();
                            })
                            
                        })

                        // post card when post button is clicked
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

                            //remove card after posted
                            chrome.storage.sync.remove(key,()=>{
                                cardText.remove();
                                cardUrl.remove();
                                card.remove();
                            })                            
                            
                        })
                        //add to the card, for each item snippet
                        for(let item of itemsArray){
                            cardText.innerHTML+=key+"\n";
                            cardUrl.innerHTML+=item.toString()+"\n";
                        }
                    // append elements to card, appen card to the main
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