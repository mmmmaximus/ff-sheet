window.onload=function(){

console.log('book')

//list of books
var book = document.getElementById('book')

//button to confirm book
var selectBook = document.getElementById('selectBook')
selectBook.addEventListener('click',function(e){
    // check is a book is selected
    if(book.value== 'Choose book'){
        alert('Choose a book first')
    } else{
        //store choice of book 
        localStorage.setItem('book', book.value)
        //opens the game.html page with book loaded
        location.href = book.value + 'Setup.html'
    }
})
    
}