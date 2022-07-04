// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const container = document.querySelector('.container');

document.getElementById("crawl").addEventListener('click',function(){
    // window.myapp.openfile("open-file",{calback:(result)=>{
    //     console.log('hello');
    //     console.log(result);
    //     document.getElementById('abs-path').value = result.filePaths;
    //     }
        window.api.send("toMain", "here is renderer")
    
        // window.crawler.hello()
        // window.crawler.crawl("hell");
        console.log('Start Crawling.')
});

let x = (function action () {
    e = 0;
    return function innerfunc(){
        e += 1;
        console.log(`hello, this is ${e}times visits` )
    }
})();

window.api.handle("fromMain",(data)=>{
    const span = document.createElement('span');
    span.innerText = `${data}`;
    container.appendChild(span);
});

document.getElementById("hello").addEventListener('mouseover',()=>{
    window.api.openWindow('openWindow','hello')
})