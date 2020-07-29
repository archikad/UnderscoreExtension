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
main.innerHTML="";
let userid='5f1faf7f2002dc0017aa23d4';
let submitIDbutton=document.getElementById('idButton');

save();

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
                    let h3=document.createElement('h3');
                    let h4=document.createElement('h4');
                    let deleteButton=document.createElement('button');
                    let postButton=document.createElement('button');
                    deleteButton.innerHTML="Remove";
                    postButton.innerHTML="Post";
                        deleteButton.addEventListener('click',()=>{
                            chrome.storage.sync.remove(key,()=>{
                                h4.remove();
                                h3.remove();
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
                                h4.remove();
                                h3.remove();
                            })                            
                            
                        })
                        for(let item of itemsArray){
                            h4.innerHTML+=key+"\n\n";
                            h4.innerHTML+=item.toString()+"\n";
                        }
                    h3.appendChild(h4);
                    h3.appendChild(deleteButton);
                    h3.appendChild(postButton);
                    main.appendChild(h3);
                  });

            
        }
       
    });
 
}