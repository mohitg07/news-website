let preferences = [];

let str = document.getElementById("interests").value;

// here I am adding toggle classes to my preference divs so that it will blur-unblur my div and hide-unhide my checked-icon
if(str !== ""){
  delimiter=","   // comma but you can set any character here.
  preferences = str.split(delimiter);

  for(i=0; i<preferences.length; ++i){
      console.log(preferences);
      $("#" + preferences[i] + " .preference-top-div").toggleClass("blur-unblur");
      $("#" + preferences[i] + " .preference-bottom-div").toggleClass("blur-unblur");
      $("#" + preferences[i] + " .checked-icon").toggleClass("hide-unhide");
  }
}

// in this, basically I am creating preferences array according to the interests chosen by the user
function searchInArray(key){
   var index = preferences.indexOf(key);

   if(index === -1){
     preferences.push(key);
   }else{
     // splice function is used to remove elements from array
     preferences.splice(index, 1);
   }
}

// I have used jquery for the below code
$("#entertainment").click(function() {
    $("#entertainment .preference-top-div").toggleClass("blur-unblur");
    $("#entertainment .preference-bottom-div").toggleClass("blur-unblur");
    $("#entertainment .checked-icon").toggleClass("hide-unhide");

    searchInArray("entertainment");
});

$("#business").click(function() {
    $("#business .preference-top-div").toggleClass("blur-unblur");
    $("#business .preference-bottom-div").toggleClass("blur-unblur");
    $("#business .checked-icon").toggleClass("hide-unhide");

    searchInArray("business");
});

$("#health").click(function() {
    $("#health .preference-top-div").toggleClass("blur-unblur");
    $("#health .preference-bottom-div").toggleClass("blur-unblur");
    $("#health .checked-icon").toggleClass("hide-unhide");

    searchInArray("health");
});

$("#science").click(function() {
    $("#science .preference-top-div").toggleClass("blur-unblur");
    $("#science .preference-bottom-div").toggleClass("blur-unblur");
    $("#science .checked-icon").toggleClass("hide-unhide");

    searchInArray("science");
});

$("#sports").click(function() {
    $("#sports .preference-top-div").toggleClass("blur-unblur");
    $("#sports .preference-bottom-div").toggleClass("blur-unblur");
    $("#sports .checked-icon").toggleClass("hide-unhide");

    searchInArray("sports");
});

$("#technology").click(function() {
    $("#technology .preference-top-div").toggleClass("blur-unblur");
    $("#technology .preference-bottom-div").toggleClass("blur-unblur");
    $("#technology .checked-icon").toggleClass("hide-unhide");

    searchInArray("technology");
});

document.getElementById("btn").addEventListener("click", function () {
    document.getElementById("interests").innerHTML = preferences;
});
