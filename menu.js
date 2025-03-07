
var numOfDecks = 3; 
var bankroll = 1000; 

//upon starting the website 
window.onload = function() {
    
    //start up the game and hide main menu 
    document.getElementById("start").addEventListener("click",goToPage);

    //go into the settings menu 
    document.getElementById("settings").addEventListener("click",settings);     
    //creates requested number of hands ----------------
}

function goToPage(){
    window.location.href = "blackjack.html?numOfDecks=" + numOfDecks + "&bankroll="+bankroll; 
}