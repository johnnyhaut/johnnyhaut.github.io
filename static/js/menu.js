
var numOfDecks = 3; 
var bankroll = 250; 

//upon starting the website 
window.onload = function() {
    
    //start up the game and hide main menu 
    document.getElementById("start").addEventListener("click",goToPage);

    //go into the settings menu 
    document.getElementById("settings").addEventListener("click",settings);     
    //creates requested number of hands ----------------

    setupNavToggle(); 
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

// Used to setup the mobile hamburger nav toggle
function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('navOverlay');
  const close = document.getElementById('navClose');

  if (!toggle || !overlay || !close) return;

  toggle.addEventListener('click', () => {
    overlay.classList.add('open');
    toggle.style.display = 'none';        // hide hamburger when overlay opens
  });

  close.addEventListener('click', () => {
    overlay.classList.remove('open');
    toggle.style.display = 'block';       // restore hamburger when overlay closes
  });
}