// la methode map
/*let numbers = [1,3,5,2];
let newTab = numbers.map((elt) => elt*2);
console.table(numbers);
console.table(newTab);*/
//La methode filter
/*let number = [1,3,5,2];
let newTabs = number.filter((elt) => { return elt % 2==0});
console.table(number);
console.table(newTabs);

//La methode reduce
let numberS = [1,3,5,2];
let newTabS = numberS.reduce((acc,current) => { return acc + current;},0);
console.table(numberS);
console.table(newTabS);
// Manipulation du DOM
function sayHello(){
    const heading = document.createElement("h1");
    const heading_text = document.createTextNode(" Reussir, c'est refusé d'abandonner");
    heading.appendChild(heading_text);
    document.body.appendChild(heading);
}

  function retrieveElements(){
 let pElts = document.getElementsByTagName('p');
 console.log(pElts);
 for(var i =0; i<pElts.length;i++){
 console.log(pElts[i].innerHTML);
 if(pElts[i].childNodes.length!=0){
 console.log(pElts[i].childNodes.length);
 }
 }
 }
function button(){
let btn = document.getElementById("monButton");
 btn.addEventListener("click", function() {alert("Merci de votre achat")});
}*/

function retrieveCountry(){
 const req = new XMLHttpRequest();
 req.addEventListener("load", function(reponse){
 console.log(reponse);
 });
 req.open("GET", "https://restcountries.com/v3.1/all?fields=name,flags");
 req.send();
 }


 
 




 
 
