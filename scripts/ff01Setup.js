window.onload=function(){

console.log('ff01Setup')

// rolls 1 die---------------------------------------------------
function rollD1(){
    return Math.ceil(Math.random()*6)
}

// initialise stat variables-------------------------------------------
var initialSkill = document.getElementById('initialSkill')
var initialStamina = document.getElementById('initialStamina')
var initialLuck = document.getElementById('initialLuck')

//roll initial skill stamina luck for setup page
var rollInitial = document.getElementById('rollInitial')
rollInitial.addEventListener('click',function(e){
    // set skill stamina luck values
    initialSkill.innerHTML = rollD1()+6
    initialStamina.innerHTML = rollD1()+rollD1()+12
    initialLuck.innerHTML = rollD1()+6
})

//choose potion----------------------------------------------
var potion = document.getElementById('potion')

//initialise provisions and hide it---------------------------------------------------
var provisions = document.getElementById('provisions')
provisions.style.display = 'none'

//start game------------------------------------------------------------
var startAdventure = document.getElementById('startAdventure')
startAdventure.addEventListener('click',function(e){
    
    //check if all initial stats has a value and potion is chosen
    if(initialSkill.innerHTML=='' || initialStamina.innerHTML=='' || initialLuck.innerHTML=='' || potion.value=='Choose potion'){
        //check if user wants to proceed despite not having filled in all stats
        alert('Have you rolled your Initial stats and chosen your potion?')
    } else{
        //fill in starting inventory
        var inventoryArray = []
        inventoryArray.push('sword','leatherArmor','lantern',potion.value)

        //fill in starting provisions
        provisions.innerHTML = 10

        //save initial stats and inventory to storage
        localStorage.setItem('skill',initialSkill.innerHTML)
        localStorage.setItem('stamina',initialStamina.innerHTML)
        localStorage.setItem('luck',initialLuck.innerHTML)
        localStorage.setItem('initialSkill',initialSkill.innerHTML)
        localStorage.setItem('initialStamina',initialStamina.innerHTML)
        localStorage.setItem('initialLuck',initialLuck.innerHTML)
        localStorage.setItem('provisions',provisions.innerHTML)
        localStorage.setItem('inventoryArray',JSON.stringify(inventoryArray))
        window.location.href = 'ff01Game.html'
    }
})

}