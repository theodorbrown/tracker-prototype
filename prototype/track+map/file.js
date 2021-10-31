/**
 * Ce prototype est fonctionnel, utilisable sur smarthpone depuis un navigateur en autorisant
 * la localisation.
 * 
 * Inconvénient on peut utiliser l'app seulement quand le navigateur est au premier
 * plan et écran allumé...
 * Les web workers d'Angular peuvent permettre de contourner le problème (je pense).
 * 
 * Pour l'utiliser je l'ai hébergé sur un serveur web dont j'ai access.
 */

////////////////////TRACKER////////////////////
//HTML 5 géolocalisation

let coordinates = [];
let formatedTab = [];
var autoCall;
var toggle = false;
var reloadNeeded = false;

//Lancé quand on appuie sur le premier bouton. Répète la fonction getLocation toute les 30 secondes
function myStartFunction(){
    if(!reloadNeeded){
      //init le tableau à vide
      coordinates = []
      //init de carte

      autoCall = setInterval(getLocation, 30000);
      document.getElementById("message").innerHTML = "Enregistrement en cours";
      toggle = true;
      reloadNeeded = true;
    } else {
      alert("Recharger la page");
    }
}

//Localise l'utilisateur avec GPS si sur smartphone
function getLocation() {
  if (navigator.geolocation) {
    //paramètre haute précision activé à true !
    navigator.geolocation.getCurrentPosition(showPosition, error, {
        enableHighAccuracy: true,
    });
  } else { 
    alert("Navigation introuvable");
  }
}

//fonction de call back pour traiter les résultats
function showPosition(position) {
    coordinates.push(position);
    //console.log(coordinates);
}

//fonction de call back pour les erreurs éventuelles
function error(error){
    alert(error);
}

//Lancée quand on appuie sur le deuxieme bouton. Arrête le setInterval et fait du innnerHTML des coordonnées + précision
function myStopFunction() {
    if(toggle){
      //stop
      clearInterval(autoCall);

      //tableau formaté
      coordinates.forEach( e => {
        formatedTab.push([e.coords.latitude, e.coords.longitude]);
      })

      //update message
      document.getElementById("message").innerHTML = "Fin";

      if(!(formatedTab.length < 2)){
        displayMap();
      } else {
        alert("Erreur, il faut enregistrer au moins deux points");
      }
      toggle = false;
    }else{
      alert("Aucun tracking n'a été lancé")
    }
  }

////////////////////MAP////////////////////

function displayMap() {
  var map = L.map('macarte').setView([48.586537, 6.027384], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);


  var polyline = L.polyline(formatedTab, {color: 'red'}).addTo(map);

  map.fitBounds(polyline.getBounds());
  mapOn = true
}