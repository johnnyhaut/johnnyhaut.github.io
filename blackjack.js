//tracks win counts 
var dealerWin =0; 
var playerWin =0; 
var pushCount = 0; 

//holds the current Sums and ace counts 
var playerSum =0; 
var dealerSum =0;
var splitSum = 0; 
var playerAceCount =0; 
var dealerAceCount =0; 
var firstRound = true; 

//keeps track of the dealers face down card 
var hidden; 
var hiddenVal; 

var secondImg; 

//number of decks in the shoe
var numOfDecks;
var playerCount = 0; 
var runningCount = 0; 

//holds the cards in the shoe => need to adjust to be SHOE
var shoe; 
var newDeck; 

//the number of cards still in the shoe 
var remaining; 

//when the user chooses to stay 
var stayButtonPressed = false; 
var canDouble = true; 
var canDoubleBottom = true; 
var splitting = false; 

//allows the player to hit while playerSum <= 21 
var canHit = true; 
var canHitBottom = true; 


//accounts for how much money the player has and the current bet 
var bankroll; 
var dBet = 15; 
var curBet = dBet; 

//use this to make the settings popup disappear 
// document.getElementById(id).style.property = new style; 
//I can use the outside div or x to close the box 


//upon starting the website 
window.onload = function() {
    
    //pull the deckNum and playerBankroll, build then shuffle deck
    prepareForGame(); 
    
    //wait for user to place their bet 
    document.getElementById("incBet").addEventListener("click", function(){incBet(5)});
    document.getElementById("decBet").addEventListener("click", function(){decBet(5)});
    document.getElementById("incBet10").addEventListener("click", function(){incBet(10)});
    document.getElementById("decBet10").addEventListener("click", function(){decBet(10)});
    document.getElementById("incBet25").addEventListener("click", function(){incBet(25)});
    document.getElementById("decBet25").addEventListener("click", function(){decBet(25)});
    document.getElementById("incBet50").addEventListener("click", function(){incBet(50)});
    document.getElementById("decBet50").addEventListener("click", function(){decBet(50)});

    document.getElementById("maxBet").addEventListener("click", maxBet); 
    document.getElementById("new-menu").addEventListener('click',menu);
    document.getElementById("countBut").addEventListener("click",flipCount); 
    document.getElementById("stratBut").addEventListener("click",flipStrat); 
    document.getElementById("placeBet").addEventListener("click", placeBet); 

}

function flipStrat(){
    console.log("I'm flipping the strategy"); 
    theButton = document.querySelector('input:checked');
    if(theButton){
        console.log("ya the buttons checked");
        switchStyles("stay","background-color","rgb(141,221,141)"); 
        switchStyles("stay","color","black"); 
        switchStyles("hit","color","black"); 
        switchStyles("hit","background-color","yellow"); 
        switchStyles("double","background-color","red"); 
        switchStyles("double","color","black"); 
        switchStyles("borderblocks","background-color","grey"); 
        switchStyles("borderblocks","color","black"); 
        switchStyles("split","background-color","lightblue"); 
        switchStyles("split","color","black"); 

    } else {
        console.log("nah it's not"); 
        switchStyles("stay","background-color","rgb(141,221,141)"); 
        switchStyles("stay","color","rgb(141,221,141)"); 
        switchStyles("hit","color","rgb(141,221,141)"); 
        switchStyles("hit","background-color","rgb(141,221,141)"); 
        switchStyles("double","background-color","rgb(141,221,141)"); 
        switchStyles("double","color","rgb(141,221,141)"); 
        switchStyles("borderblocks","background-color","rgb(141,221,141)"); 
        switchStyles("borderblocks","color","rgb(141,221,141)"); 
        switchStyles("split","background-color","rgb(141,221,141)"); 
        switchStyles("split","color","rgb(141,221,141)"); 
    }  
}

function switchStyles(className, styleProperty, newStyleValue){
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
        element.style[styleProperty] = newStyleValue; 
    }); 
}

function flipCount(){
    console.log("I'm flipping the Count"); 
    theButton = document.querySelector('input:checked');
    if(theButton){
        console.log("YE we checked"); 
        document.getElementById("main-count").style.backgroundColor = "white"; 
        document.getElementById("main-count").style.color = "black"; 

    } else {
        document.getElementById("main-count").style.backgroundColor = "rgb(141,221,141)"; 
        document.getElementById("main-count").style.color = "rgb(141,221,141)"; 
        console.log("Nosir we are not indead checked"); 
    }
    
}
//Take the number of decks to build a shoe,
//then shuffle it and set initial bet as default current Bet
function prepareForGame(){

    //gets the user defined number of decks and starting balance 
    getDecks(); 
    getBankroll(); 
    displaySums("curBet", dBet); //sets the default bet number
    displaySums("remaining",remaining); 
    //show a clean W/L ratio
    displaySums("dubs",playerWin); 
    displaySums("els",dealerWin); 
    displaySums("ties",pushCount); 
    

    //creates a deck of 52 cards, shuffle it, then let user placeBet
    shoe = buildDeck(numOfDecks); 
    shoe = shuffleDeck(shoe); 
}

//Pull the number of decks and set the value for remaining cards 
function getDecks(){
    const urlParams = new URLSearchParams(window.location.search);
    numOfDecks = urlParams.get("numOfDecks"); 
    remaining = (numOfDecks * 52); 
    // console.log(remaining); 
}
 
//Pull the starting balance and set value for current Bankroll
function getBankroll(){
    const urlParams = new URLSearchParams(window.location.search);
    bankroll = urlParams.get("bankroll");   
    displaySums("bankroll", bankroll);
}

//creates a deck of 52 cards in order
function buildDeck(numberOfDecks){
    let values = ["ace", "2","3","4","5","6","7","8","9","10","jack","queen","king"]; 
    let types = ["c","d","h","s"]; 
    theDeckBeingBuilt = []; 
    for(let count=0;count<numberOfDecks;count++){

        //for every card in each suit 
        for(let i=0;i<types.length;i++){
            for(let j=0;j<values.length;j++){
                //Add the card to the deck 
                theDeckBeingBuilt.push(values[j] + "-" + types[i]); // Ace-C -> King-C first 
            }
        }
    }
    return theDeckBeingBuilt; 

}

//shuffles the order of the cards in the deck 
function shuffleDeck(theShoe){
    for(let i=0;i<theShoe.length;i++){
        let j = Math.floor(Math.random() * theShoe.length); //(0-1)*52 => (0->51.999)
        let temp = theShoe[i]; 
        theShoe[i] = theShoe[j];
        theShoe[j] = temp; 
    }
    // console.log(theShoe); 
    return theShoe; 
}

function maxBet(){
    curBet = bankroll; 
    displaySums("curBet", curBet); 
}

//used for incrementing the bet amount in BettingTime
function incBet(theBet){
    if(curBet + theBet > bankroll){
        curBet = bankroll; 
    } else {
        curBet += theBet; 
    }
    displaySums("curBet", curBet); 
}

//used for decrementing the bet amount in BettingTime
function decBet(zBet){

    if(curBet -zBet < 0){
        curBet = 0; 
    } else {
        curBet -= zBet; 
    }
    displaySums("curBet", curBet); 
}

//after setting a bet amount, update bankroll and currentBet 
function placeBet(){
    // console.log("Cur BET: "+curBet);
    // console.log("Bankroll: "+bankroll);
    
    // subtract bet from bankroll and mark current bet     
    bankroll -= curBet; 
    displaySums("usersbet",curBet);
    displaySums("bankroll", bankroll); 

    // hide the bet screen and show the game 
    playingTime();


    //displays the amount of cards left in the deck
    displaySums("remaining", remaining); 
    displaySums("bankroll", bankroll); 

    //starts the game
    if(firstRound){
        startGame();
    } else {
        nexthand()
        canDouble = true; 
        canDoubleBottom = true; 
    }
    
}

//deals the cards to the player and first two of the dealers cards 
function startGame(){

    remaining -=4 ;
    firstRound = false; 
    // console.log(remaining);  
    displaySums("remaining",remaining); 
    
    //draw the first card, then give them a second hidden card
    secondCard(); 
    hidden = shoe.pop(); 

    //remove card from end of array 
    hiddenVal = getValue(hidden); 

    for(let i=0;i<2;i++){
        //create an image tag 
        let cardImg = document.createElement("img"); 

        //get a card from the deck 
        let card = shoe.pop(); 

        //set src for image tag: <img src="./cards/4-c.png">
        cardImg.src = "./images/cards/" + card + ".png"; 

        //increment dealerSum
        var cardVal = getValue(card);
        playerSum += cardVal; 
        runningCount += count(cardVal);
        displaySums("theCount",runningCount); 


        //increment ace count
        playerAceCount += checkAce(card); 

        //adds image tag to your-cards div 
        document.getElementById("your-cards").append(cardImg); 
        if(i == 1){
            secondImg = card; 
        }
    }

    //tries to reduce the players sum if over 21 
    if(playerSum == 21){
        stay(); 
    } // }else if (playerSum > 21){
    //     reduceAce()
    // }

    //displays the players sum and dealer's faceup card before hit or stay
    displaySums("your-sum",playerSum);
    displaySums("deal-sum",dealerSum);

    //console.log("BEFORE CHECKS OF BUTTONS"); 
    //checks for any of the buttons being pressed 
    document.getElementById("hitbut").addEventListener("click",hit); 
    document.getElementById("double-down").addEventListener("click",double); 
    document.getElementById("splitIt").addEventListener("click",split); 
    document.getElementById("staybut").addEventListener("click",stay); 
    document.getElementById("new-menu").addEventListener('click',menu);
    document.getElementById("next-hand").addEventListener('click',bettingTime);
    document.getElementById("inCount").addEventListener("click",incrementCount);
    document.getElementById("deCount").addEventListener("click",decrementCount);
}


function bettingTime(){
    // accounts for when they are trying to skip over current hand 
    if(stayButtonPressed){
        let div = document.getElementById("the-game"); 
        let div2 = document.getElementById("bettingScreen");
        div.style.display = "none"; 
        div2.style.display = "block";
    }
}

function playingTime(){
    let div = document.getElementById("the-game"); 
    let div2 = document.getElementById("bettingScreen");
    div.style.display = "block"; 
    div2.style.display = "none"; 
}


function count(value){
    if(value < 7){
        return 1; 
    } else if(value > 9 || value == 1){
        return -1; 
    }
    return 0; 
}

function incrementCount(){
    playerCount ++; 
    displaySums("ourCount",playerCount); 
}

function decrementCount(){
    playerCount--; 
    displaySums("ourCount",playerCount); 
}

//deals the next hand with the remaining cards in the deck
function nexthand(){
    if(stayButtonPressed){

        // console.log(shoe); 
        //make sure there are enough cards 
        if(remaining <20){

            newDeck = buildDeck(numOfDecks);
            newDeck = shuffleDeck(newDeck); 
            shoe = shoe.concat(newDeck);  
            remaining += (52*numOfDecks); 

            // //if there are not enough cards prompt the user to 
            var message = "Not Enough Cards, Shuffled new Deck"; 
            displaySums("results",message);

        //only get rid of the results if they did not get a new deck 
        } else {
            clearBox("results"); 
        }

        //allows the user to hit 
        stayButtonPressed = false; 

        //wipes the current cards on the screen
        clearBox("dealer-cards");
        clearBox("your-cards"); 
        clearBox("split-cards"); 

        //wipes the scores and winner
        clearBox("deal-sum"); 
        clearBox("your-sum"); 
        clearBox("split-sum"); 
        document.getElementById("split-cards-title").style.display = "none"; 

        //update the W/L 
        displaySums("dubs",playerWin); 
        displaySums("els",dealerWin); 
        displaySums("ties",pushCount); 

        //adds the blank card to dealers cards
        //create an image tag 
        let cardImg = document.createElement("img"); 

        //resets player & dealer counts
        playerAceCount =0; 
        playerSum =0;
        dealerAceCount = 0; 
        dealerSum =0; 
        canHit = true; 
        canHitBottom = true; 

        //set src for image tag: <img src="./cards/4-c.png">
        cardImg.src  = "./images/cards/BACK.png";
        cardImg.id = "hidden"; 
        document.getElementById("dealer-cards").append(cardImg);

        // readds the split button 
        document.getElementById("splitIt").style.display = "initial";  

        //starts a new game 
        startGame(); 
    }
}

//draws the second card for the dealer 
function secondCard(){
    //create an image tag 
    let cardImg = document.createElement("img"); 

    //get a card from the deck 
    let card = shoe.pop(); 

    //set src for image tag: <img src="./cards/4-c.png">
    cardImg.src = "./images/cards/" + card + ".png"; 

    //increment dealerSum
    var cardVal = getValue(card);
    dealerSum += cardVal; 
    runningCount += count(cardVal);
    displaySums("theCount",runningCount); 

    //increment ace count
    dealerAceCount += checkAce(card); 

    //adds image tag to dealer-cards div 
    document.getElementById("dealer-cards").append(cardImg); 
}

//it's the dealers turn to draw for 21: dealer goes last (hit until sum is >=17)
function dealersTurn(){

    //account for the hidden card in the count
    dealerSum += hiddenVal; 
    dealerAceCount += checkAce(hidden); 
    runningCount += count(hiddenVal); 

    //draw the dealers remaining cards 
    while(dealerSum <17){
        //create an image tag 
        let cardImg = document.createElement("img"); 

        //get a card from the deck 
        let card = shoe.pop(); 

        //set src for image tag: <img src="./cards/4-c.png">
        cardImg.src = "./images/cards/" + card + ".png"; 

        //increment dealerSum
        var cardVal = getValue(card);
        dealerSum += cardVal; 
        runningCount += count(cardVal);

        //increment ace count
        dealerAceCount += checkAce(card); 

        //adds image tag to dealer-cards div 
        document.getElementById("dealer-cards").append(cardImg); 
        remaining-=1; 

        //get accurate final sums for dealer and player 
        reduceDealAce();
        reduceAce(); 
    }
    //updates the running count
    displaySums("theCount", runningCount); 

}

//clears a division, wipes the cards 
function clearBox(elementID){
    document.getElementById(elementID).innerHTML = ""; 
}

//reloads the page and provides the player with a fresh deck 
function menu (){
    window.location.href = "menu.html";
}

//user wants no more cards 
function stay(){

    if(splitting){
        console.log("found the split"); 
        testingCode(); 
    }

    else if(!stayButtonPressed){   
        console.log("Starting to stay"); 
        dealersTurn(); 

        //don't the user get any more cards 
        canHit = false; 

        // console.log(hidden); 

        //unhides the hidden card 
        document.getElementById("hidden").src = "./images/cards/" + hidden + ".png";

        let message = ""; 

        //player bust 
        if(playerSum > 21){
            message = "BUST, You Lose!"; 

            //update the W/L 
            dealerWin++;         

        //same sum as the dealer 
        } else if(playerSum == dealerSum){
            message = "It's a Push!"; 
            pushCount++; 
            //give money back
            bankroll += curBet; 

        //if the player has 21 
        } else if(playerSum == 21){
            message = "BlackJack You Win"; 
            playerWin++; 
            bankroll += Math.floor(curBet*2.5); 
            displaySums("payout", Math.floor(curBet*2.5));

        } else if(dealerSum >21){
            message = "You Win!"; 
            playerWin++; 

            //2x Payout
            bankroll += curBet*2; 
            displaySums("payout",curBet *2);

        } 
        
        //player greater than dealer
        else if(playerSum > dealerSum){
            message = "You Win!"; 
            playerWin++; 

            //double player bet and update bankroll
            bankroll += curBet * 2; 
            displaySums("payout",curBet*2);

        }
        //player less than dealer if(playerSum < dealerSum)
        else {
            message = "You Lose"; 
            dealerWin++; 

        }


        //displays the reminaing cards in the deck and user's balance
        displaySums("remaining",remaining); 
        displaySums("bankroll",bankroll); 

        //update the Wins/Losses and recognize round is over 
        displaySums("dubs",playerWin); 
        displaySums("els",dealerWin); 
        displaySums("ties", pushCount); 
        
        //updates the curBet for the next hand
        if(curBet > bankroll){
            curBet = bankroll; 
        } 
        displaySums("curBet",curBet); 


        stayButtonPressed = true; 

        //displays dealer and playerSum along with the Winner
        displaySums("deal-sum",dealerSum); 
        displaySums("your-sum",playerSum);
        displaySums("results",message);  

    }

}

// displays the text in the id provided
function displaySums(id, text){
    document.getElementById(id).innerText = text; 
}

function split(){
    //mark that we are spliting
    console.log(splitting); 
    splitting = true; 
    console.log(splitting); 

    //don't let the user split twice and show split count title
    document.getElementById("splitIt").style.display = "none"; //remove button
    document.getElementById("split-cards-title").style.display = "initial"; 

    //gets the value from the first split and create the image
    splitSum = getValue(secondImg); 
    let newImg = document.createElement("img"); 
    newImg.src = "./images/cards/"+ secondImg + ".png"; 

    //remove the card from the top row
    const myDiv = document.getElementById('your-cards'); // Replace 'yourDivId' with the actual ID of your div
    if (myDiv.lastElementChild) {
        myDiv.removeChild(myDiv.lastElementChild);
    }

    //update top row count and split-cards count
    playerSum -= splitSum; 
    displaySums("your-sum",playerSum); 
    displaySums("split-sum",splitSum);
    document.getElementById("split-cards").append(newImg); 

    //give top hand a second card & let the user play on the first hand 
    hit(); 

    // document.getElementById("double-down").addEventListener("click",testingCode); 
    // document.getElementById("staybut").addEventListener("click",testingCode); 
    // when they click stay, let them play the second hand 

}

function testingCode(){
    console.log("THIS IS MY TEST YAKNOW!"); 

    //give the bottom hand a second card 
    hitBottom(); 

}

function double(){
    //if this is a valid double
    if(canDouble && bankroll - curBet >= 0){
        //update bankroll and bet amount
        bankroll -= curBet; 
        curBet += curBet; 
        displaySums("bankroll", bankroll); 
        displaySums("usersbet", curBet);
        hit(); 
        stay(); 
    }

}
function doubleBottom(){
    //if this is a valid double
    if(canDoubleBottom && bankroll - curBet >= 0){
        //update bankroll and bet amount
        bankroll -= curBet; 
        curBet += curBet; 
        displaySums("bankroll", bankroll); 
        displaySums("usersbet", curBet);
        hit(); 
        stay(); 
    }

}
//when a user requests another card, check if they can hit then provide card 
function hit(){

    //if the user can't hit return, otherwise give player a new card 
    if(!canHit){
        // console.log("YOU CAN'T HIT");
        return; 
    }

    //make sure they can't double after the first hit
    canDouble = false; 

    //create an image tag 
    let cardImg = document.createElement("img"); 
    
    //get a card from the deck 
    let card = shoe.pop(); 

    //set src for image tag: <img src="./cards/4-c.png">
    cardImg.src = "./images/cards/" + card + ".png"; 

    //increment player's Sum and running count
    var cardVal = getValue(card);
    playerSum += cardVal; 
    runningCount += count(cardVal);
    displaySums("theCount",runningCount); 

    //increment ace count
    playerAceCount += checkAce(card); 

    //adds image tag to dealer-cards div 
    document.getElementById("your-cards").append(cardImg); 

    if(reduceAce()>=21){
        canHit = false; 
        stay();
    }

    // displays the players sum 
    displaySums("your-sum",playerSum); 

    remaining -= 1; 
    //updates the amount of cards showing as displayed
    displaySums("remaining",remaining); 
}

//when a user requests another card, check if they can hit then provide card 
function hitBottom(){

    //if the user can't hit return, otherwise give player a new card 
    if(!canHitBottom){
        // console.log("YOU CAN'T HIT");
        return; 
    }

    //make sure they can't double after the first hit
    canDoubleBottom = false; 

    //create an image tag 
    let cardImg = document.createElement("img"); 
    
    //get a card from the deck 
    let card = shoe.pop(); 

    //set src for image tag: <img src="./cards/4-c.png">
    cardImg.src = "./images/cards/" + card + ".png"; 

    //increment player's Sum and running count
    var cardVal = getValue(card);
    splitSum += cardVal; 
    runningCount += count(cardVal);
    displaySums("theCount",runningCount); 

    //increment ace count
    playerAceCount += checkAce(card); 

    //adds image tag to dealer-cards div 
    document.getElementById("split-cards").append(cardImg); 

    if(reduceAce()>=21){
        canHitBottom = false; 
        stay();
    }

    // displays the players sum 
    displaySums("split-sum",splitSum); 

    remaining -= 1; 
    //updates the amount of cards showing as displayed
    displaySums("remaining",remaining); 
}

//gets an accurate player score accounting for ace being a 1 
function reduceAce(){
    while(playerSum >21 && playerAceCount >0){
        playerSum -= 10; 
        playerAceCount -=1; 
    }
    return playerSum;
}

//gets an accurate player score accounting for ace being a 1 
function reduceDealAce(){
    while(dealerSum >21 && dealerAceCount >0){
        dealerSum -= 10; 
        dealerAceCount -=1; 
    }
    return dealerSum;
}

//gets the value of 'card': returns 11 for ace, 10 for face cards, otherwise parseInt(value)  
function getValue(card) {
    let data = card.split("-"); //"4-c" -> ["4","C"]
    let value = data[0]; 
    
    //Ace, Jack, King, Queen 
    if(isNaN(value)){
        //value of Ace 
        if(value == "ace"){
            return 11; 
        }
        //Value of Jack, King, Queen 
        return 10; 
    }

    return parseInt(value); 
}

//if the card being checked is an ace return 1, otherwise 0
function checkAce(card){
    if(card[0] == "a"){
        return 1; 
    }
    return 0; 
}

// auto new deck when running out of cards 

// 21 is broken on first hand when splitting (not able to hit/double/stay)
// able to split after hitting the first time 

//1. create the settings menu to show count, # of hands, & # of decks 
//2. want to add a feature to play multiple hands 
    //when playing with multiple decks make cards overlap 
//3. use cookies to save game progress. 
