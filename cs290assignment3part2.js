/*CS290 Assignment 3 Part 2
Gerald*/
var urlSource;
var totalNumbers = 0;
var pageNumber = 0;
var numberOfPagesToDisplay = 1;
var searchPython = false;
var searchJSON = false;
var searchJavaScript = false;
var searchSQL = false;
var searchHTML = false;
var searchCSS = false;

/*Handle the number of pages selected*/
function HandleSelection(selection) {
  numberOfPagesToDisplay = selection.options[selection.selectedIndex].value;
};

/*Handle check bock input on site for Python*/
function ClickedPython(box) {
  if (box.checked == true) {
    searchPython = true;
  } else {
    searchPython = false;
  }
};

/*Handle check bock input on site for JSON*/
function ClickedJSON(box) {
  if (box.checked == true) {
    searchJSON = true;
  } else {
    searchJSON = false;
  }
};

/*Handle check bock input on site for JavaScript*/
function ClickedJavaScript(box) {
  if (box.checked == true) {
    searchJavaScript = true;
  } else {
    searchJavaScript = false;
  }
};

/*Handle check bock input on site for SQL*/
function ClickedSQL(box) {
  if (box.checked == true) {
    searchSQL = true;
  } else {
    searchSQL = false;
  }
};

/*Handle check bock input on site for HTML*/
function ClickedHTML(box) {
  if (box.checked == true) {
    searchHTML = true;
  } else {
    searchHTML = false;
  }
};

/*Handle check bock input on site for CSS*/
function ClickedCSS(box) {
  if (box.checked == true) {
    searchCSS = true;
  } else {
    searchCSS = false;
  }
};

/*Method to clears the old list of sites before new search*/
function ClearList(){
  var resultsList = document.getElementById("resultsDiv");
  while (resultsList.hasChildNodes()) {
    resultsList.removeChild(resultsList.firstChild);
  }
};

/*Reset number counts to for accurate listied of results*/
function SetNumberCountToZero(){
  totalNumbers = 0;
  pageNumber = 0;
};

/*Method loops to get the right number of gists*/
function GetNumberOfPagesToDisplay(){
  for (var i = 0; i < numberOfPagesToDisplay; i++) {
    urlSource = "https://api.github.com/gists?page=" + i + "&per_page=30";
    GetGistSearchResults(); 
  }
}

/*Manages the ordered calls to run after the search button is clicked*/
function SearchButtonResults() {
  ClearList();
  SetNumberCountToZero();
  GetNumberOfPagesToDisplay();
};

/*Does the heavy lifting sending/receiving xml data from github
This method also parses the results before readable formatting*/
function GetGistSearchResults() {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  }
  else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET", urlSource);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      pageNumber = pageNumber + 1;
      document.getElementById("resultsDiv").innerHTML += "<p>" + "Page: " + pageNumber + "</p>";
      var results = JSON.parse(xmlhttp.responseText);
      totalNumbers = totalNumbers + results.length;
      document.getElementById("resultsDiv").innerHTML += "<p>" + "Number of files: " + totalNumbers + "</p>";
      for (var i = 0; i < results.length; i++) {
        var files = results[i].files;
        for (var j in files) {
          if (searchPython == true && files[j].language == "Python") {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
          if (searchJSON == true && files[j].language == "JSON") {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
          if (searchJavaScript == true && files[j].language == "JavaScript") {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
          if (searchSQL == true && files[j].language == "SQL") {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
          if (searchHTML == true && files[j].language == "HTML") {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
          if (searchCSS == true && files[j].language == "CSS") {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
          if (searchPython == false && searchJSON == false && searchJavaScript == false && searchSQL == false && searchHTML == false && searchCSS == false) {
            FormatResults(results[i].html_url, results[i].description, files[j].filename, files[j].language);
          }
        }
      }
    }
  }
};

/*Formats parsed string for the display on the website. Conatins HTML code for scripting*/
function FormatResults(html_url, description, filename, language) {
  var formattedString = "<p><input type='checkbox'/> Add/Remove to Favorites " +
              "<a href = '" +
              html_url +
              "'>"
              + "Link: " + html_url +
              "   Description: " + description +
              "   Filename: " + filename +
              "   Language: " + language +
              "</a></p>";
  var isAlreadyInFavorites = false;
  var doc = document.getElementById("favoritesDiv");

  for (var k = 0; k < doc.childNodes.length; k++) {
    var testString = new XMLSerializer().serializeToString(doc.childNodes[k]);
    if (testString.includes(hmtl_url)==true) {
      isAlreadyInFavorites = true;
      break;
    }
  }
  if (isAlreadyInFavorites == false) {
    document.getElementById("resultsDiv").innerHTML += formattedString;
  }
};

/*Adds selected results to the favoritesDiv - removes them from results list*/
function AddToFavorites() {
  var doc = document.getElementById("resultsDiv");
  var numberOfElements = doc.childNodes.length;
  var isChecked;
  var output;
  var outputString;

  for (var x = 0; x < numberOfElements; x++) {
    isChecked = doc.childNodes[x].childNodes[0].checked;
    if (isChecked == true) {
      output = doc.childNodes[x];
      var outputString = new XMLSerializer().serializeToString(output);
      if (typeof (Storage) !== "undefined") {
        var tempFavorites = localStorage.getItem("favorites");
        if (tempFavorites == null) {
          tempFavorites = outputString;
        } else {
          var tempStringHolder = tempFavorites;
          tempFavorites = tempStringHolder + outputString;
         }
        localStorage.setItem("favorites", tempFavorites);
        document.getElementById("favoritesDiv").innerHTML = localStorage.getItem("favorites");
      } else {
        document.getElementById("favoritesDiv").innerHTML += outputString;
      }
    }
  }
  RemoveFromResults();
};

/*Removes checked item in the favoritesDiv*/
function RemoveFromResults() {
  var doc = document.getElementById("resultsDiv");
  var isChecked;
  var setExit = false;

  while (doc.hasChildNodes() && setExit == false) {
    for (var x = 0; x < doc.childNodes.length; x++) {

      isChecked = doc.childNodes[x].childNodes[0].checked;
      if (isChecked == true) {
        doc.removeChild(doc.childNodes[x]);
        setExit = false;
        break;
      } else {
        setExit = true;
      }
    }
  }
};

/*Remove item from fravorites list thile favoritvesDiv contains items - uses local storage*/
function RemoveFromFavorites() {
  var doc = document.getElementById("favoritesDiv");
  var isChecked;
  var setExit = false;

  while (doc.hasChildNodes() && setExit == false) {
    for (var x = 0; x < doc.childNodes.length; x++) {
      isChecked = doc.childNodes[x].childNodes[0].checked;
      if (isChecked == true) {
        doc.removeChild(doc.childNodes[x]);
        setExit = false;
        break;
      } else {
        setExit = true;
      }
    }
  }

  localStorage.clear();
  var tempFavString = "EmptyString";

  for (var y = 0; y < doc.childNodes.length; y++) {
    var output = new XMLSerializer().serializeToString(doc.childNodes[y]);
    tempFavString = tempFavString + output;
    tempFavString = tempFavoriteString.replace("EmptyString", "");
  }
  localStorage.setItem("favorites", tempFavString);
};

/*Fills favoriites list using local storage*/
function FillFavorites() {
  if (typeof (Storage) !== "undefined") {
    var storedString = localStorage.getItem("favorites");
    document.getElementById("favoritesDiv").innerHTML = storedString;
  }
};

/*Remove all favorite listings by clearing local storage*/
function RemoveAllFromFavorites() {
  var favoritesList = document.getElementById("favoritesDiv");
  while (favoritesList.hasChildNodes()) {
    favoritesList.removeChild(favoritesList.firstChild);
  }
  if (typeof (Storage) !== "undefined") {
    localStorage.clear();
  }
};