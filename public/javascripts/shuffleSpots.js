var spotArr = new Array(spots.length);
var idx = 0;
for (let spot of spots){
  spotArr[idx++] = spot;
}
var currentIndex = spotArr.length,  randomIndex ;
while (0 !== currentIndex) {
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex--;
  [spotArr[currentIndex], spotArr[randomIndex]] = [spotArr[randomIndex], spotArr[currentIndex]];
} 
