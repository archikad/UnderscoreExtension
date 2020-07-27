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
let saveButton=document.getElementById('saveSnippet');
saveButton.addEventListener('click',save);
main.innerHTML="";

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
        chrome.storage.sync.set({[url]: [word]}, function() {
       
      });
        }
  
    });
    footer.innerHtml="saved";
    getSaved();
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
                    let el = document.createElement('textarea');
                    deleteButton.innerHTML="Remove";
                    postButton.innerHTML="Post";
                        deleteButton.addEventListener('click',()=>{
                            chrome.storage.sync.remove(key,()=>{
                                footer.innerHTML="Deleted";
                            })
                        })
                        postButton.addEventListener('click',()=>{
                            el.value = str;
                            document.body.appendChild(el);
                            el.select();
                            document.execCommand('copy');
                            document.body.removeChild(el);
                        })
                        for(let item of itemsArray){
                            h4.innerHTML+=item.toString()+"\n";
                        }
                    h4.innerHTML+=key+"\n\n";
                    h3.appendChild(h4);
                    h3.appendChild(deleteButton);
                    h3.appendChild(postButton);
                    main.appendChild(h3);
                  });

            
        }
       
    });
 
}