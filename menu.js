
var numOfDecks = 3; 
var bankroll = 250; 

//upon starting the website 
window.onload = function() {
    
    //start up the game and hide main menu 
    document.getElementById("start").addEventListener("click",goToPage);

    //go into the settings menu 
    document.getElementById("settings").addEventListener("click",settings);     
    //creates requested number of hands ----------------
}

function goToPage(){
    numOfDecks = document.getElementById("numDecks").value; 
    bankroll = document.getElementById("startingMoney").value; 
    window.location.href = "blackjack.html?numOfDecks=" + numOfDecks + "&bankroll="+bankroll; 
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
