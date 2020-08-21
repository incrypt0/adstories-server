function getRandomNumber(start = 1, end = 10) {
  //works when both start and end are >=1
  return (parseInt(Math.random() * end) % (end - start + 1)) + start;
}
var promise = new Promise((resolve, reject) => {
  let randomNumberOfSeconds = getRandomNumber(2, 6);
  setTimeout(() => {
    let randomiseResolving = getRandomNumber(1, 10);
    if (randomiseResolving > 5) {
      resolve({
        randomNumberOfSeconds: randomNumberOfSeconds,
        randomiseResolving: randomiseResolving,
      });
    } else {
      reject({
        randomNumberOfSeconds: randomNumberOfSeconds,
        randomiseResolving: randomiseResolving,
      });
    }
  }, randomNumberOfSeconds * 1000);
});
promise.then((val) => {
  console.log("completed promise");
  console.log("value is :" + val);
});
console.log("1");
