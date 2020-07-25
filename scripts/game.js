import { skill,stamina,luck,initialSkill,initialStamina,initialLuck,provisions,notes,load,save,deleteSave,testLuck,ingameText,
rolldie,rolldice,fightMechanic,enemyName,enemySkill,enemyStamina,useLuckTogetherButtons,battleText,
fight,allEnemies,useLuck,useProvisions } from '../constants/gameElements.js';

import * as items from '../ff01Scripts/ff01Items.js';

window.onload=function(){

console.log('game');

//additional item functions---------------------------------------------
//cresent shield effect
let cresentShieldDisplay = document.getElementById('cresentShieldDisplay')
let cresentShieldRollButton = document.getElementById('cresentShieldRollButton')
let cresentShieldText = document.getElementById('cresentShieldText')

function cresentShieldEffect(){
    if(items.inventoryArray.includes('cresentShield')){   
        cresentShieldDisplay.style.display = 'block'
        cresentShieldRollButton.style.display = 'block'
        cresentShieldText.style.display = 'block'
        cresentShieldText.innerHTML = ''
        fight.style.display = 'none'
    }
}

cresentShieldRollButton.addEventListener('click',function(){
    let cresentShieldRoll = rollD1()
    cresentShieldText.innerHTML = 'You rolled a '+cresentShieldRoll
    if(cresentShieldRoll==6){
        stamina.innerHTML = Number(stamina.innerHTML) + 1
        cresentShieldText.innerHTML += '<br>The Cresent Shield protected you<br>You lose 1 less stamina'
    } else {
        if(pageLog[pageLog.length-1]=='39'){
            if(rolldieResult==2 || rolldieResult==4){
                useLuck.addEventListener('click',usingLuck) //can use luck if only took 1damage but shield miss
            }
        }
    }
    this.style.display = 'none'
    fight.style.display = 'block'
})

//replace item with another when picking up item
function replace(){ //to remove item from inventory
    items.removeFromInventory(this)
    Array.prototype.map.call(items.inventoryArray,function(itemString){ //remove listern from all inventory items
        document.getElementById(itemString).removeEventListener('click', replace)
    })
    ingameText.style.display = 'none' //hide ingame text
    showElementByClass(otherPages)
}

//not fixed game variables----------------------------------------------
let enemyList = []
let attackStrength
let enemyAttackStrength
let attackStrengthBonus
let attackRoundCounter = 0
let hitsReceivedCounter = 0
let win
let lucky
let unlucky
let escape
let testLuckRoll
let getItemStateArray = []
let getOtherPagesStateArray = []
let rolldieResult 
let rolldiceResult
let chosenWeapon // for page310
let chosenItems = [] //for page313

//create enemy element 
let enemyElement = document.createElement('div')
let enemyNameText = document.createElement('text')
let enemySkillText = document.createElement('span')
let enemySkillValue = document.createElement('span')
let enemyStaminaText = document.createElement('span')
let enemyStaminaValue = document.createElement('span')
let useLuckTogetherButton = document.createElement('button')
enemyElement.classList.add('enemy')
enemyNameText.innerHTML = 'Enemy '
enemyNameText.classList.add('enemyName')
enemySkillText.innerHTML = '<br>Skill: '
enemySkillValue.classList.add('enemySkill')
enemyStaminaText.innerHTML = ' Stamina: '
enemyStaminaValue.classList.add('enemyStamina')
useLuckTogetherButton.innerHTML = 'Use luck'
useLuckTogetherButton.classList.add('useLuckTogetherButton')
useLuckTogetherButton.style.display = 'none'
enemyElement.appendChild(enemyNameText)
enemyElement.appendChild(enemySkillText)
enemyElement.appendChild(enemySkillValue)
enemyElement.appendChild(enemyStaminaText)
enemyElement.appendChild(enemyStaminaValue)
enemyElement.appendChild(document.createElement('br'))
enemyElement.appendChild(useLuckTogetherButton)

//to fight enemies together
let chooseEnemy = document.getElementById('chooseEnemy')
let chosenEnemy = document.createElement('option')
chosenEnemy.classList.add('enemyChoice')
let enemyChoices = document.getElementsByClassName('enemyChoice')     
let playerDiceRollArray = []
let enemyDiceRollArray = []
let playerAttackStrengthArray = []
let enemyAttackStrengthArray = []
let enemies = document.getElementsByClassName('enemy')

//page mechanism-----------------------------------------------------------
let pageLog = []
let pageNums = document.getElementsByClassName('pageNum')

//define different page and button classes
let pages = document.getElementsByClassName('page')
let otherPages = document.getElementsByClassName('otherPage')
let luckyOtherPages = document.getElementsByClassName('lucky')
let unluckyOtherPages = document.getElementsByClassName('unlucky')
let winOtherPages = document.getElementsByClassName('win')
let escapeOtherPages = document.getElementsByClassName('escape')
let getItem = document.getElementsByClassName('getItem') //for otherPages where player gets items

//addeventlistener to all escape pages when player escapes fight
Array.prototype.map.call(escapeOtherPages, function(escapeOtherPage){
    escapeOtherPage.addEventListener('click',function(){
        escape()
        stamina.innerHTML-=2
        checkPlayerDeath() //to catch death state if escape to a healing page
        allEnemies.innerHTML = ''
    })
})

//function to hide/show elements of a certain class 
function hideElementByClass(elementArray){
    Array.prototype.map.call(elementArray, function(element){
        return element.style.display = 'none'
    })
}
function showElementByClass(elementArray){
    Array.prototype.map.call(elementArray, function(element){
        return element.style.display = 'block'
    })
}
hideElementByClass(pages)

//show current page number player is on
for(let i=0;i<pageNums.length;i++){
    pageNums[i].innerHTML = 'Page '+ (i+1)
}
    
// change page reference
Array.prototype.map.call(otherPages, function(page){
    return page.addEventListener('click',changePage)
})

//function to change reference when otherPages is clicked----------------------------
function changePage(){
    //show all buttons on page if they are currently hidden
    showElementByClass(otherPages)
    
    //hide all pages
    hideElementByClass(pages)
  
    //hide fight mechanic show save buttons, clear enemy list, ingame text, battle text, counters, win, lucky, unlucky and escape functions, rolldie, rolldice, testLuck, useProvisions
    fightMechanic.style.display = 'none'
    save.style.display = 'block' //can only save on pages with no function
    enemyList = []
    allEnemies.innerHTML = ''
    ingameText.innerHTML = ''
    ingameText.style.display = 'block' //show ingametext on all func pages
    battleText.innerHTML = ''
    attackRoundCounter = 0
    hitsReceivedCounter = 0
    win = function(){}
    lucky = function(){}
    unlucky = function(){}
    escape = function(){}
    rolldie.style.display = 'none'
    rolldice.style.display = 'none'
    testLuck.style.display = 'none' //for luck outside of battle
    useProvisions.style.display = 'none'
    
    //show selected page
    for(let i=0;i<pages.length;i++){
        if(pages[i].id==this.innerHTML){
            pages[i].style.display = 'block'
            //run every event function that occur on selected page
            if(pageEventFunctions[pages[i].id]){
                pageEventFunctions[pages[i].id]()
                //if page has functions, hide save button
                save.style.display = 'none'
            }
            //check death if page func has instant stamina loss
            checkPlayerDeath()
        }
    }
    //add new page to log
    pageLog.push(this.innerHTML)
    console.log(pageLog)
}

//list of functions in very page
let pageEventFunctions= {
2:function(){
    ingameText.innerHTML = 'Test luck to see if the Ogre wakes up'
    testLuck.style.display = 'block'
    hideElementByClass(otherPages)
    lucky = function(){
        showElementByClass(luckyOtherPages)
        ingameText.innerHTML += '<br>You didnt wake the Ogre'
    }
    unlucky = function(){
        showElementByClass(unluckyOtherPages)
        ingameText.innerHTML += '<br>You woke the Ogre'
    }
},
3:function(){
    ingameText.innerHTML = 'You can pay 3 gold pieces or threaten him'
    if(gold.innerHTML<3){
        ingameText.innerHTML = 'You dont have enough gold pieces'
        hideElementByClass(winOtherPages)
    }
},
8:function(){
    fightMechanic.style.display = 'block'
    hideElementByClass(otherPages)
    showElementByClass(escapeOtherPages)
    enemyList = [[7,6]]  
    addEnemy() 
    ingameText.innerHTML = 'Fight or escape!'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
11:function(){
    ingameText.innerHTML = 'You gain 2 stamina and 1 skill'
    skill.innerHTML=Math.min(initialSkill.innerHTML,Number(skill.innerHTML)+1)
    stamina.innerHTML=Math.min(initialStamina.innerHTML,Number(stamina.innerHTML)+2)
},
12:function(){
    if(pageLog[pageLog.length-1]=='161'){
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You attracted attention'
        hideElementByClass(winOtherPages)
    }
},
14:function(){
    if(pageLog[pageLog.length-1]=='161'){
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You attracted attention'
        hideElementByClass(winOtherPages)
    }
},
15:function(){ 
    ingameText.innerHTML = 'You recover an extra 2 stamina and 1 skill'
    skill.innerHTML=Math.min(initialSkill.innerHTML,Number(skill.innerHTML)+1)
    stamina.innerHTML=Math.min(initialStamina.innerHTML,Number(stamina.innerHTML)+2)
},
16:function(){
    fightMechanic.style.display = 'block'
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    fight.addEventListener('click',a16)
    function a16(){
        attackRoundCounter++
        if(attackRoundCounter==2){
            ingameText.innerHTML = 'Fight or escape!'
            showElementByClass(escapeOtherPages)
            fight.removeEventListener('click',a16)
        }
    }
    enemyList = [[8,10]]  
    addEnemy()  
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
17:function(){ 
    ingameText.innerHTML = 'Test luck to see if the stake kills the vampire'
    testLuck.style.display = 'block'
    hideElementByClass(otherPages)
    lucky = function(){
        showElementByClass(luckyOtherPages)
        ingameText.innerHTML += '<br>You killed the Vampire'
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>The Vampire loses 3 stamina<br>Continue to fight or escape'
        showElementByClass(unluckyOtherPages)
        showElementByClass(escapeOtherPages)
    }
},
18:function(){
    testLuck.style.display = 'block'
    hideElementByClass(otherPages)
    lucky = function(){
        ingameText.innerHTML += '<br>You manage to jump back in time'
        showElementByClass(luckyOtherPages)
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You fall into the pit<br>You lose 1 stamina'
        showElementByClass(unluckyOtherPages)
        stamina.innerHTML--
        checkPlayerDeath()
    }
},
19:function(){
    fightMechanic.style.display = 'block'
    hideElementByClass(otherPages)
    enemyList = [[5,5],[5,6]]  
    addEnemy()      
    ingameText.innerHTML = 'Fight!'
    win = function(){
        showElementByClass(winOtherPages)
    }       
},
20:function(){
    fightMechanic.style.display = 'block'
    hideElementByClass(otherPages)
    showElementByClass(escapeOtherPages)
    enemyList = [[7,4],[6,6],[7,5],[7,5]]  
    addEnemy()      
    ingameText.innerHTML = 'Fight or escape!'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }       
},
24:function(){
    skill.innerHTML--
    fightMechanic.style.display = 'block'
    showElementByClass(escapeOtherPages)
    escape = function(){
        fight.removeEventListener('click',a24)
    }
    hideElementByClass(winOtherPages)
    enemyList = JSON.parse(localStorage.getItem('enemyList')) //refer from 173
    addEnemy()     
    fight.addEventListener('click',a24)
    function a24(){
        if(enemyAttackStrength> attackStrength){
            hitsReceivedCounter++
        }
        if(hitsReceivedCounter%3==0 && hitsReceivedCounter>0){
            skill.innerHTML--
        }
    }
    ingameText.innerHTML = 'You lose 1 skill<br>Fight or escape!'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
        fight.removeEventListener('click',a24)           
    } 
},
25:function(){
    ingameText.innerHTML = 'You lose 1 skill out of fear'
    skill.innerHTML--
},
27:function(){
    ingameText.innerHTML = 'You can replace your old sword with this enchanted sword'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
    document.getElementById('useEnchantedSword').onclick = function(){
        ingameText.innerHTML = 'You replaced your old sword'
        initialSkill.innerHTML = Number(initialSkill.innerHTML)+2
        skill.innerHTML = initialSkill.innerHTML
        this.style.display = 'none'
        items.addToInventory(items.enchantedSword)
        items.removeFromInventory(items.riverSword)
        items.removeFromInventory(items.sword)
    }
},
28:function(){
    skill.innerHTML = Math.min(Number(skill.innerHTML)+2,initialSkill.innerHTML)
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
    gold.innerHTML = Number(gold.innerHTML) + 8
    ingameText.innerHTML = 'You gain 8 gold pieces, 2 luck and 2 skill'
},
31:function(){
    ingameText.innerHTML = 'You gain 2 skil'
    skill.innerHTML = Math.min(Number(skill.innerHTML)+2,initialSkill.innerHTML)
},
32:function(){
    ingameText.innerHTML = 'You gain 2 luck and lose your cheese'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
    items.removeFromInventory(cheese)
},
33:function(){
    hideElementByClass(winOtherPages)
    showElementByClass(escapeOtherPages)
    enemyList = [[6,4]]  
    addEnemy()     
    fightMechanic.style.display = 'block'
    ingameText.innerHTML = 'Fight or escape!'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    } 
},
34:function(){
    ingameText.innerHTML = 'You may take the Hardwood Mallet and Silver Chisel if you leave an item behind'
    document.getElementById('useMalletAndChisel').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.woodMallet) //add item to inventory array
        items.addToInventory(items.silverChisel)
        hideElementByClass(otherPages) //hide otherPage button until item replaced
        ingameText.innerHTML = 'You take the Hardwood Mallet and Silver Chisel<br>Now click on an item in your inventory to replace it' //show instruction to player
        Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
            document.getElementById(itemString).addEventListener('click', replace)
        })
    }
},
38:function(){
    ingameText.innerHTML = 'You may take the pickled eggs, +2 provisions'
    document.getElementById('usePickledEggs').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the provisions'
        provisions.innerHTML = Number(provisions.innerHTML) + 2  
        this.style.display = 'none'      
    })
},
39:function(){
    hideElementByClass(winOtherPages)
    attackStrengthBonus = Number(attackStrengthBonus) + 2
    ingameText.innerHTML = '+2 attack strength bonus added<br>Fight!'
    fightMechanic.style.display = 'block'
    enemyList = [[11,18]]
    addEnemy()
    fight.addEventListener('click',a39)  
    function a39(){
        useLuck.removeEventListener('click',usingLuck) //removed by default
        ingameText.innerHTML = ''
        if(enemyAttackStrength> attackStrength){
            stamina.innerHTML = Number(stamina.innerHTML)+2 //add back stamina to roll die first and determine damage
            fightMechanic.style.display = 'none'
            rolldie.style.display = 'block'
            rolldie.addEventListener('click',b39)
            ingameText.innerHTML = 'Enemy hits you<br>Roll die to determine damage'
        }
        if(enemyAttackStrength< attackStrength){
            enemyStamina[0].innerHTML-- //extra 1 damage
            useLuck.addEventListener('click',usingLuck) //add back listener 
            battleText.innerHTML += '<br>Enemy loses 1 extra stamina'
        }
        if(enemyStamina[0].innerHTML<1){ //have to check death as additional -1stamina not covered by fightoneatatime func
            battleText.innerHTML += '<br>You won!'
            useLuck.removeEventListener('click',usingLuck)
            //remove defeated enemy from enemylist
            enemyList.shift()
            //remove first enemy element
            allEnemies.removeChild(allEnemies.firstElementChild)
            //check if theres enemies left
            if(enemyList.length<1){
                ingameText.innerHTML = ''
                //call win function when win
                win()
            }    
        }    
    } 
    function b39(){
        if(rolldieResult==6){
            ingameText.innerHTML += '<br>No damage taken'
        } else {
            if(rolldieResult==2 || rolldieResult==4){
                stamina.innerHTML-- 
                ingameText.innerHTML += '<br>Only 1 stamina lost'
                useLuck.style.display = 'block'
            }
            if(rolldieResult%2==1){
                stamina.innerHTML-=2
                ingameText.innerHTML += '<br>You lose 2 stamina'
                useLuck.style.display = 'block'
                useLuck.addEventListener('click',usingLuck) //add back listener 
            }
            cresentShieldEffect()
        }
        fightMechanic.style.display = 'block'
        rolldie.style.display = 'none'
        battleText.innerHTML = ''
        //check for death since since fight is called before a39 thus no death check
        checkPlayerDeath() 
        if(stamina.innerHTML<1){ //addition removal of listener
            fight.removeEventListener('click',a39)
        }
    } 
    win = function(){     
        ingameText.innerHTML += 'You beat the Warlock!'
        attackStrengthBonus-=2
        showElementByClass(winOtherPages)
        fight.removeEventListener('click',a39)
        rolldie.removeEventListener('click',b39)
    }
},
40:function(){
    ingameText.innerHTML = 'You lose 1 skill'
    skill.innerHTML--
},
41:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[9,6]]  
    addEnemy()     
    fightMechanic.style.display = 'block' 
    fight.addEventListener('click',a41)
    function a41(){
        if(attackStrength>enemyAttackStrength){
            showElementByClass(otherPages)
            ingameText.innerHTML = 'You hit the enemy, turn to 310'
            fightMechanic.style.display = 'none'
            fight.removeEventListener('click',a41)
        }
    }
},
44:function(){
    ingameText.innerHTML = 'You finish the provisions you started'
    provisions.innerHTML--
    stamina.innerHTML = Math.min(Number(stamina.innerHTML)+4,initialStamina.innerHTML)
},
45:function(){
    ingameText.innerHTML = 'You lose your cheese'
    items.removeFromInventory(items.cheese)
},
47:function(){
    hideElementByClass(otherPages)
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a47)
    function a47(){
        if(rolldieResult==6){
            ingameText.innerHTML += '<br>You plunge into the river'
            showElementByClass(unluckyOtherPages)
        } else{
            ingameText.innerHTML += '<br>You regain your balance'
            showElementByClass(luckyOtherPages)
        }
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a47)
    }
},
49:function(){
    ingameText.innerHTML = 'You lose 2 stamina'
    stamina.innerHTML-=2
},
50:function(){ 
    ingameText.innerHTML = 'You may take the bronze key'
    document.getElementById('useBronzeKey9').onclick = function(){
        ingameText.innerHTML = 'You take the bronze key'
        this.style.display = 'none'
        items.addToInventory(items.bronzeKey9)
    }
},
51:function(){ 
    ingameText.innerHTML = 'You use the Potion of Invisibility<br>You gain 2 luck'
    items.removeFromInventory(items.potionOfInvisibility)
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
53:function(){ 
    ingameText.innerHTML = 'Roll dice to see if you manage to open the door'
    hideElementByClass(otherPages)
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a53)
    function a53(){
        if(rolldiceResult<=skill.innerHTML){
            showElementByClass(luckyOtherPages)
            ingameText.innerHTML += '<br>Door opens'
        } else{
            showElementByClass(unluckyOtherPages)
            stamina.innerHTML--
            checkPlayerDeath()
            ingameText.innerHTML += '<br>Door doesnt budge, lose 1 stamina'
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a53)
    }
},
55:function(){  
    hideElementByClass(otherPages)
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a55)
    function a55(){
        if(rolldiceResult<=skill.innerHTML && rolldiceResult<=luck.innerHTML){
            showElementByClass(luckyOtherPages)
            ingameText.innerHTML += '<br>You manage to hold on and reach the north bank'
        } else{
            showElementByClass(unluckyOtherPages)
            ingameText.innerHTML += '<br>You are thrown off the raft'
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a55)
    }
},
56:function(){ 
    ingameText.innerHTML = 'You leave your old sword behind'
    items.removeFromInventory(items.sword)
    if(skill.innerHTML>initialSkill.innerHTML){  //if exceed initial w sword, set skill back to initial
        skill.innerHTML = initialSkill.innerHTML
    }
},
58:function(){
    ingameText.innerHTML = 'Eat provisions or continue'
    hideElementByClass(winOtherPages)
    useProvisions.style.display = 'block'
    useProvisions.addEventListener('click',a58)
    function a58(){ 
        if(stamina.innerHTML==initialStamina.innerHTML){ //if provisions eaten even at max stamina
            provisions.innerHTML--
            ingameText.innerHTML = 'Provisions eaten'
        }
        showElementByClass(winOtherPages)
        hideElementByClass(luckyOtherPages)
        useProvisions.removeEventListener('click',a58) 
    }
    let page367 = document.getElementById('page367')
    page367.addEventListener('click',removeListener)
    function removeListener(){
        useProvisions.removeEventListener('click',a58) //remove listener if provisions not eaten
        page367.removeEventListener('click',removeListener)
    }
},
61:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    fightMechanic.style.display = 'block'
    enemyList = [[7,8]]
    addEnemy()
    fight.addEventListener('click',a61)
    function a61(){
        attackRoundCounter++
        if(attackRoundCounter==2){
            ingameText.innerHTML = 'Fight or escape!'
            showElementByClass(escapeOtherPages)
            fight.removeEventListener('click',a61)
        }
    }
    win = function(){ //if win by luck
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
        fight.removeEventListener('click',a61)
    }
},
71:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test luck to see if you wake the creature'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>Creature doesnt wake up'
        showElementByClass(luckyOtherPages)
        testLuck.style.display = 'none'
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>Creature wakes up!'
        showElementByClass(unluckyOtherPages)
        testLuck.style.display = 'none'
    }
},
72:function(){ 
    ingameText.innerHTML = 'You may replace your Leather Armor with this'
    document.getElementById('useLeatherArmor').addEventListener('click',function(){
        ingameText.innerHTML = 'You replace your Leather Armor'
        this.style.display = 'none'
    })
},
74:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test luck to see if you can break his gaze'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>You break his gaze and prepare to attack'
        showElementByClass(luckyOtherPages)
        testLuck.style.display = 'none'
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You are unable to break his gaze..'
        showElementByClass(unluckyOtherPages)
        testLuck.style.display = 'none'
    }
},
75:function(){
    ingameText.innerHTML = 'You may take the jewel and the key and eat provisions<br>You gain 3 luck'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+3,initialLuck.innerHTML)
    hideElementByClass(otherPages)
    useProvisions.style.display = 'block' 
    document.getElementById('useEyeOfTheCyclopsAndKey').onclick = function(){
        ingameText.innerHTML = 'You take the Eye of the Cyclops'
        this.style.display = 'none' //hide item button
        items.addToInventory(items.eyeOfTheCyclops) //add item to inventory array
        items.addToInventory(items.key111) //add item to inventory array
        showElementByClass(otherPages)
    }
},
77:function(){
    useProvisions.style.display = 'block'
    ingameText.innerHTML = 'You may eat provisions if you wish'
},
82:function(){
    hideElementByClass(luckyOtherPages)
    hideElementByClass(unluckyOtherPages)
    testLuck.style.display = 'block'
    ingameText.innerHTML = 'Test luck if you want to take the box'
    lucky = function(){
        ingameText.innerHTML += '<br>Creature does not wake up' 
        hideElementByClass(otherPages)
        showElementByClass(luckyOtherPages)
        testLuck.style.display = 'none'
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>Creature wakes up' 
        hideElementByClass(otherPages)
        showElementByClass(unluckyOtherPages)
        testLuck.style.display = 'none'
    }
},
83:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test luck to see if you make it out of the door'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>You make it out of the north door'
        showElementByClass(luckyOtherPages)
        testLuck.style.display = 'none'
    }
    unlucky = function(){
        showElementByClass(unluckyOtherPages)
        testLuck.style.display = 'none'
    }
},
86:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[7,6]]
    addEnemy()
    fightMechanic.style.display = 'block'
    fight.addEventListener('click',a86)
    function a86(){
        attackRoundCounter++
        if(attackRoundCounter==3){
            ingameText.innerHTML = '3rounds have passed<br>The mysterious visitor is coming closer'
            showElementByClass(luckyOtherPages)
            fightMechanic.style.display = 'none'
            fight.removeEventListener('click',a86)
            useLuck.removeEventListener('click',usingLuck)
            if(enemyList.length==0){ //if win by fight <3turns, hide escape again
                ingameText.innerHTML = ''
                win()
            } else{
                localStorage.setItem('enemyList',JSON.stringify([[enemySkill[0].innerHTML,enemyStamina[0].innerHTML]])) //to check if any damage taken by enemy
            }
        }
    }
    win = function(){ //if win by luck
        showElementByClass(winOtherPages)
        fight.removeEventListener('click',a86)
    }
},
90:function(){
    ingameText.innerHTML = 'You may eat provisions here'
    useProvisions.style.display = 'block'
},
91:function(){
    hideElementByClass(otherPages)
    function a91(){
        ingameText.innerHTML += '<br>You gain '+ rolldiceResult +' gold pieces'
        gold.innerHTML = Number(gold.innerHTML) + rolldiceResult
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a91)
        showElementByClass(luckyOtherPages)
    }
    ingameText.innerHTML = 'Test luck to see if you get caught cheating'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>You get away with cheating, roll dice to see how much gold you win'
        rolldice.style.display = 'block'
        rolldice.addEventListener('click',a91)
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You get caught cheating, prepare to fight'
        showElementByClass(unluckyOtherPages)
    }
},
105:function(){
    ingameText.innerHTML = 'You may choose one of the following items to use'
    hideElementByClass(otherPages)
    if(items.inventoryArray.includes('potionOfInvisibility')){
        document.getElementById('hasPotionOfInvisibilityPage105').style.display = 'block'
    }
    if(items.inventoryArray.includes('eyeOfTheCyclops')){
        document.getElementById('hasEyeOfTheCyclopsPage105').style.display = 'block'
    }
    if(items.inventoryArray.includes('cheese')){
        document.getElementById('hasCheesePage105').style.display = 'block'
    }
    if(items.inventoryArray.includes('theGiverOfSleep')){
        document.getElementById('hasTheGiverOfSleepPage105').style.display = 'block'
    }
    if(items.inventoryArray.includes('yShapedStick')){
        document.getElementById('hasYShapedStickPage105').style.display = 'block'
    }
},
108:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[6,4]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
109:function(){
    ingameText.innerHTML = 'You regain skill, stamina and luck'
    skill.innerHTML = Math.max(skill.innerHTML,initialSkill.innerHTML-1)
    stamina.innerHTML = Math.max(stamina.innerHTML,initialStamina.innerHTML-2)
    luck.innerHTML = Math.min(Number(luck.innerHTML)+4,initialLuck.innerHTML)
    if(pageLog.includes('212')){
        ingameText.innerHTML += '<br>You have already seen the parchment'
        hideElementByClass(winOtherPages)
    }
},
110:function(){
    gold.innerHTML = Number(gold.innerHTML) + 10
    ingameText.innerHTML = 'You gain 10 gold pieces'
},
116:function(){
    hideElementByClass(winOtherPages)
    ingameText.innerHTML = '+1 attack strength bonus added<br>Fight or escape!'
    attackStrengthBonus = Number(attackStrengthBonus) + 1
    enemyList = [[5,4],[5,5]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
        attackStrengthBonus--
    }
},
119:function(){
    hideElementByClass(otherPages)
    function a119(){
        items.removeFromInventory(this)
        Array.prototype.map.call(items.inventoryArray, function(item){
            document.getElementById(item).removeEventListener('click',a119)
        }) 
        showElementByClass(otherPages)
        ingameText.innerHTML = 'You threw the '+this.innerHTML
    }
    if(items.inventoryArray.length==0){
        ingameText.innerHTML = 'You have no equipment, so you throw a gold piece'
        gold.innerHTML--
        showElementByClass(otherPages)
    } else{
        Array.prototype.map.call(items.inventoryArray, function(item){
            document.getElementById(item).addEventListener('click',a119)
        })
        ingameText.innerHTML = 'Click an item to throw away'
    }
},
123:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll die to see if they believe you'
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a123)
    function a123(){
        if(rolldieResult==1 || rolldieResult==2 || rolldieResult==3){
            ingameText.innerHTML += '<br>They believe you<br>You gain 2 luck'
            showElementByClass(winOtherPages)
            luck.innerHTML = Math.min(Number(luck.innerHTML)+2, initialLuck.innerHTML)
        } else if(rolldieResult==5 || rolldieResult==4){
            ingameText.innerHTML += '<br>They are not sure'
            showElementByClass(luckyOtherPages)
        } else if(rolldieResult==6){
            ingameText.innerHTML += '<br>They dont believe you, prepare to fight'
            showElementByClass(unluckyOtherPages)
        }
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a123)
    }   
},
125:function(){
    hideElementByClass(otherPages)
    testLuck.style.display = 'block'
    ingameText.innerHTML = 'Test your luck to escape'
    lucky = function(){
        ingameText.innerHTML += '<br>You managed to escape'
        showElementByClass(otherPages)
        testLuck.style.display = 'none'
    }
    unlucky = function(){
        testLuck.style.display = 'block'
        stamina.innerHTML--
        checkPlayerDeath()
        ingameText.innerHTML += '<br>You lose 1 stamina<br>Test your luck again'
        if(luck.innerHTML==1){ //deducts luck only after unlucky() is run
            ingameText.innerHTML += '<br>You ran out of luck<br>You are dead'
            testLuck.style.display = 'none'    
        }
    }
},
126:function(){
    hideElementByClass(otherPages)
    if(pageLog.includes('296')){ 
        showElementByClass(winOtherPages)
        ingameText.innerHTML = 'You have heard that name before'
    } else{
        showElementByClass(luckyOtherPages)
        ingameText.innerHTML = 'You have not heard that name before<br>Prepare to fight!'
    }
},
127:function(){
    ingameText.innerHTML = 'Pay the 5 gold pieces or attack'
    if(gold.innerHTML<5){
        hideElementByClass(winOtherPages)
        ingameText.innerHTML = 'You dont have enough gold pieces<br>Prepare to fight'
    }
},
130:function(){ 
    let oldManTotal
    let yourTotal
    let didYouWin
    let bet = document.getElementById('bet')
    bet.max = Math.min(gold.innerHTML,20)
    ingameText.innerHTML = 'Roll dice for yourself and the old man if you wish to gamble'
    if(gold.innerHTML<1){ //if no gold from the start
        ingameText.innerHTML = 'You have no gold to gamble'
        rolldice.style.display = 'none'         
    } else{
        rolldice.style.display = 'block'
    }
    rolldice.addEventListener('click',a130)    
    function a130(){
        oldManTotal = rolldiceResult //set old man dice roll first
        rolldiceFunction()
        yourTotal = rolldiceResult // set your dice roll next
        ingameText.innerHTML += '<br>Old man rolled a total of '+oldManTotal
        if(yourTotal>oldManTotal){
            didYouWin = true
            ingameText.innerHTML += '<br>You win '+bet.value+' gold pieces'
            gold.innerHTML = Number(gold.innerHTML) + Number(bet.value)
        } else if(yourTotal<oldManTotal){
            ingameText.innerHTML += '<br>You lose '+bet.value+' gold pieces'
            gold.innerHTML-=bet.value
        }
        bet.max = Math.min(gold.innerHTML,20)
        ingameText.innerHTML += '<br>You can stop whenever you like'
        if(gold.innerHTML<1){ //check if lose all gold
            ingameText.innerHTML = 'You have no gold to gamble'
            rolldice.style.display = 'none'         
        }
    }
    escape = function(){ //using escape class to remove listeners when leaving
        if(didYouWin){
            skill.innerHTML = Math.min(Number(skill.innerHTML)+2,initialSkill.innerHTML)
            stamina.innerHTML = Math.min(Number(stamina.innerHTML)+2,initialStamina.innerHTML)
            luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
        }
        rolldice.removeEventListener('click',a130)
        stamina.innerHTML = Number(stamina.innerHTML)+2 //add back 2stamina
    }
},
131:function(){
    let staminaDifference = initialStamina.innerHTML-stamina.innerHTML
    ingameText.innerHTML = 'Provisions will only recover 2 stamina here'
    useProvisions.style.display = 'block'
    useProvisions.addEventListener('click',a131)
    function a131(){
        if(staminaDifference<=2){
            stamina.innerHTML = initialStamina.innerHTML
        } else if(staminaDifference==3){
            stamina.innerHTML--            
        } else{
            stamina.innerHTML-=2
        }
        useProvisions.removeEventListener('click',a131)
    }
},
132:function(){ 
    ingameText.innerHTML = 'You may take the Wooden Shield'
    document.getElementById('useWoodenShield').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Wooden Shield'
        items.addToInventory(items.woodenShield)
        this.style.display = 'none'
    })
},
135:function(){
    ingameText.innerHTML = 'You may take the gold pieces and eat provisions here<br>You gain 2 luck'
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
    document.getElementById('useGold18').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the 18 gold pieces'
        gold.innerHTML = Number(gold.innerHTML) +18
        this.style.display = 'none'
    })
},
139:function(){ 
    ingameText.innerHTML = 'Click on 3 keys in your inventory to use them<br>If you have no keys or less than 3 keys, your adventure ends here'
    hideElementByClass(otherPages)
    let keyLog = []
    Array.prototype.map.call(items.keys,function(key){
        key.addEventListener('click',a139)  //addeventlistenr to all key class
    })
    items.boatHouseKey.removeEventListener('click',a139)
    items.boatHouseKey.addEventListener('click',function(){
        alert('You can only use numbered Keys')
    })
    
    function a139(){
        if(keyLog.length<3){
            if(keyLog.length==0){
                ingameText.innerHTML = 'You try '
            }
            ingameText.innerHTML += '<br>key ' + this.name
            //use array to store name of all keys clicked
            keyLog.push(Number(this.name))   //name is key number
            //remove listener on click
            this.removeEventListener('click',a139)
            //when keylog.length ==3, return sum of key numbers
            if(keyLog.length==3){
                //assign key total to otherPage button innerhtml and show it
                document.getElementById('page139').innerHTML = keyLog[0]+keyLog[1]+keyLog[2]
                showElementByClass(otherPages)
            }
        }
    }
},
140:function(){
    hideElementByClass(otherPages)
    enemyList = [[7,5]]
    addEnemy()
    ingameText.innerHTML = 'Fight!'
    fightMechanic.style.display = "block"
    win = function(){
        ingameText.innerHTML = 'Fight both together!' //will be hidden when click fight to hide rolldice values 
        enemyList = [[6,5],[6,6]]
        addEnemyFightTogether()
        win = function(){
            ingameText.innerHTML = 'Fight both together!' //will be hidden when click fight to hide rolldice values 
            enemyList = [[5,6],[5,5]]
            addEnemyFightTogether()
            win = function(){
                showElementByClass(otherPages)
            }
        }
    }
},
142:function(){
    hideElementByClass(otherPages)
    enemyList = [[11,18]]
    addEnemy()
    ingameText.innerHTML = 'Fight!'
    fightMechanic.style.display = 'block'
    win = function(){
        ingameText.innerHTML += 'You beat the Warlock!'
        showElementByClass(otherPages)
    }
},
143:function(){ 
    hideElementByClass(otherPages)
    enemyList = [[7,7]]
    addEnemy()
    ingameText.innerHTML = 'Fight!'
    fightMechanic.style.display = 'block'
    fight.addEventListener('click',a143)
    function a143(){
        attackRoundCounter++
        if(attackRoundCounter==3){
            ingameText.innerHTML = 'Fight or escape!'
            showElementByClass(escapeOtherPages)
            fight.removeEventListener('click',a143)
            if(enemyList.length==0){ //if final blow by fight
                ingameText.innerHTML = ''
                win()
            }
        }
    }
    win = function(){ //if final blow by luck 
        hideElementByClass(escapeOtherPages)
        showElementByClass(winOtherPages)
    }
    escape = function(){
        provisions.innerHTML--
    }
},
144:function(){
    ingameText.innerHTML = 'Test luck to see if your stake hits the vampire'
    hideElementByClass(otherPages)
    testLuck.style.display = 'block'
    lucky = function(){
        showElementByClass(luckyOtherPages)
    }
    unlucky = function(){
        showElementByClass(unluckyOtherPages)
    }
},
145:function(){
    ingameText.innerHTML = 'You gain 1 luck<br>You may take the Bronze Key 99'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
    document.getElementById('useBronzeKey99').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the bronze key'
        this.style.display = 'none'
        items.addToInventory(items.bronzeKey99)
    })
},
147:function(){
    ingameText.innerHTML = 'You gain 1 gold and 2 luck'
    gold.innerHTML = Number(gold.innerHTML) + 1
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
152:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[10,12]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
153:function(){
    ingameText.innerHTML = 'You lose 1 stamina<br>You throw away the River Sword'
    stamina.innerHTML--
    items.removeFromInventory(items.riverSword)
    if(skill.innerHTML>initialSkill.innerHTML){ //if exceed initial w sword, no skill loss for removing riversword
        skill.innerHTML = initialSkill.innerHTML
    } else{
        skill.innerHTML--
    }
},
155:function(){
    ingameText.innerHTML = 'You may take the Cresent Shield if you leave an item behind'
    document.getElementById('useCresentShield').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.cresentShield) //add item to inventory array
        hideElementByClass(otherPages) //hide otherPage button until item replaced
        ingameText.innerHTML = 'You take the shield<br>Now click on an item in your inventory to replace it' //show instruction to player
        Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
            document.getElementById(itemString).addEventListener('click', replace)
        })
    }
},
156:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll dice to see if the door gives way'
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a156)
    function a156(){
        if(rolldiceResult>skill.innerHTML){
            ingameText.innerHTML += '<br>The door doesnt budge'
            showElementByClass(unluckyOtherPages)
        } else{
            ingameText.innerHTML += '<br>The door opens'
            showElementByClass(luckyOtherPages)
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a156)
    }
},
158:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[5,5]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
159:function(){
    ingameText.innerHTML = 'Test your luck if you wish to exit the room<br>Or else, prepare to fight!'
    hideElementByClass(luckyOtherPages)
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>You manage to leave without being noticed'
        showElementByClass(luckyOtherPages)
        hideElementByClass(unluckyOtherPages)
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You are spotted, prepare to fight'
    }
},
161:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll die to see what you attracted'
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',randomEnemy)
    function randomEnemy(e){
        if(rolldieResult==1){
            enemyList = [[5,3]]  
            addEnemy()      
        } else if(rolldieResult==2){
            enemyList = [[6,3]]  
            addEnemy()      
        } else if(rolldieResult==3){
            enemyList = [[6,4]]  
            addEnemy()
        } else if(rolldieResult==4){
            enemyList = [[5,4]]  
            addEnemy()      
        } else if(rolldieResult==5){
            enemyList = [[6,5]]  
            addEnemy()      
        } else {
            enemyList = [[8,4]]  
            addEnemy()      
        }
        fightMechanic.style.display = 'block'
        rolldie.removeEventListener('click',randomEnemy)
        rolldie.style.display = 'none'
    }
    win = function(){
        showElementByClass(winOtherPages)
        let page161 = document.createElement('button')
        page161.innerHTML = pageLog[pageLog.length-2]
        page161.addEventListener('click',changePage)
        page161.addEventListener('click', function(e){
            page161.parentNode.removeChild(page161)
        })
        document.getElementById('161').appendChild(page161)
    }
},
163:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test your luck to see if youre hit by the pig'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>The pig misses you<br>Now fight the giant'
        a163()
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>The pig hits you<br>You lose 1 stamina<br>Now fight the giant'
        stamina.innerHTML--
        checkPlayerDeath()
        a163()
    }
    function a163(){
        enemyList = [[8,9]]
        addEnemy()
        fightMechanic.style.display = 'block'
        fight.addEventListener('click',b163)
    }
    function b163(){
        attackRoundCounter++
        if(attackRoundCounter==3){
            ingameText.innerHTML = 'Fight or escape!'
            showElementByClass(escapeOtherPages)
            fight.removeEventListener('click',b163)
            if(enemyList.length==0){ //if final blow by fight <3turns, must hide escape
                hideElementByClass(escapeOtherPages)
            }
        }
    }
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
166:function(){
    ingameText.innerHTML = 'Roll die to see if you make it safely across'
    hideElementByClass(otherPages)
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a166)
    function a166(){
        if(rolldieResult==5 || rolldieResult==6){
            showElementByClass(luckyOtherPages)
        } else{
            ingameText.innerHTML += '<br>You make it safely across'
            showElementByClass(winOtherPages)
        }
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a166)
    }
},
170:function(){ 
    ingameText.innerHTML = 'You take the crucifix'
    items.addToInventory(items.crucifix)
},
173:function(){
    hideElementByClass(otherPages)
    showElementByClass(escapeOtherPages)
    escape = function(){
        fight.removeEventListener('click',a173)
    }
    enemyList = [[9,6]]  
    addEnemy()     
    fightMechanic.style.display = "block"
    fight.addEventListener('click',a173)
    function a173(){
        if(enemyAttackStrength> attackStrength){
            hitsReceivedCounter++
        }
        if(hitsReceivedCounter%3==0 && hitsReceivedCounter>0){
            testLuck.style.display = 'none'
            hideElementByClass(otherPages)
            showElementByClass(unluckyOtherPages)
            fightMechanic.style.display = 'none'
            fight.removeEventListener('click',a173)
            ingameText.innerHTML = 'Enemy has hit you thrice'
            localStorage.setItem('enemyList',JSON.stringify([[enemySkill[0].innerHTML,enemyStamina[0].innerHTML]]))
        }
    }
    if(items.inventoryArray.includes('theGiverOfSleep')){ //has giver of sleep only
        ingameText.innerHTML = 'Test luck to use The Giver of Sleep or escape'
        fightMechanic.style.display = 'none'
        testLuck.style.display = 'block'
        if(items.inventoryArray.includes('silverChisel')){ //has both items
            ingameText.innerHTML = 'Test luck to use The Giver of Sleep <br>Else, fight or escape'
            fightMechanic.style.display = 'block'
        }
    } else{ //has silver chisel only
        ingameText.innerHTML = 'Fight with the silver chisel or escape'
    }
    win = function(){
        ingameText.innerHTML += '<br>The enemy is dead'
        hideElementByClass(escapeOtherPages)
        showElementByClass(winOtherPages)
        fightMechanic.style.display = 'none'
        testLuck.style.display = 'none'
        fight.removeEventListener('click',a173)
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You missed<br>You have to escape'
        if(items.inventoryArray.includes('silverChisel')){
            ingameText.innerHTML += ' or fight'  
            fightMechanic.style.display = 'block'  
        }
        items.removeFromInventory(items.theGiverOfSleep) // giver of sleep used
    }
    lucky = function(){ 
        ingameText.innerHTML += '<br>You shot the enemy'
        win()
        items.removeFromInventory(items.theGiverOfSleep) // giver of sleep used
    }
},
179:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[9,9]]
    addEnemy()
    fightMechanic.style.display = 'block'
    fight.addEventListener('click',a179)
    function a179(){
        attackRoundCounter++
        if(attackRoundCounter==3){
            ingameText.innerHTML = 'Fight or escape!'
            showElementByClass(escapeOtherPages)
            fight.removeEventListener('click',a179)
            if(enemyList.length==0){ //if final blow by fight in <3turns, hide escape again
                hideElementByClass(escapeOtherPages)
            }
        }
    }
    win = function(){ //if final blow by luck
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
        pageEventFunctions[179] = function(){ //change page function if defeated enemy here before
            ingameText.innerHTML = 'You have been here before'
            hideElementByClass(otherPages)
            showElementByClass(escapeOtherPages)
            escape = function(){ // second time leaving
                stamina.innerHTML = Number(stamina.innerHTML) +2 //add back lost stamina
            }
        }
    }
},
181:function(){
    ingameText.innerHTML = 'You lose 1 skill'
    skill.innerHTML--
},
182:function(){ 
    ingameText.innerHTML = 'You lose 2 stamina<br>Two of the keys fit<br>Try another combinations of keys'
    stamina.innerHTML-=2
},
183:function(){
    ingameText.innerHTML = 'You gain 1 skill and 5 stamina'
    skill.innerHTML = Math.min(Number(skill.innerHTML)+1,initialSkill.innerHTML)
    stamina.innerHTML = Math.min(Number(stamina.innerHTML)+5,initialStamina.innerHTML)
},
185:function(){
    ingameText.innerHTML = 'You gain 2 luck'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
188:function(){
    hideElementByClass(winOtherPages)
    ingameText.innerHTML = 'Fight or escape!'
    enemyList = [[8,5]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
195:function(){
    ingameText.innerHTML = 'Roll die to see if they believe you'
    hideElementByClass(otherPages)
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a195)
    function a195(){
        if(rolldieResult==1 || rolldieResult==2){
            ingameText.innerHTML += '<br>They dont believe you<br>Prepare to fight'
            showElementByClass(unluckyOtherPages)
        } else if(rolldieResult==3 || rolldieResult==4){
            ingameText.innerHTML += '<br>They are not sure'
            showElementByClass(luckyOtherPages)
        } else if(rolldieResult==5 || rolldieResult==6){
            ingameText.innerHTML += '<br>They believe you<br>You gain 2 luck'
            showElementByClass(winOtherPages)
            luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
        }
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a195)
    }
},
196:function(){
    ingameText.innerHTML = 'You gain 5 gold pieces'
    gold.innerHTML = Number(gold.innerHTML) + 5
},
198:function(){ 
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'One of the keys fit<br>Test your luck to see if the dart strikes you'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>One of the keys fit<br>The darts miss you<br>But you lose 2 stamina<br>Try another combinations of keys'
        stamina.innerHTML-=2
        showElementByClass(otherPages)
        checkPlayerDeath()
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>The darts hit you, you are dead'
    }
},
199:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[7,6],[6,4]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
201:function(){
    useProvisions.style.display = 'block'
    ingameText.innerHTML = 'You may take the items and use provisions'
    document.getElementById('useGold25').addEventListener('click',function(){
        ingameText.innerHTML = 'You gain 25 gold pieces'
        gold.innerHTML= Number(gold.innerHTML) + 25
        this.style.display = 'none'
    })
    document.getElementById('usePotionOfInvisibility').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Potion of Invisibility'
        items.addToInventory(items.potionOfInvisibility)
        this.style.display = 'none'
    })
    document.getElementById('useGlove').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Glove'
        items.addToInventory(items.glove)
        this.style.display = 'none'
    })
    
},
202:function(){
    items.addToInventory(items.bronzeHelmet)
    ingameText.innerHTML = 'You lose 1 skill<br>You have to take the Bronze Helmet'
    skill.innerHTML--
},
203:function(){
    useProvisions.style.display = 'block'
    ingameText.innerHTML = 'You gain 1 luck<br>You may take the keys and eat provisions'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
    document.getElementById('useBoatHouseKey').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Boat House Key'
        items.addToInventory(items.boatHouseKey)
        this.style.display = 'none'
    })  
},
204:function(){
    ingameText.innerHTML = 'You may choose to gamble if you have at least a gold piece'
    if(gold.innerHTML<1){
        ingameText.innerHTML = 'You dont have any gold pieces'
        hideElementByClass(winOtherPages)
    }
},
206:function(){
    hideElementByClass(otherPages)
    if(pageLog.includes('206')){
        ingameText.innerHTML = 'You have been here before'
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You have never been here before'
        showElementByClass(luckyOtherPages)
    }
},
209:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll a die to see if you are safe'
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a209)
    function a209(){
        if(rolldieResult==6){
            ingameText.innerHTML += '<br>You fall into the river'
            showElementByClass(winOtherPages)
        } else {
            ingameText.innerHTML += '<br>You manage to regain your footing'
            showElementByClass(luckyOtherPages)
        }
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a209)
    }
},
211:function(){
    ingameText.innerHTML = 'You chose the '+ chosenWeapon.innerHTML
    if(chosenWeapon==items.silverChisel || chosenWeapon==items.theGiverOfSleep){ //if silver weapon chosen
        ingameText.innerHTML += '<br>Turn to 173 to continue the fight or escape'
        showElementByClass(otherPages)      
    } else{
        hideElementByClass(otherPages)
        enemyList = [[9,6]]
        addEnemy()
        fightMechanic.style.display = 'block'
        fight.addEventListener('click',a211)
        function a211(){
            ingameText.innerHTML = 'You have to escape as you have no silver weapons'
            showElementByClass(escapeOtherPages)
            if(items.inventoryArray.includes('silverChisel')){ //only have silver chisel
                ingameText.innerHTML = 'Fight with silver chisel or escape'
                showElementByClass(winOtherPages)
                if(items.inventoryArray.includes('theGiverOfSleep')){ //have both items
                    ingameText.innerHTML = 'Fight with silver chisel or The Giver of Sleep or escape'        
                }
            } else if(items.inventoryArray.includes('theGiverOfSleep')){ //only have giver of sleep
                ingameText.innerHTML = 'Fight with The Giver of Sleep or escape' 
                showElementByClass(winOtherPages)
            }
            fightMechanic.style.display = 'none'
            fight.removeEventListener('click',a211)
        }
    }
},
212:function(){
    ingameText.innerHTML = 'You put the map parchment in your inventory<br>Click the parchment when you want to read it'
    items.addToInventory(items.mapParchment)
    if(pageLog.includes('369')){
        ingameText.innerHTML += '<br>You have tried the liquid before'
        hideElementByClass(winOtherPages)
    }
},
213:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll dice to see if the door opens'
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a213)
    function a213(){
        if(rolldiceResult>skill.innerHTML){
            ingameText.innerHTML += '<br>Door remains locked<br>You lose 1 stamina'
            stamina.innerHTML--
            showElementByClass(unluckyOtherPages)
            checkPlayerDeath()
        }else{
            ingameText.innerHTML += '<br>Door bursts open'
            showElementByClass(luckyOtherPages)
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a213)
    }
},
216:function(){
    useProvisions.style.display = 'block'
    ingameText.innerHTML = 'You may eat provisions here<br>You gain 4 stamina and your skill and luck is restored to initial levels'
    stamina.innerHTML = Math.min(Number(stamina.innerHTML)+4,initialStamina.innerHTML)
    skill.innerHTML = initialSkill.innerHTML
    luck.innerHTML = initialLuck.innerHTML
},
218:function(){
    if(pageLog[pageLog.length-1]=='151'){
        ingameText.innerHTML = 'You lose 1 stamina from exhaustion'
        stamina.innerHTML--
    }
},
221:function(){ 
    ingameText.innerHTML = 'You took'
    hideElementByClass(otherPages)
    for(let i=0;i<chosenItems.length;i++){ 
        Array.prototype.map.call(document.getElementsByClassName('page313ChosenItems'),function(item){
            if(item.id==chosenItems[i]){ //use chosenItems to check what you have taken
                ingameText.innerHTML += '<br>' +item.id
                item.style.display = 'block' //only show items that are in chosenItems array
            }
            item.addEventListener('click',function(){ //remove from chosenItem arrary after click
                for(let i=0;i<chosenItems.length;i++){
                    if(this.id==chosenItems[i]){
                        chosenItems.splice(i,1)
                    }
                }
            })
        })
    }
},
227:function(){
    hideElementByClass(winOtherPages)
    if(pageLog.includes('227')){
        ingameText.innerHTML = 'You have been here before'
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    }
},  
230:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[8,7]]
    addEnemy()
    fightMechanic.style.display = 'block'
    fight.addEventListener('click',a230)
    function a230(){
        if(attackStrength<enemyAttackStrength){
            hitsReceivedCounter++
        }
        if(hitsReceivedCounter==4){
            ingameText.innerHTML = 'Enemy hits you 4 times'
            showElementByClass(luckyOtherPages)  
            fightMechanic.style.display = 'none'      
            fight.removeEventListener('click',a230)
        }
        if(stamina.innerHTML<1){
            showElementByClass(luckyOtherPages)
        }
    }
    win = function(){
        showElementByClass(winOtherPages)
        fight.removeEventListener('click',a230)
    }
},
234:function(){
    if(pageLog[pageLog.length-1]=='161'){
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You attracted attention'
        hideElementByClass(winOtherPages)
    }
},
236:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[6,5],[6,6],[5,5]]
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
239:function(){ 
    ingameText.innerHTML = 'You gain 1 luck'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
},
240:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[5,2]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
241:function(){
    ingameText.innerHTML = 'You lose 1 skill'
    skill.innerHTML--
},
243:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll die to see which hand you used to pull the lever'
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a243)
    function a243(){
        if(rolldieResult%2==1){
            ingameText.innerHTML += '<br>You used your sword hand<br>You lose 3 skill and 1 stamina'
            skill.innerHTML -=3
            stamina.innerHTML--
        }else{
            ingameText.innerHTML += '<br>You used your non sword hand<br>You lose 1 skill and 2 stamina'
            skill.innerHTML -=1
            stamina.innerHTML-=2
        }
        showElementByClass(otherPages)
        checkPlayerDeath()
        rolldie.removeEventListener('click',a243)
        rolldie.style.display = 'none'
    }
},
247:function(){
    ingameText.innerHTML = 'You lose 2 stamina'
    stamina.innerHTML-=2
},
248:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[6,5]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
249:function(){
    //settings for additional luck button for fiery breath
    let useLuckPage249 = document.createElement('button') //additonal use luck button for fiery breath
    useLuckPage249.innerHTML = 'Use luck'
    useLuckPage249.style.display = 'none'
    fightMechanic.insertBefore(useLuckPage249,cresentShieldDisplay)  //place additional use luck button
    lucky = function(){
        ingameText.innerHTML += '<br>You lose 1 less stamina' 
        stamina.innerHTML = Math.min(Number(stamina.innerHTML)+1,initialStamina.innerHTML)
        useLuckPage249.style.display = 'none'
        useLuckPage249.removeEventListener('click',testLuckFunction) //remove listener after use       
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You lose 1 extra stamina'
        stamina.innerHTML--
        checkPlayerDeath()
        useLuckPage249.style.display = 'none'
        useLuckPage249.removeEventListener('click',testLuckFunction) //remove listener after use
    }
    
    hideElementByClass(winOtherPages)
    ingameText.innerHTML = 'Fight or escape!'
    enemyList = [[7,6]]
    addEnemy()
    fightMechanic.style.display = 'block'
    fight.addEventListener('click',a249)
    function a249(){
        ingameText.innerHTML = 'Roll die to see if youre hit by the fiery breath'
        fightMechanic.style.display = 'none'
        rolldie.style.display = 'block'
        rolldie.addEventListener('click',b249)
        useLuckPage249.style.display = 'block'
        useLuckPage249.removeEventListener('click',testLuckFunction)
    }
    function b249(){
        fightMechanic.style.display = 'block'
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',b249)
        if(rolldieResult==1 || rolldieResult==2){
            ingameText.innerHTML += '<br>Youre hit by the fiery breath<br>You lose 1 stamina'
            stamina.innerHTML--
            checkPlayerDeath()
            if(stamina.innerHTML>0){ //if still alive then can use luck for fire
                useLuckPage249.style.display = 'block'
                useLuckPage249.addEventListener('click',testLuckFunction)
            }
        } else{
            ingameText.innerHTML += '<br>You avoid the blast'
        }
    }
    win = function(){
        ingameText.innerHTML = 'You gain 1 luck<br>You may stay or escape'
        luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
        showElementByClass(winOtherPages)
        useLuckPage249.style.display = 'none'
        rolldie.removeEventListener('click',b249)
        fight.removeEventListener('click',a249)
    }
},
251:function(){
    ingameText.innerHTML = 'Fight or escape!'
    hideElementByClass(winOtherPages)
    enemyList = [[6,6]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
258:function(){
    ingameText.innerHTML = 'You may eat provisions here<br>You can take the gold and the Key<br>You gain 2 luck'
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
    document.getElementById('useGold8').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the 8 gold pieces'
        this.style.display = 'none'
        gold.innerHTML = Number(gold.innerHTML) + 8
    })
    document.getElementById('useSecondKey111').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Key 111'
        this.style.display = 'none'
        items.addToInventory(items.secondKey111)
    })
},
259:function(){
    ingameText.innerHTML = 'You gain 1 skill and 2 luck'
    skill.innerHTML = Math.min(Number(skill.innerHTML)+1,initialSkill.innerHTML)
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
263:function(){
    ingameText.innerHTML = 'You gain 1 luck'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
},
264:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'You lose 1 skill'
    skill.innerHTML--
    if(items.inventoryArray.includes('boatHouseKey')){
        ingameText.innerHTML += '<br>You use the Boat House Key'
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML += '<br>You dont have the Boat House Key'  
        showElementByClass(unluckyOtherPages)
    }
},
266:function(){
    ingameText.innerHTML = 'You gain 1 luck<br>You can eat provisions here<br>You can take The Giver of Sleep and the silver arrow'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
    useProvisions.style.display = 'block'
    items.addToInventory(items.theGiverOfSleep)
},
272:function(){
    ingameText.innerHTML = 'You pay the '
    if(pageLog[pageLog.length-1]=='127'){
        gold.innerHTML-=5
        ingameText.innerHTML += '5 gold pieces'
    }
    if(pageLog[pageLog.length-1]=='3'){
        gold.innerHTML-=3
        ingameText.innerHTML += '3 gold pieces'
    }
},
273:function(){
    ingameText.innerHTML = 'You can take the Mallet and Stumps of wood'
    document.getElementById('useWoodStumps').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Mallet and Stumps of wood'
        this.style.display = 'none'
        items.addToInventory(items.woodMallet)
        items.addToInventory(items.woodStumps)
    })
},
275:function(){
    hideElementByClass(otherPages)
    testLuck.style.display = 'block'
    ingameText.innerHTML = 'Test luck to see if the creature hits you'
    lucky = function(){
        ingameText.innerHTML += '<br>The creature misses'
        showElementByClass(otherPages)
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>The creature catches your leg<br>You lose 1 stamina'
        stamina.innerHTML--
        showElementByClass(otherPages)   
        checkPlayerDeath()     
    }
},
279:function(){
    hideElementByClass(otherPages)
    if(items.inventoryArray.includes('crucifix')){
        ingameText.innerHTML = 'You can use your Crucifix to run away'
        showElementByClass(unluckyOtherPages)
        if(items.inventoryArray.includes('woodStumps')){
            ingameText.innerHTML += '<br>Or you can use your Stumps of wood to try and kill the vampire'
            showElementByClass(winOtherPages)
        }
    } 
    else if(items.inventoryArray.includes('woodStumps')){
        ingameText.innerHTML = 'You can use your Stumps of wood to try and kill the vampire'
        showElementByClass(winOtherPages)
    } else {
        ingameText.innerHTML = 'You can only draw your sword and fight'
        showElementByClass(luckyOtherPages)
    }
},
282:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[7,6]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        ingameText.innerHTML = 'You gain 2 luck'
        luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
        enemyList = [[6,6],[6,6],[6,5]]
        addEnemy()
        win = function(){
            showElementByClass(otherPages)
        }
    }
},
287:function(){
    hideElementByClass(otherPages)
    if(items.inventoryArray.includes('cheese')){
        ingameText.innerHTML = 'You use the cheese'
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You dont have any cheese'
        showElementByClass(luckyOtherPages)    
    }
},
289:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[7,12]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        ingameText.innerHTML += 'You beat the Warlock!'
        showElementByClass(otherPages)
    }
},
292:function(){
    hideElementByClass(otherPages)
    if(items.inventoryArray.includes('blueCandle')){
        ingameText.innerHTML = 'You use your Blue Candle'
        showElementByClass(winOtherPages)
    }else{
        ingameText.innerHTML = 'You dont have a Blue Candle'
        showElementByClass(luckyOtherPages)
    }
},
294:function(){
    ingameText.innerHTML = 'You gain 5 gold pieces and 1 luck'
    gold.innerHTML = Number(gold.innerHTML) + 5
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
},
295:function(){
    if(pageLog[pageLog.length-1]=='161'){
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You attracted attention'
        hideElementByClass(winOtherPages)
    }
},
298:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll die to see if you fall off the bridge'
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a298)
    function a298(){
        if(rolldieResult==6){
            ingameText.innerHTML += '<br>You slip and fall into the water'
            showElementByClass(winOtherPages)
        } else{
            ingameText.innerHTML += '<br>You manage to cross the bridge'
            showElementByClass(luckyOtherPages)
        }
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a298)
    }
},
304:function(){
    hideElementByClass(winOtherPages)
    ingameText.innerHTML = 'Fight or escape!'
    enemyList = [[8,8]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
305:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test your luck 3 times to see if you step on a hand tile'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>Test your luck 2 more times'
        testLuck.style.display = 'block'
        lucky = function(){
            ingameText.innerHTML += '<br>Test your luck 1 more time'
            testLuck.style.display = 'block'
            lucky = function(){
                ingameText.innerHTML += '<br>You did not step on any hand tiles'
                showElementByClass(luckyOtherPages)
            }
        }    
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You stepped on a hand tile'
        showElementByClass(unluckyOtherPages)
    }
},
306:function(){
    if(pageLog[pageLog.length-1]=='161'){
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    } else{
        ingameText.innerHTML = 'You attracted attention'
        hideElementByClass(winOtherPages)
    }
},
309:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[5,4],[6,3],[5,5]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
310:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Click a weapon in your inventory to use it to fight <br> Or click the same item if you dont wish to change weapon'
    Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
        document.getElementById(itemString).addEventListener('click', chooseWeapon)
    })
    function chooseWeapon(){
        chosenWeapon = this
        Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
            document.getElementById(itemString).removeEventListener('click', chooseWeapon)
        })
        showElementByClass(otherPages)
    }
},
313:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'You gain 1 luck and 1 skill<br>You can take any 2 of the items'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
    skill.innerHTML = Math.min(Number(skill.innerHTML)+1,initialSkill.innerHTML)
    Array.prototype.map.call(document.getElementsByClassName('page313Items'),function(item){
        item.addEventListener('click',function(){
            chosenItems.push(this.name) //create array to store chosen items
            this.style.display = 'none'
            if(chosenItems.length==2){ //hide all other objects when 2 is chosen
                ingameText.innerHTML = 'You have taken 2 items already'
                hideElementByClass(document.getElementsByClassName('page313Items'))
                showElementByClass(otherPages)
            }
        })
    })
},
316:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll dice to see if you can swim across the river'
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a316)
    function a316(){
        if(rolldiceResult>stamina.innerHTML){
            ingameText.innerHTML += '<br>You decide not to swim across'
            showElementByClass(luckyOtherPages)
        } else{
            ingameText.innerHTML += '<br>You swim furiously across the river'
            showElementByClass(winOtherPages)
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a316)
    }
},
317:function(){
    ingameText.innerHTML = 'You can take the Cheese'
    document.getElementById('useCheese').addEventListener('click',function(){
        ingameText.innerHTML = 'You take the Cheese'
        this.style.display = 'none'
        items.addToInventory(items.cheese)
    })
},
319:function(){ 
    ingameText.innerHTML = 'You have 1 more item to check'
    hideElementByClass(winOtherPages)
    if(chosenItems.length==0){
        ingameText.innerHTML = 'You have checked both items'
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    }
},
322:function(){
    ingameText.innerHTML = 'You may take the Copper Key 66 if you leave an item behind'
    document.getElementById('useCopperKey66').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.copperKey66) //add item to inventory array
        hideElementByClass(otherPages) //hide otherPage button until item replaced
        ingameText.innerHTML = 'You take the Key<br>Now click on an item in your inventory to replace it' //show instruction to player
        Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
            document.getElementById(itemString).addEventListener('click', replace)
        })
    }
},
325:function(){
    ingameText.innerHTML = 'You take the Iron Helmet with you'
    items.addToInventory(items.ironHelmet)
    attackStrengthBonus++
},
327:function(){
    ingameText.innerHTML = 'You may take the 30 gold pieces, Book and Y-shaped Stick if you leave an item behind<br>You can eat provisions here<br>You gain 3 luck'
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+3,initialLuck.innerHTML)
    document.getElementById('useGold30BookYShapedStick').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.yShapedStick) //add item to inventory array
        items.addToInventory(items.book)
        gold.innerHTML = Number(gold.innerHTML) + 30
        hideElementByClass(otherPages) //hide otherPage button until item replaced
        ingameText.innerHTML = 'You take the 30 gold pieces, Book and Y-shaped Stick<br>Now click on an item in your inventory to replace it' //show instruction to player
        Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
            document.getElementById(itemString).addEventListener('click', replace)
        })
    }
},
328:function(){
    ingameText.innerHTML = 'You may take the Y-shaped Stick if you leave an item behind'
    document.getElementById('useYShapedStick').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.yShapedStick) //add item to inventory array
        hideElementByClass(otherPages) //hide otherPage button until item replaced
        ingameText.innerHTML = 'You take the Y-shaped Stick<br>Now click on an item in your inventory to replace it' //show instruction to player
        Array.prototype.map.call(items.inventoryArray,function(itemString){ //add listeneer to all inventory items
            document.getElementById(itemString).addEventListener('click', replace)
        })
    }
},
330:function(){
    ingameText.innerHTML = 'You gain 6 stamina and 1 luck'
    stamina.innerHTML = Math.min(Number(stamina.innerHTML)+6,initialStamina.innerHTML)
    luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
},
331:function(){
    ingameText.innerHTML = 'Fight!'
    hideElementByClass(otherPages)
    enemyList = [[8,8]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
333:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[10,10]]
    addEnemy()
    fightMechanic.style.display = 'block'
    fight.addEventListener('click',a333)
    function a333(){
        attackRoundCounter++
        if(attackRoundCounter%6==0 && attackRoundCounter>0){
            ingameText.innerHTML = 'Test your luck if you want to escape'
            testLuck.style.display = 'block'
            testLuck.addEventListener('click',b333)
        }
    }
    function b333(){
        if(testLuckRoll>10 && testLuckRoll>luck.innerHTML){
            testLuck.removeEventListener('click',b333)
            fight.removeEventListener('click',a333)
            fightMechanic.style.display = 'none'
            showElementByClass(unluckyOtherPages)
        }
    }
    win = function(){
        testLuck.removeEventListener('click',b333)
        fight.removeEventListener('click',a333)
        showElementByClass(winOtherPages)
    }
    lucky = function(){
        testLuck.removeEventListener('click',b333)
        fight.removeEventListener('click',a333)
        showElementByClass(escapeOtherPages)
    }
    unlucky = function(){
        testLuck.style.display = 'none'
        ingameText.innerHTML += '<br>You have to fight another 6 rounds before trying to escape again'
        attackRoundCounter = 0
    }
},
334:function(){
    ingameText.innerHTML = 'You may buy a Blue Candle for 20 gold pieces'
    if(gold.innerHTML<20){
        ingameText.innerHTML = 'You dont have enough gold pieces to buy the Blue Candle'
        document.getElementById('useBlueCandle').style.display = 'none'
    }
    document.getElementById('useBlueCandle').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.blueCandle) //add item to inventory array
        ingameText.innerHTML = 'You pay 20 gold pieces and take the Blue Candle' //show instruction to player
        gold.innerHTML-=20
    }
},
338:function(){
    hideElementByClass(winOtherPages)
    ingameText.innerHTML = 'Fight or escape!'
    enemyList = [[10,10]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        hideElementByClass(otherPages)
        showElementByClass(winOtherPages)
    }
},
339:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll die to see how much stamina you lost'
    rolldie.style.display = 'block'
    rolldie.addEventListener('click',a339)
    function a339(){
        stamina.innerHTML-=rolldieResult
        ingameText.innerHTML += '<br>You lose '+ rolldieResult+' stamina'
        showElementByClass(otherPages)
        checkPlayerDeath()
        rolldie.style.display = 'none'
        rolldie.removeEventListener('click',a339)
    }
},
340:function(){
    ingameText.innerHTML = 'You may choose one of the following items to use' 
    hideElementByClass(otherPages)
    if(items.inventoryArray.includes('sword') || items.inventoryArray.includes('riverSword') || items.inventoryArray.includes('enchantedSword')){
        document.getElementById('hasSwordOrEnchantedSwordPage340').style.display = 'block'
    }
    if(items.inventoryArray.includes('eyeOfTheCyclops')){
        document.getElementById('hasEyeOfTheCyclopsPage340').style.display = 'block'
    }
    if(items.inventoryArray.includes('woodStumps')){
        document.getElementById('hasWoodStumpsPage340').style.display = 'block'
    }
    if(items.inventoryArray.includes('cheese')){
        document.getElementById('hasCheesePage340').style.display = 'block'
    }
},
342:function(){
    ingameText.innerHTML = 'You gain 2 gold pieces<br>You gain 2 luck'
    gold.innerHTML = Number(gold.innerHTML) + 2
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
343:function(){
    ingameText.innerHTML = 'You lose 1 stamina'
    stamina.innerHTML--
},
344:function(){
    ingameText.innerHTML = 'You take the River Sword<br>You gain 1 skill'
    items.addToInventory(items.riverSword)
    skill.innerHTML = Number(skill.innerHTML)+1 
},
346:function(){
    let goldLost = 0 //external variable variable to count gold lost
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Roll dice to see if you win<br>You may use your luck to help you'
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a346)
    function a346(){
        if(rolldiceResult%2==0){
            goldLost = Math.min(Number(gold.innerHTML),rolldiceResult)
            ingameText.innerHTML += '<br>You lose '+goldLost+ ' gold pieces'
            gold.innerHTML-=goldLost
        } else{
            ingameText.innerHTML += '<br>You win '+rolldiceResult+' gold pieces<br>You gain 2 luck' 
            gold.innerHTML = Number(gold.innerHTML) + rolldiceResult
            luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a346)
        testLuck.style.display = 'none'
        testLuck.removeEventListener('click',b346)
        showElementByClass(otherPages)
    }
    testLuck.style.display = 'block'
    testLuck.addEventListener('click',b346)
    function b346(){
        rolldice.removeEventListener('click',a346)
        testLuck.style.display = 'none'
        testLuck.removeEventListener('click',b346)
    }
    lucky = function(){
        ingameText.innerHTML += '<br>Roll dice to see how much gold you win' 
        rolldice.addEventListener('click',c346)
        function c346(){
            rolldice.style.display = 'none'
            rolldice.removeEventListener('click',c346)    
            ingameText.innerHTML += '<br>You win '+ rolldiceResult +' gold pieces<br>You gain 2 luck'
            gold.innerHTML = Number(gold.innerHTML) + rolldiceResult
            luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
            showElementByClass(otherPages)
        }
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>Roll dice to see how much gold you lose' 
        rolldice.addEventListener('click',d346)
        function d346(){
            rolldice.style.display = 'none'
            rolldice.removeEventListener('click',d346)    
            goldLost = Math.min(Number(gold.innerHTML),rolldiceResult)
            ingameText.innerHTML += '<br>You lose '+goldLost+ ' gold pieces'
            gold.innerHTML-=goldLost
            showElementByClass(otherPages)
        }
    }
},
348:function(){
    ingameText.innerHTML = 'You have to fight'
    hideElementByClass(winOtherPages)
    if(items.inventoryArray.includes('potionOfInvisibility')){
        ingameText.innerHTML = 'You can use your Potion of Invisibility or fight!'
        showElementByClass(winOtherPages)
    }
},
350:function(){
    hideElementByClass(otherPages)
    enemyList = JSON.parse(localStorage.getItem('enemyList')) //to check if any damage taken by enemy
    if(enemyList[0][1]=='6'){ // enemy was not hit at all
        rolldie.style.display = 'block'
        rolldie.addEventListener('click',a350)
        ingameText.innerHTML = 'Roll die to determine who the piranhas attack'
    } else{ // enemy was hit
        ingameText.innerHTML = 'Most of the piranhas attack the crocodile'
        enemyList = [[5,1]]
        addEnemy()
        fightMechanic.style.display = 'block'
    }
    function a350(){
        if(rolldieResult==1 || rolldieResult==2){
            ingameText.innerHTML += '<br>Most of the piranhas attack you!'
            enemyList = [[5,5]]
        } else{
            ingameText.innerHTML += '<br>Just a few of the piranhas attack you'
            enemyList = [[5,1]]  
        }
        addEnemy()
        fightMechanic.style.display = 'block'
        rolldie.removeEventListener('click',a350)
        rolldie.style.display = 'none'
    }
    win = function(){
        ingameText.innerHTML += '<br>You gain 1 luck<br>You can use provisons now'
        showElementByClass(otherPages)
        luck.innerHTML = Math.min(Number(luck.innerHTML)+1,initialLuck.innerHTML)
        useProvisions.style.display = 'block'
    }
},
352:function(){
    ingameText.innerHTML = 'You lose 1 stamina'
    stamina.innerHTML--
},
355:function(){
    ingameText.innerHTML = 'You lose 1 skill'
    skill.innerHTML--
},
361:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'You take the Golden Key 125<br>Roll dice to see if you make it to the door while holding your breath'
    items.addToInventory(items.goldenKey125)
    rolldice.style.display = 'block'
    rolldice.addEventListener('click',a361)
    function a361(){
        if(rolldiceResult>skill.innerHTML){
            ingameText.innerHTML += '<br>You breathe the gas<br>You lose 2 skill and 3 stamina'
            skill.innerHTML-=2
            stamina.innerHTML-=3
            checkPlayerDeath()
        } else{
            ingameText.innerHTML += '<br>You make it to the door'
        }
        rolldice.style.display = 'none'
        rolldice.removeEventListener('click',a361)
        showElementByClass(otherPages)
    }
},
365:function(){
    hideElementByClass(winOtherPages)
    ingameText.innerHTML = 'Fight or escape!'
    enemyList = [[6,4],[5,3],[6,4],[5,2],[4,4]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(winOtherPages)
        hideElementByClass(escapeOtherPages)
    }
},
368:function(){
    ingameText.innerHTML = 'You lose 2 stamina'
    stamina.innerHTML-=3
},
371:function(){
    ingameText.innerHTML = 'You may eat provisions here<br>You again 3 luck'
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+3,initialLuck.innerHTML)
},
372:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[7,6],[5,3]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
374:function(){
    ingameText.innerHTML = 'You gain 2 luck<br>You may eat provisions here'
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
376:function(){
    ingameText.innerHTML = 'You may take the Copper Pieces<br>You may eat provisions<br>You gain 3 luck'
    document.getElementById('useCopperPieces').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.copperPieces) //add item to inventory array
        ingameText.innerHTML = 'You take the Copper Pieces' 
    }
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+3,initialLuck.innerHTML)
},
377:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Fight!'
    enemyList = [[5,7]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
    }
},
379:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test luck to see if you manage to dodge the lightning'
    testLuck.style.display = 'block'
    lucky = function(){
        ingameText.innerHTML += '<br>You manage to dodge the lightning but you lose your sword'
        items.removeFromInventory(items.sword)
        items.removeFromInventory(items.enchantedSword)
        items.removeFromInventory(items.riverSword)
        showElementByClass(otherPages)
    }
    unlucky = function(){
        ingameText.innerHTML += '<br>You are struck by the lightning<br>You are dead'
    }
},
383:function(){
    ingameText.innerHTML = 'You dont have the Boat House Key'
    hideElementByClass(winOtherPages)
    if(items.inventoryArray.includes('boatHouseKey')){
        ingameText.innerHTML = 'You can use the Boat House Key if you wish'
        showElementByClass(winOtherPages)
    }
},
388:function(){
    ingameText.innerHTML = 'You lose 1 stamina and 1 skill'
    skill.innerHTML--
    stamina.innerHTML--
},
389:function(){
    hideElementByClass(otherPages)
    ingameText.innerHTML = 'Test your luck'
    testLuck.style.display = 'block'
    lucky = function(){
        showElementByClass(luckyOtherPages)
    }
    unlucky = function(){
        showElementByClass(unluckyOtherPages)
    }
},
390:function(){
    ingameText.innerHTML = 'You may take the Earrings and the 5 gold pieces<br>You may eat provisions here<br>You gain 2 luck'
    document.getElementById('useEarrings').onclick = function(){
        this.style.display = 'none' //hide item button
        items.addToInventory(items.earrings) //add item to inventory array
        ingameText.innerHTML = 'You take the Earrings' 
    }
    document.getElementById('useGold5').onclick = function(){
        this.style.display = 'none' //hide item button
        gold.innerHTML = Number(gold.innerHTML) + 5
        ingameText.innerHTML = 'You take the 5 gold pieces' 
    }
    useProvisions.style.display = 'block'
    luck.innerHTML = Math.min(Number(luck.innerHTML)+2,initialLuck.innerHTML)
},
393:function(){
    ingameText.innerHTML = 'You take the 8 gold pieces<br>You may read the parchment or test the liquid'
    gold.innerHTML = Number(gold.innerHTML) + 8
},
394:function(){
    hideElementByClass(otherPages)
    attackStrengthBonus-=2
    ingameText.innerHTML = '-2 attack strength bonus added<br>Fight!'
    enemyList = [[7,8]]
    addEnemy()
    fightMechanic.style.display = 'block'
    win = function(){
        showElementByClass(otherPages)
        attackStrengthBonus+=2
    }
},
396:function(){
    let numberOfKeys = 0
    Array.prototype.map.call(items.keys,function(key){ //check every key in whole book
        if(items.inventoryArray.includes(key.id)){ //increase key count if key id string in inventory array
            numberOfKeys++ 
        }
    })
    if(numberOfKeys<2){
        ingameText.innerHTML = 'You dont have enough keys<br>You lose 5 stamina'
        stamina.innerHTML-=5
    } else{
        ingameText.innerHTML = 'You use 2 keys from your inventory'
    }
},
}

//load the initial stats and inventory from the setup
loadSetup()

// rolls 1 die---------------------------------------------------
function rollD1(){
    return Math.ceil(Math.random()*6)
}

// save game progress---------------------------------------------
save.addEventListener('click',function(e){
    //save current page number
    localStorage.setItem('currentPage',pageLog[pageLog.length-1])

    //save stats, enemy stats, gold, provisions, inventory, notes 
    localStorage.setItem('skill',skill.innerHTML)
    localStorage.setItem('stamina',stamina.innerHTML)
    localStorage.setItem('luck',luck.innerHTML)
    localStorage.setItem('initialSkill',initialSkill.innerHTML)
    localStorage.setItem('initialStamina',initialStamina.innerHTML)
    localStorage.setItem('initialLuck',initialLuck.innerHTML)
    localStorage.setItem('gold',gold.innerHTML)
    localStorage.setItem('provisions',provisions.innerHTML)
    localStorage.setItem('inventoryArray',JSON.stringify(items.inventoryArray))
    localStorage.setItem('notes',notes.value)
    localStorage.setItem('attackStrengthBonus',attackStrengthBonus)
    
    //set the saved counter as the potion use counter
    localStorage.setItem('potionUseCounterSaved',localStorage.getItem('potionUseCounter'))

    //save display state of all getItem buttons
    Array.prototype.map.call(getItem,function(item){
        getItemStateArray.push(item.style.display)
    })
    localStorage.setItem('getItemStateArray',JSON.stringify(getItemStateArray))
  
    //save display state of all otherPage buttons
    Array.prototype.map.call(otherPages,function(otherPage){
        getOtherPagesStateArray.push(otherPage.style.display)
    })
    localStorage.setItem('getOtherPagesStateArray',JSON.stringify(getOtherPagesStateArray))
 
    //save pagelog
    localStorage.setItem('pageLog',JSON.stringify(pageLog))

    save.innerHTML = 'Progress is saved'
    setTimeout(() => {
        save.innerHTML = 'Save progress'
    }, 500);
    load.innerHTML = 'Load save'
    load.style.display = 'block'
    deleteSave.innerHTML = 'Delete save file'   
})

// load game progress---------------------------------------------
load.style.display = 'none'
load.addEventListener('click', loadSetup)
function loadSetup(){

    //show all buttons on page if they are currently hidden
    showElementByClass(otherPages)
    
    //hide all pages
    hideElementByClass(pages)

    //hide fight mechanic show save buttons, clear enemy list, ingame text, battle text, counters, win, lucky and unlucky functions, rolldie, testLuck, useProvisions
    fightMechanic.style.display = 'none'
    save.style.display = 'block' //can only save on pages with no function
    enemyList = []
    allEnemies.innerHTML = ''
    ingameText.innerHTML = ''
    ingameText.style.display = 'block' // always show ingametext unless specified
    battleText.innerHTML = ''
    attackRoundCounter = 0
    hitsReceivedCounter = 0
    win = function(){}
    lucky = function(){}
    unlucky = function(){} 
    rolldie.style.display = 'none'
    rolldice.style.display = 'none'
    testLuck.style.display = 'none'
    useProvisions.style.display = 'none'

    //if there are no current page saved, show first page
    if(!localStorage.getItem('currentPage')){
        localStorage.setItem('currentPage',1)
    }
    
    //show the page that stopped at
    for(let i=0;i<pages.length;i++){
        if(pages[i].id==localStorage.getItem('currentPage')){
            pages[i].style.display = 'block'
        }
    }
    
    // add new page to log
    pageLog.push(localStorage.getItem('currentPage'))
    
    //load display state of all getItem buttons
    if(localStorage.getItem('getItemStateArray')){
        for(let i=0;i<getItem.length;i++){
            getItem[i].style.display = JSON.parse(localStorage.getItem('getItemStateArray'))[i]
        }
    }
    getItemStateArray = []
    
    // load display state of all otherPage buttons
    if(localStorage.getItem('getOtherPagesStateArray')){
        for(let i=0;i<otherPages.length;i++){
            otherPages[i].style.display = JSON.parse(localStorage.getItem('getOtherPagesStateArray'))[i]
        }
    }
    getOtherPagesStateArray = []  

    //load saved values into respective boxes
    skill.innerHTML = localStorage.getItem('skill')
    stamina.innerHTML = localStorage.getItem('stamina')
    luck.innerHTML = localStorage.getItem('luck')
    initialSkill.innerHTML = localStorage.getItem('initialSkill')
    initialStamina.innerHTML = localStorage.getItem('initialStamina')
    initialLuck.innerHTML = localStorage.getItem('initialLuck')     
    gold.innerHTML = (localStorage.getItem('gold')?localStorage.getItem('gold'):0)   
    provisions.innerHTML = localStorage.getItem('provisions')
    notes.value = localStorage.getItem('notes')  
    attackStrengthBonus = localStorage.getItem('attackStrengthBonus')
    if(localStorage.getItem('attackStrengthBonus')==null){
        attackStrengthBonus = 0 // if bonus is null cuz new game, assign to 0
    }

    //load pagelog
    if(localStorage.getItem('pageLog')==null){
        pageLog = [] // if pagelog is null cuz new game, assign to []
    } else{
        console.log(localStorage.getItem('pageLog'))
        pageLog = JSON.parse(localStorage.getItem('pageLog'))
    }
    
    //load the potion use counter as the saved counter
    localStorage.setItem('potionUseCounter',localStorage.getItem('potionUseCounterSaved'))
    
    //rectify button  name based on saved counter
    items.potionName(localStorage.getItem('potionUseCounterSaved'))

    //empty inventory array first before adding loaded items
    items.inventoryArray.splice(0,items.inventoryArray.length)
    
    //loading inventory array to append item buttons
    Array.prototype.map.call(JSON.parse(localStorage.getItem('inventoryArray')),function(e){
        items.inventoryArray.push(e)
    })
    
    //hide all item buttons first
    hideElementByClass(items.itemsArray)
    
    //show item buttons that are in inventory via id
    Array.prototype.map.call(items.itemsArray,function(e){
        if(items.inventoryArray.includes(e.id)){
            e.style.display = 'block'
        }
    })
    
    //change save and load deleteSave button text when load is clicked
    load.innerHTML = 'Progress is loaded'
    setTimeout(() => {
        load.innerHTML = 'Load save'
    }, 500);
    save.innerHTML = 'Save progress'
    deleteSave.innerHTML = 'Delete save file'
}

// delete save file-------------------------------------------------------
deleteSave.addEventListener('click',function(e){
    if(confirm('Are you sure you want to delete your progress?')){
        //clear local storage and change save, load, delete button names
        localStorage.clear()
        deleteSave.innerHTML = 'Save file deleted'
        load.innerHTML = 'Load Save'
        save.innerHTML = 'Save progress'
        window.location.href = 'index.html'
    }
})

//test luck function----------------------------------------------------------
testLuck.addEventListener('click', testLuckFunction)
function testLuckFunction(ev){
    if(luck.innerHTML>0){       
        testLuckRoll = rollD1()+rollD1()
        ingameText.innerHTML = 'You rolled '+ testLuckRoll
        ingameText.style.display = 'block' 
        testLuck.style.display = 'none'
        //unlucky if total of 2 dice > current luck, luck -1 after
        if(testLuckRoll>luck.innerHTML){
            ingameText.innerHTML += '<br>You are unlucky..'
            //run unlucky functions for page
            unlucky()
        } else{
            ingameText.innerHTML += '<br>You are lucky!'
            //run lucky functions for page
            lucky()
        }
        luck.innerHTML--
    }
}

//roll 1 or 2 dice function---------------------------------------------------------
rolldie.addEventListener('click', rolldieFunction)
function rolldieFunction(){
    ingameText.style.display = 'block' 
    rolldieResult = rollD1()
    ingameText.innerHTML = 'You rolled a '+ rolldieResult
}
rolldice.addEventListener('click', rolldiceFunction)
function rolldiceFunction(){
    ingameText.style.display = 'block' 
    rolldiceResult = rollD1() + rollD1()
    ingameText.innerHTML = 'You rolled a total of '+ rolldiceResult
}

//fight mechanic------------------------------------------------------------

//function to check for non combat death
function checkPlayerDeath(){
    if(stamina.innerHTML<1){
        ingameText.style.display = 'block'
        ingameText.innerHTML = '<br>You are dead'
        useLuck.removeEventListener('click',usingLuck)
        fight.removeEventListener('click',fightOneAtATime)
        fight.removeEventListener('click',fightTogether)
        //remove otherPage buttons when dead
        hideElementByClass(otherPages)
    }
}

//function to call when enemy dead
function checkEnemyDeath(){
    if(enemyStamina[0].innerHTML<1){
        battleText.innerHTML += '<br>You won!'
        useLuck.removeEventListener('click',usingLuck)
        //remove defeated enemy from enemylist 
        enemyList.shift()
        //remove first enemy element
        allEnemies.removeChild(allEnemies.firstElementChild)
        //check if theres enemies left
        if(enemyList.length<1){
            ingameText.innerHTML = ''
            //call win function when win
            win()
        }
    }
}

//add enemy function
function addEnemy(){
    //add enemies skill stamina elements & values
    for(let i=0;i<enemyList.length;i++){ 
        if(enemyList[i][0]){
            allEnemies.appendChild(enemyElement.cloneNode(true))
        }
        enemyName[i].innerHTML += i+1
        enemySkill[i].innerHTML = enemyList[i][0]
        enemyStamina[i].innerHTML = enemyList[i][1]
        useLuckTogetherButtons[i].value = i //name luck buttons if fight tgt
    }
}

//add enemies to fight together function
function addEnemyFightTogether(){
    fight.removeEventListener('click',fightOneAtATime) //change listener
    fight.addEventListener('click',fightTogether)    
    chooseEnemy.style.display = 'block'     
    for(let i=0;i<enemyList.length;i++){        
        chosenEnemy.value = i       //add choice tags
        chosenEnemy.innerHTML = 'Enemy '+ (i+1) //add choice words
        chooseEnemy.appendChild(chosenEnemy.cloneNode(true)) //add to dropdown list
    }
    fightMechanic.insertBefore(document.createElement('br'),allEnemies)
    addEnemy()
}

//fight button
fight.addEventListener('click',fightOneAtATime)

//fight function
function fightOneAtATime(){
    useLuck.removeEventListener('click',usingLuck)
    cresentShieldText.style.display = 'none' //to hide cresent shield text unless youre hit
      
    if(enemyList.length>0){
        // ensure both player and enemy skill and stamina is > 0
        if (stamina.innerHTML>0 && enemyStamina[0].innerHTML>0){
            
            //roll for player and enemy
            let attackStrengthRoll = rollD1()+rollD1()
            let enemyAttackStrengthRoll = rollD1()+rollD1()

            // calculate attack strength for player and enemy
            attackStrength = Number(skill.innerHTML)+attackStrengthRoll+attackStrengthBonus
            enemyAttackStrength = Number(enemySkill[0].innerHTML)+enemyAttackStrengthRoll
            
            // show dice roll and attackStrength in battleText
            battleText.innerHTML = 'Skill ' + skill.innerHTML +' + Total Bonus '+ attackStrengthBonus +' + Roll '+ attackStrengthRoll 
            + '<br> VS <br>' +
            'Enemy skill ' + enemySkill[0].innerHTML +' + Roll '+ enemyAttackStrengthRoll
         
            // you hit enemy
            if (attackStrength> enemyAttackStrength){
                // update stamina on the screen
                enemyStamina[0].innerHTML = Number(enemyStamina[0].innerHTML)-2
                battleText.innerHTML += '<br>You hit enemy! Enemy loses 2 stamina'
                // gives the choice to use luck after every turn
                useLuck.addEventListener('click', usingLuck)

            //enemy hits you
            } else if (attackStrength< enemyAttackStrength){
                stamina.innerHTML-=2
                battleText.innerHTML += '<br>Enemy hits you! You lose 2 stamina'
                // gives the choice to use luck after every turn
                useLuck.addEventListener('click', usingLuck)
                // show cresent shield effect but only if not on page39
                if(pageLog[pageLog.length-1]!='39'){
                    cresentShieldEffect()
                }

            // both miss
            } else{
                battleText.innerHTML += '<br>Both missed!'
                //cant use luck if both miss
                useLuck.removeEventListener('click',usingLuck)
            }
        }
        //if you die
        checkPlayerDeath()
        // if enemy die
        checkEnemyDeath()
    }
}

function fightTogether(){
    cresentShieldText.style.display = 'none' //to hide cresent shield text unless youre hit
    battleText.innerHTML = ''
    useLuck.style.display = 'none'
    Array.prototype.map.call(useLuckTogetherButtons,function(useLuckTogetherButton){
        useLuckTogetherButton.style.display = 'block' //show use luck buttons for fight tgt
    })
    if(chooseEnemy.value=='Choose Enemy to attack'){  //check if choice of enemy is made
        alert('You havent chosen which enemy to attack')
    } else{
        playerDiceRollArray = []
        playerAttackStrengthArray = []
        enemyDiceRollArray = []
        enemyAttackStrengthArray = []
        Array.prototype.map.call(enemyList,function(enemy){  //store dice rolls for player and enemies 
            rolldiceFunction()
            playerDiceRollArray.push(rolldiceResult)   
            playerAttackStrengthArray.push(Number(skill.innerHTML)+rolldiceResult)
            rolldiceFunction()
            enemyDiceRollArray.push(rolldiceResult)
            enemyAttackStrengthArray.push(Number(enemySkill[0].innerHTML)+rolldiceResult)
        })
        ingameText.style.display = 'none' //hidden by default, to prevent clash with roll texts
        for(let i=0;i<playerAttackStrengthArray.length;i++){      //compare player strength and enemy strength array
            if(useLuckTogetherButtons[i]){ //check if it exists as it is removed when enemy dies
                useLuckTogetherButtons[i].removeEventListener('click',usingLuck) //remove listneer unless hit or get hit
                battleText.innerHTML += '<br>Skill '+skill.innerHTML+' + Total Bonus '+attackStrengthBonus+' + Roll '+playerDiceRollArray[i]
                +'<br>VS<br>'+ 'Enemy Skill '+enemySkill[i].innerHTML+' + Roll '+enemyDiceRollArray[i]
            }
            if(playerAttackStrengthArray[i]>enemyAttackStrengthArray[i]){
                if(chooseEnemy.value==i){       //if chosen enemy is the one you hit
                    useLuckTogetherButtons[i].addEventListener('click',usingLuck)
                    battleText.innerHTML += '<br>You hit enemy! Enemy loses 2 stamina'
                    enemyStamina[i].innerHTML -= 2
                    if(enemyStamina[i].innerHTML<1){       //check death
                    enemyList.splice(i,1)       //remove from enemylist
                        enemies[i].remove()       //remove from html
                        enemyChoices[i].remove()        //remove from options
                        for(let i=0;i<enemyList.length;i++){
                            enemyChoices[i].value = i      //reassign option values
                            useLuckTogetherButtons[i].value = i    //reassign luck button
                        }
                        battleText.innerHTML += '<br>You won!'
                    }
                } else{
                    battleText.innerHTML += '<br>You defended yourself'
                }
            }
            if(playerAttackStrengthArray[i]<enemyAttackStrengthArray[i]){
                if(useLuckTogetherButtons[i]){ //check if it exists as it is removed when enemy dies
                    useLuckTogetherButtons[i].addEventListener('click',usingLuck)
                    battleText.innerHTML += '<br>Enemy hits you! You lose 2 stamina'
                }
                stamina.innerHTML-= 2
                checkPlayerDeath()
                cresentShieldEffect()
            }
            battleText.innerHTML += '<br>'
        }
        if(enemyList.length==0){ //check if any more enemies
            chooseEnemy.style.display = 'none'
            fight.removeEventListener('click',fightTogether) //reassign listener
            fight.addEventListener('click',fightOneAtATime)            
            useLuck.style.display = 'block'
            ingameText.innerHTML = ''
            win()
        }
    }
}

// use luck in battle--------------------------------------------
function usingLuck(){
    if(luck.innerHTML>0){
        let useLuckRoll = rollD1()+rollD1()
        //show the roll in battleText
        battleText.innerHTML = 'You rolled ' + useLuckRoll + '<br>'
        if(chooseEnemy.style.display == 'block'){ //check if fight separate or tgt
            if(playerAttackStrengthArray[this.value]>enemyAttackStrengthArray[this.value]){
                if(useLuckRoll>luck.innerHTML){
                    // update stamina on the screen
                    enemyStamina[this.value].innerHTML = Number(enemyStamina[this.value].innerHTML)+1
                    battleText.innerHTML += 'Unlucky! Enemy lost 1 less stamina'
                } else{
                    // update stamina on the screen
                    enemyStamina[this.value].innerHTML = Number(enemyStamina[this.value].innerHTML)-2
                    battleText.innerHTML += 'Lucky! Enemy lost 2 extra stamina'
                    if(enemyStamina[this.value].innerHTML<1){
                        enemyList.splice(this.value,1) //remove from enemylist
                        enemies[this.value].remove() //remove from html
                        enemyChoices[this.value].remove() //remove from options
                        for(let i=0;i<enemyList.length;i++){
                            enemyChoices[i].value = i //reassign option values
                            useLuckTogetherButtons[i].value = i
                        }
                        battleText.innerHTML += '<br>You won!'
                        if(enemyList.length==0){
                            chooseEnemy.style.display = 'none'
                            fight.removeEventListener('click',fightTogether)
                            fight.addEventListener('click',fightOneAtATime)            
                            useLuck.style.display = 'block'
                            ingameText.innerHTML = ''
                            win()
                        }
                    }
                }
            }
            if(playerAttackStrengthArray[this.value]<enemyAttackStrengthArray[this.value]){
                if(useLuckRoll>luck.innerHTML){
                    stamina.innerHTML = Number(stamina.innerHTML)-1
                    battleText.innerHTML += 'Unlucky! You lost 1 extra stamina'
                    checkPlayerDeath()
                } else{
                    stamina.innerHTML = Number(stamina.innerHTML)+1           
                    battleText.innerHTML += 'Lucky! You lost 1 less stamina'
                }
            }
        } else {
            if (attackStrength> enemyAttackStrength){ //fight separately
                if(useLuckRoll>luck.innerHTML){
                    // update stamina on the screen
                    enemyStamina[0].innerHTML = Number(enemyStamina[0].innerHTML)+1
                    battleText.innerHTML += 'Unlucky! Enemy lost 1 less stamina'
                } else{
                    // update stamina on the screen
                    enemyStamina[0].innerHTML = Number(enemyStamina[0].innerHTML)-2
                    battleText.innerHTML += 'Lucky! Enemy lost 2 extra stamina'
                }
            } else if (attackStrength< enemyAttackStrength){
                if(useLuckRoll>luck.innerHTML){
                    stamina.innerHTML = Number(stamina.innerHTML)-1
                    battleText.innerHTML += 'Unlucky! You lost 1 extra stamina'
                } else{
                    stamina.innerHTML = Number(stamina.innerHTML)+1           
                    battleText.innerHTML += 'Lucky! You lost 1 less stamina'
                }
            }
            //if you die 
            checkPlayerDeath()
            // if enemy defeated
            checkEnemyDeath()
        }
        luck.innerHTML--
        //can only use luck once every turn
        this.removeEventListener('click',usingLuck)
    }   
}

//use provisions-----------------------------------------------
useProvisions.addEventListener('click', function(ev){
    ingameText.style.display = 'block'
    //if there are provisions, increase stamina and reduce provisions
    if (Number(provisions.innerHTML)>0){
        //only if stamina is below max
        if(Number(stamina.innerHTML)<Number(initialStamina.innerHTML)){
            provisions.innerHTML--
            //replenish stamina by 4 or to initial, whichever lower
            stamina.innerHTML = Math.min(Number(stamina.innerHTML)+4,initialStamina.innerHTML)
            ingameText.innerHTML += '<br>Stamina replenished'
        } else{
            ingameText.innerHTML += '<br>Stamina is already full'
        }
    }
    //hide useProvisions after eating as only can eat 1meal at a time
    useProvisions.style.display = 'none'
})

}