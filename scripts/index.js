window.onload=function(){

console.log('index')

//delete save if click new game
const newGameLink = document.getElementById('newGameLink')
newGameLink.onclick = function(){
    localStorage.clear()
}

//hide load game link if there is no saved games
const loadGameLink = document.getElementById('loadGameLink')
if(localStorage.length<2){
    loadGameLink.style.display = 'none'
}



}