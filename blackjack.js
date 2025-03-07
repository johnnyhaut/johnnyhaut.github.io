//tracks win counts 
var dealerWin =0; 
var playerWin =0; 
var pushCount = 0; 

//holds the current Sums and ace counts 
var playerSum =0; 
var dealerSum =0;
var playerAceCount =0; 
var dealerAceCount =0; 
var firstRound = true; 

//keeps track of the dealers face down card 
var hidden; 
var hiddenVal; 

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

//allows the player to hit while playerSum <= 21 
var canHit = true; 


//accounts for how much money the player has and the current bet 
var bankroll; 
var dBet = 100; 
var curBet = dBet; 

//use this to make the settings popup disappear 
// document.getElementById(id).style.property = new style; 
//I can use the outside div or x to close the box 


//upon starting the website 
window.onload = function() {
    
    //pull the deckNum and playerBankroll, build then shuffle deck
    prepareForGame(); 
    
    //wait for user to place their bet 
    document.getElementById("incBet").addEventListener("click", incBet);
    document.getElementById("decBet").addEventListener("click", decBet);
    document.getElementById("new-menu").addEventListener('click',menu);
    document.getElementById("placeBet").addEventListener("click", placeBet); 

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

//used for incrementing the bet amount in BettingTime
function incBet(){
    if(curBet +100 > bankroll){
        curBet = bankroll; 
    } else {
        curBet += 100; 
    }
    displaySums("curBet", curBet); 
}

//used for decrementing the bet amount in BettingTime
function decBet(){
    if(curBet -100 < 0){
        curBet = 0; 
    } else {
        curBet -= 100; 
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
    document.getElementById("staybut").addEventListener("click",stay); 
    document.getElementById("new-menu").addEventListener('click',menu);
    document.getElementById("next-hand").addEventListener('click',bettingTime);
    document.getElementById("inCount").addEventListener("click",incrementCount);
    document.getElementById("deCount").addEventListener("click",decrementCount);
}


function bettingTime(){
    let div = document.getElementById("the-game"); 
    let div2 = document.getElementById("bettingScreen");
    div.style.display = "none"; 
    div2.style.display = "block";
}

function playingTime(){
    let div = document.getElementById("the-game"); 
    let div2 = document.getElementById("bettingScreen");
    div.style.display = "block"; 
    div2.style.display = "none"; 
}


// make the settings menu appear 
function settings(){
    // console.log("Settings");
    document.getElementById("settings-model").style.display = "inline"; 
    document.getElementById("closer").addEventListener("click", closeSettings);
}

//closes the settings menu if the x is clicked or outside the box 
function closeSettings(){
    var e = document.getElementById("settings-model").style.display = "none"; 
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

        //wipes the scores and winner
        clearBox("deal-sum"); 
        clearBox("your-sum"); 

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

        //set src for image tag: <img src="./cards/4-c.png">
        cardImg.src  = "./images/cards/BACK.png";
        cardImg.id = "hidden"; 
        document.getElementById("dealer-cards").append(cardImg);

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

    if(!stayButtonPressed){   

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
            bankroll += curBet*2.5; 
            displaySums("payout", curBet*2.5);

        } else if(dealerSum >21){
            message = "You Win!"; 
            playerWin++; 

            //2x Payout
            bankroll += curBet*2; 
            displaySums("payout",curBet)

        } 
        
        //player greater than dealer
        else if(playerSum > dealerSum){
            message = "You Win!"; 
            playerWin++; 

            //double player bet and update bankroll
            bankroll += curBet * 2; 
            console.log("THE CUR BET IS: "+curBet); 
            displaySums("payout",curBet);

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

//when a user requests another card, check if they can hit then provide card 
function hit(){

    //if the user can't hit return, otherwise give player a new card 
    if(!canHit){
        // console.log("YOU CAN'T HIT");
        return; 
    }

    //create an image tag 
    let cardImg = document.createElement("img"); 

    console.log("THIS IS WHERE I'M GOING WRONG"); 
    
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

//NEED TO FIX OUT OF CARDS BUG WITH MULTIPLE DECKS

// auto new deck when running out of cards 
//1. create the settings menu to show count, # of hands, & # of decks 
    //implement mutable deck number
    //implement implement mutable multiple decks 
    //implement a running count feature
//2. want to add a feature to play multiple hands 
    //when playing with multiple decks make cards overlap 
//3. add betting: 1,5,10 increments (player starts with $100 / Starting money amount)
    //add a cash out feature 
//4. use cookies to save game progress. 
