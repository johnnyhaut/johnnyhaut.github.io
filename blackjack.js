//tracks win counts 
var dealerWin =0; 
var playerWin =0; 
var pushCount = 0; 

//holds the current Sums and ace counts 
var playerSum =0; 
var dealerSum =0;
var playerAceCount =0; 
var dealerAceCount =0; 

//keeps track of the dealers face down card 
var hidden; 
var hiddenVal; 
//number of decks in the shoe
var numOfDecks =4;
var playerCount = 0; 
var runningCount = 0; 

//holds the cards in the shoe => need to adjust to be SHOE
var shoe; 

//the number of cards still in the shoe 
var remaining = (numOfDecks * 52); 

//when the user chooses to stay 
var stayButtonPressed = false; 

//allows the player to hit while playerSum <= 21 
var canHit = true; 

//use this to make the settings popup disappear 
// document.getElementById(id).style.property = new style; 
//I can use the outside div or x to close the box 


//upon starting the website 
window.onload = function() {

    //creates a deck of 52 cards, shuffle it, wait to start 
    buildDeck(numOfDecks); 
    shuffleDeck(); 
    
    //start up the game and hide main menu 
    document.getElementById("start").addEventListener("click",leaveMenu);

    //go into the settings menu 
    document.getElementById("settings").addEventListener("click",settings);     
    //creates requested number of hands ----------------
}

 
//creates a deck of 52 cards in order
function buildDeck(numberOfDecks){
    let values = ["ace", "2","3","4","5","6","7","8","9","10","jack","queen","king"]; 
    let types = ["c","d","h","s"]; 
    shoe = []; 
    for(let count=0;count<numberOfDecks;count++){

        //for every card in each suit 
        for(let i=0;i<types.length;i++){
            for(let j=0;j<values.length;j++){
                //Add the card to the deck 
                shoe.push(values[j] + "-" + types[i]); // Ace-C -> King-C first 
            }
        }
    }
    //console.log(shoe); //to check what's in the deck 
}

//shuffles the order of the cards in the deck 
function shuffleDeck(){
    for(let i=0;i<shoe.length;i++){
        let j = Math.floor(Math.random() * shoe.length); //(0-1)*52 => (0->51.999)
        let temp = shoe[i]; 
        shoe[i] = shoe[j];
        shoe[j] = temp; 
    }
    console.log(shoe); 
}

// make the settings menu appear 
function settings(){
    console.log("Settings");
    document.getElementById("settings-model").style.display = "inline"; 
    document.getElementById("closer").addEventListener("click", closeSettings);
}

//closes the settings menu if the x is clicked or outside the box 
function closeSettings(){
    var e = document.getElementById("settings-model").style.display = "none"; 
}

//deals the cards to the player and first two of the dealers cards 
function startGame(){

    remaining-=4; 
    displayRemCards();
    
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
        document.getElementById("theCount").innerText = runningCount; 


        //increment ace count
        playerAceCount += checkAce(card); 

        //adds image tag to your-cards div 
        document.getElementById("your-cards").append(cardImg); 
    }

    //tries to reduce the players sum if over 21 
    if(playerSum == 21){
        stay(); 
    }else if (playerSum > 21){
        reduceAce()
    }

    //displays the players sum and dealer's faceup card before hit or stay
    displayPlaySum(); 
    displaySums("deal-sum",dealerSum);

    //console.log("BEFORE CHECKS OF BUTTONS"); 
    //checks for any of the buttons being pressed 
    document.getElementById("hitbut").addEventListener("click",hit); 
    document.getElementById("staybut").addEventListener("click",stay); 
    document.getElementById("new-game").addEventListener('click',restart);
    document.getElementById("next-hand").addEventListener('click',nexthand);
    document.getElementById("inCount").addEventListener("click",incrementCount);
    document.getElementById("deCount").addEventListener("click",decrementCount);
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
    document.getElementById("ourCount").innerText = playerCount; 
}

function decrementCount(){
    playerCount--; 
    document.getElementById("ourCount").innerText = playerCount; 
}

function leaveMenu(){
    //console.log("weirdo"); 

    //leaves the menu 
    removeElement("main-menu"); 

    document.getElementById("rem-cards").style.display = "initial"; 

    //displays the amount of cards left in the deck
    document.getElementById("remaining").innerText = remaining;

    startGame(); 
}

//deals the next hand with the remaining cards in the deck
function nexthand(){

    //make sure there are enough cards 
    if(remaining <12){
        //if there are not enough cards prompt the user to 
        var message = "Not Enough Cards, Draw from New Deck"; 
        document.getElementById("results").innerText = message; 
        return; 
    }

    console.log("FAILED TO STOP");

    stayButtonPressed = false; 

    //wipes the current cards on the screen
    clearBox("dealer-cards");
    clearBox("your-cards"); 

    //wipes the scores and winner
    clearBox("results"); 
    clearBox("deal-sum"); 
    clearBox("your-sum"); 

    //update the W/L 
    document.getElementById("dubs").innerText = playerWin;
    document.getElementById("els").innerText = dealerWin; 
    document.getElementById("ties").innerText = pushCount; 

    //adds the blank card to dealers cards
    //create an image tag 
    let cardImg = document.createElement("img"); 

    //resets player & dealer counts
    playerAceCount =0; 
    playerSum =0;
    dealerAceCount = 0; 
    dealerSum =0; 
    canHit = true; 
    hidden = shoe.pop(); 



    //set src for image tag: <img src="./cards/4-c.png">
    cardImg.src  = "./images/cards/BACK.png";
    cardImg.id = "hidden"; 
    document.getElementById("dealer-cards").append(cardImg);

    //starts a new game 
    startGame(); 
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
    document.getElementById("theCount").innerText = runningCount; 

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
    document.getElementById("theCount").innerText = runningCount;  

}

//attempt to fix main menu, clears the entire html
function removeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.parentNode.removeChild(element);
    }
  }

//clears a division, wipes the cards 
function clearBox(elementID){
    document.getElementById(elementID).innerHTML = ""; 
}

//reloads the page and provides the player with a fresh deck 
function restart (){
    window.location.reload();
    return false; 
}

//user wants no more cards 
function stay(){

    if(!stayButtonPressed){   

        dealersTurn(); 

        //don't the user get any more cards 
        canHit = false; 

        console.log(hidden); 

        //unhides the hidden card 
        document.getElementById("hidden").src = "./images/cards/" + hidden + ".png";

        let message = ""; 

        //player bust 
        if(playerSum > 21){
            message = "You Lose!"; 
            //update the W/L 
            dealerWin++; 

        //dealer bust 
        } else if(dealerSum >21){
            message = "You Win!"; 
            playerWin++; 
        } 
        //same sum as the dealer 
        else if(playerSum == dealerSum){
            message = "It's a Push!"; 
            pushCount++; 
        }
        //player greater than dealer
        else if(playerSum > dealerSum){
            message = "You Win!"; 
            //update the W/L 
            playerWin++; 
        }
        //player less than dealer if(playerSum < dealerSum)
        else {
            message = "You Lose"; 
            //update the W/L 
            dealerWin++; 

        }
        console.log(playerWin);
        console.log(dealerWin);

        document.getElementById("dubs").innerText = playerWin;
        document.getElementById("els").innerText = dealerWin;
        document.getElementById("ties").innerText = pushCount; 
        stayButtonPressed = true; 

        //displays dealers sum
        displaySums("deal-sum",dealerSum); 
        //displays the players sum 
        displayPlaySum(); 
        //displays the winner 
        displaySums("results",message);  

        //displays the reminaing cards in the deck 
        displayRemCards(); 
    }

}

//displays the players current sum 
function displayPlaySum(){
    displaySums("your-sum",playerSum);
}

//displays the players remaining cards 
function displayRemCards(){
    displaySums("remaining",remaining); 
}

// displays the text in the id provided
function displaySums(id, text){
    document.getElementById(id).innerText = text; 
}

//when a user requests another card, check if they can hit then provide card 
function hit(){


    //console.log(playerSum);
    //if the user can't hit return, otherwise give player a new card 
    if(!canHit){
        console.log("YOU CAN'T HIT");
        return; 
    }


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
    document.getElementById("theCount").innerText = runningCount; 

    //increment ace count
    playerAceCount += checkAce(card); 

    //adds image tag to dealer-cards div 
    document.getElementById("your-cards").append(cardImg); 

    if(reduceAce()>=21){
        canHit = false; 
        stay();
    }

    // displays the players sum 
    displayPlaySum(); 
    remaining -= 1; 
    //updates the amount of cards showing as displayed
    displayRemCards();
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
// dealer not hitting when less than 17 (aces maybe) - think this is fixed 
// Create a feature that ends turn if playerSum = 21 - should be done

// auto new deck when running out of cards 
//1. create the settings menu to show count, # of hands, & # of decks 
    //implement mutable deck number
    //implement implement mutable multiple decks 
    //implement a running count feature
//2. want to add a feature to play multiple hands 
    //when playing with multiple decks make cards overlap 
//5. add betting: 1,5,10 increments (player starts with $100 / Starting money amount)
    //add a cash out feature 
//6. use cookies to save game progress. 
