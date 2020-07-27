window.onload=function(){

console.log('ff01Setup')

// rolls 1 die---------------------------------------------------
function rollD1(){
    return Math.ceil(Math.random()*6)
}

// initialise stat variables-------------------------------------------
var initialSkillRoll = 0
var initialStaminaRoll = 0
var initialLuckRoll = 0
var initialSkillText = document.getElementById('initialSkillText')
var initialStaminaText = document.getElementById('initialStaminaText')
var initialLuckText = document.getElementById('initialLuckText')

//roll initial skill stamina luck for setup page
var rollInitial = document.getElementById('rollInitial')
rollInitial.addEventListener('click',function(e){
    //set skill stamina luck values
    initialSkillRoll = rollD1()
    initialStaminaRoll = rollD1()+rollD1()
    initialLuckRoll = rollD1()
   
    // set skill stamina luck text
    initialSkillText.innerHTML = initialSkillRoll + ' + 6 = '+(initialSkillRoll+6)
    initialStaminaText.innerHTML = initialStaminaRoll + ' + 12 = '+(initialStaminaRoll+12)
    initialLuckText.innerHTML = initialLuckRoll + ' + 6 = ' +(initialLuckRoll+6)
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
    if(initialSkillRoll==0 || initialStaminaRoll==0 || initialLuckRoll==0 || potion.value=='Choose potion'){
        //check if user wants to proceed despite not having filled in all stats
        alert('Have you rolled your Initial stats and chosen your potion?')
    } else{
        //fill in starting inventory
        var inventoryArray = []
        inventoryArray.push('sword','leatherArmor','lantern',potion.value)

        //fill in starting provisions
        provisions.innerHTML = 10

        //save initial stats and inventory to storage
        localStorage.setItem('skill',initialSkillRoll+6)
        localStorage.setItem('stamina',initialStaminaRoll+12)
        localStorage.setItem('luck',initialLuckRoll+6)
        localStorage.setItem('initialSkill',initialSkillRoll+6)
        localStorage.setItem('initialStamina',initialStaminaRoll+12)
        localStorage.setItem('initialLuck',initialLuckRoll+6)
        localStorage.setItem('provisions',provisions.innerHTML)
        localStorage.setItem('inventoryArray',JSON.stringify(inventoryArray))
        window.location.href = 'ff01Game.html'
    }
})

}