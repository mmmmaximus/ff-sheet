//initialise in game items--------------------------------------
export let inventoryArray = []
export const sword = document.getElementById('sword')
export const leatherArmor = document.getElementById('leatherArmor')
export const lantern = document.getElementById('lantern')
export const potionOfSkill = document.getElementById('potionOfSkill')
export const potionOfStrength = document.getElementById('potionOfStrength')
export const potionOfFortune = document.getElementById('potionOfFortune')
export const enchantedSword = document.getElementById('enchantedSword')
export const cheese = document.getElementById('cheese')
export const woodMallet = document.getElementById('woodMallet')
export const silverChisel = document.getElementById('silverChisel')
export const theGiverOfSleep = document.getElementById('theGiverOfSleep')
export const bronzeKey9 = document.getElementById('bronzeKey9')
export const eyeOfTheCyclops = document.getElementById('eyeOfTheCyclops')
export const key111 = document.getElementById('key111')
export const potionOfInvisibility = document.getElementById('potionOfInvisibility')
export const yShapedStick = document.getElementById('yShapedStick')
export const bronzeKey99 = document.getElementById('bronzeKey99')
export const cresentShield = document.getElementById('cresentShield')
export const glove = document.getElementById('glove')
export const boatHouseKey = document.getElementById('boatHouseKey')
export const mapParchment = document.getElementById('mapParchment')
export const secondKey111 = document.getElementById('secondKey111')
export const woodStumps = document.getElementById('woodStumps')
export const crucifix = document.getElementById('crucifix')
export const blueCandle = document.getElementById('blueCandle')
export const woodenShield = document.getElementById('woodenShield')
export const copperKey66 = document.getElementById('copperKey66')
export const bronzeHelmet = document.getElementById('bronzeHelmet')
export const ironHelmet = document.getElementById('ironHelmet')
export const book = document.getElementById('book')
export const riverSword = document.getElementById('riverSword')
export const goldenKey125 = document.getElementById('goldenKey125')
export const copperPieces = document.getElementById('copperPieces')
export const earrings = document.getElementById('earrings')
export const keys = document.getElementsByClassName('key')
export let itemsArray = [sword,leatherArmor,lantern,potionOfSkill,potionOfStrength,potionOfFortune,
    enchantedSword,cheese,woodMallet,silverChisel,theGiverOfSleep,bronzeKey9,eyeOfTheCyclops,key111,
    potionOfInvisibility,yShapedStick,bronzeKey99,cresentShield,glove,boatHouseKey,mapParchment,
    secondKey111,woodStumps,crucifix,blueCandle,woodenShield,copperKey66,bronzeHelmet,ironHelmet,
    book,riverSword,goldenKey125,copperPieces,earrings]

//function to remove item from inventory array and hide button
export function removeFromInventory(item){
    if(item==enchantedSword){
        initialSkill.innerHTML-=2
        skill.innerHTML-=2
    }
    for(let i=0;i<inventoryArray.length;i++){
        if(inventoryArray[i]==item.id){
            inventoryArray.splice(i, 1)
            break
        }
    }
    item.style.display = 'none'
}

//function to add item to inventory array
export function addToInventory(node){
    inventoryArray.push(node.id)
    node.style.display = 'block'
}

//function to set potion name as it is used
export function potionName(e){
    if(e=='null'){
        potionOfSkill.innerHTML = 'Potion of Skill x2 uses'
        potionOfStrength.innerHTML = 'Potion of Strength x2 uses'
        potionOfFortune.innerHTML = 'Potion of Fortune x2 uses'
    }
    if(e==1){
        potionOfSkill.innerHTML = 'Potion of Skill x1 use'
        potionOfStrength.innerHTML = 'Potion of Strength x1 use'
        potionOfFortune.innerHTML = 'Potion of Fortune x1 use'
    }
}

//item effects-------------------------------------------------
//potion of skill
potionOfSkill.addEventListener('click',function(){
    if(skill.innerHTML==initialSkill.innerHTML){
        alert('Skill is already at initial level')
    }else if(localStorage.getItem('potionUseCounter')==1){
        removeFromInventory(potionOfSkill)
    }else{
        //potion counter increment when used
        localStorage.setItem('potionUseCounter',1)
        potionName(localStorage.getItem('potionUseCounter'))
    }
    skill.innerHTML = initialSkill.innerHTML
})

//potion of strength
potionOfStrength.addEventListener('click',function(){
    if(stamina.innerHTML==initialStamina.innerHTML){
        alert('Stamina is already at initial level')
    }else if(localStorage.getItem('potionUseCounter')==1){
        removeFromInventory(potionOfStrength)
    }else{
        //potion counter increment when used
        localStorage.setItem('potionUseCounter',1)
        potionName(localStorage.getItem('potionUseCounter'))
    }
    stamina.innerHTML = initialStamina.innerHTML
})

//potion of fortune
potionOfFortune.addEventListener('click',function(){
    if(localStorage.getItem('potionUseCounter')==1){
        removeFromInventory(potionOfFortune)
    }else{
        //potion counter increment when used
        localStorage.setItem('potionUseCounter',1)
        potionName(localStorage.getItem('potionUseCounter'))
    }
    initialLuck.innerHTML = Number(initialLuck.innerHTML)+1
    luck.innerHTML = initialLuck.innerHTML
})

//view map parchment
mapParchment.addEventListener('click',function(){
    alert('The parchment is well worn and almost illegible. It is a map of some sort, headed "The Maze of Zagor". You can make little sense of it, although a room to the north is marked "...GER" and another to the east is marked "SM...P...LE"')
})
