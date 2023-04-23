//======================================================================================================================================================//
//                                                                                                                                                      //
//  Le script en question est un petit bot pour le chat Twitch.                                                                                         //
//  Ce bot permet de surveiller le chat pour des mots spécifiques et de répondre automatiquement à ces messages avec des réponses prédéfinies.          //
//  Les mots surveillés et leurs réponses correspondantes peuvent être ajoutés ou supprimés à la volée via une interface utilisateur simple.            //
//  Le bot est également configuré pour se connecter à un canal Twitch spécifique et écouter les messages qui y sont envoyés.                           //
//                                                                                                                                                      //
//          ||============================================================================================||                                            //
//          ||                                                                                            ||                                            //
//          ||   ██╗  ██╗██╗███╗   ██╗ ██████╗ ███████╗██████╗ ███████╗ ██████╗ ██╗   ██╗██╗███╗   ██╗    ||                                            //  
//          ||   ██║ ██╔╝██║████╗  ██║██╔════╝ ██╔════╝██╔══██╗██╔════╝██╔═══██╗██║   ██║██║████╗  ██║    ||                                            //  
//          ||   █████╔╝ ██║██╔██╗ ██║██║  ███╗███████╗██████╔╝█████╗  ██║   ██║██║   ██║██║██╔██╗ ██║    ||                                            //
//          ||   ██╔═██╗ ██║██║╚██╗██║██║   ██║╚════██║██╔══██╗██╔══╝  ██║▄▄ ██║██║   ██║██║██║╚██╗██║    ||                                            //
//          ||   ██║  ██╗██║██║ ╚████║╚██████╔╝███████║██║  ██║███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║    ||                                            //
//          ||   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝    ||                                            //
//          ||                                                                                 By ChatGPT ||                                            //
//          ||============================================================================================||                                            //
//                                                                                                                                                      //
//                                                                                                                                                      //
//  Configuration du bot Twitch:                                                                                                                        //
//  Pour configurer le bot, veuillez remplir les champs marqué par [A MODIFIER] dans la catégorie "Configuration" ci-dessous.                           // 
//  Une fois la configuration terminée, enregistrez les modifications et relancez le index.yml pour prendre en compte les changements.                  //
//                                                                                                                                                      //
//======================================================================================================================================================//
$(function () {
  const form = $("form");
  const wordInput = $("#word-input");
  const responseInput = $("#response-input");
  const wordTableBody = $("#word-table-body");

  let watchedWords = [];

  function addWatchedWord(word, response) {
    watchedWords.push({ word: word, response: response });

    let row = $("<tr>");
    let wordCell = $("<td>").text(word);
    let responseCell = $("<td>").text(response);
    let deleteCell = $("<td>");
    let deleteButton = $("<button>").text("Supprimer");
    deleteButton.on("click", function () {
      watchedWords = watchedWords.filter(function (watchedWord) {
        return watchedWord.word !== word;
      });

      row.remove();
    });
    deleteCell.append(deleteButton);
    row.append(wordCell, responseCell, deleteCell);
    wordTableBody.append(row);
  }
  function saveWatchedWords() {
    localStorage.setItem("watchedWords", JSON.stringify(watchedWords));
  }
  function loadWatchedWords() {
    let savedWatchedWords = localStorage.getItem("watchedWords");
    if (savedWatchedWords) {
      watchedWords = JSON.parse(savedWatchedWords);
      watchedWords.forEach(function (watchedWord) {
        addWatchedWord(watchedWord.word, watchedWord.response);
      });
    }
  }
  loadWatchedWords();
  form.on("submit", function (event) {
    event.preventDefault();
    let word = wordInput.val().trim();
    let response = responseInput.val().trim();
    if (word && response) {
      addWatchedWord(word, response);
      saveWatchedWords();
      wordInput.val("");
      responseInput.val("");
    }
  });
//          ||=================================================================================================================================||
//          ||=================================================================================================================================||
//          ||   ______   ______   .__   __.  _______  __    _______  __    __  .______          ___   .___________. __    ______   .__   __.  ||
//          ||  /      | /  __  \  |  \ |  | |   ____||  |  /  _____||  |  |  | |   _  \        /   \  |           ||  |  /  __  \  |  \ |  |  ||
//          || |  ,----'|  |  |  | |   \|  | |  |__   |  | |  |  __  |  |  |  | |  |_)  |      /  ^  \ `---|  |----`|  | |  |  |  | |   \|  |  ||
//          || |  |     |  |  |  | |  . `  | |   __|  |  | |  | |_ | |  |  |  | |      /      /  /_\  \    |  |     |  | |  |  |  | |  . `  |  ||
//          || |  `----.|  `--'  | |  |\   | |  |     |  | |  |__| | |  `--'  | |  |\  \----./  _____  \   |  |     |  | |  `--'  | |  |\   |  ||                               
//          ||  \______| \______/  |__| \__| |__|     |__|  \______|  \______/  | _| `._____/__/     \__\  |__|     |__|  \______/  |__| \__|  ||                               
//          ||=================================================================================================================================||                               
  const client = new tmi.Client({                                                                                                                                           
    options: {                                                                                                                                                              
      debug: false,                                                                                                                                                        
      skipMembership: true,                                         // Ce paramètre permet de ne pas recevoir les messages JOIN/PART
                                                                    // envoyés lorsqu'un utilisateur rejoint ou quitte un canal.   
      skipUpdatingEmotesets: true,                                  // Ce paramètre permet de désactiver la mise à jour automatique des emotes dans les canaux Twitch.                                                                                                      
    },                                                              // Cela peut améliorer les performances du bot en évitant les mises à jour inutiles.                                                                                                                                    
    connection: {  
      reconnect: true,                            
      secure: true,                            
    },                            
    identity: {                         
      username: "USER",                                             // [A MODIFIER]: Entrez votre nom d'utilisateur Twitch                                                      
      password: "oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",             // [A MODIFIER]: Entrez le mot de passe OAuth généré                                                        
                                                                    // 1. aller sur https://twitchapps.com/tmi/                                                                 
                                                                    // 2. Cliquez sur "Connect"                                                                                 
                                                                    // 3. Vous obtiendrez un mot de passe à commencer par "oath..."                                             
                                                                    // 4. Copiez l'ensemble du mot de passe et collez à l'intérieur du 'genereated_oath_password'               
    },                                                              //                                                                                                          
    channels: ["ChannelUser"],                                      // [A MODIFIER]: Entrez le nom du canal que vous souhaitez écouter                                          
  });                                                                                                         
  //============================================================================================================================================================================
  //============================================================================================================================================================================
  client.connect().catch(console.error);
  client.on("message", (channel, tags, message, self) => {
    if (self) return;
    watchedWords.forEach(function (watchedWord) {
      if (new RegExp("\\b" + watchedWord.word + "\\b", "i").test(message)) {
        client.say(channel, watchedWord.response);
      }
    });
  });
});