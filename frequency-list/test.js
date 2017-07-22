var freqList = {
  'foo': 3,
  'bar': 222,
  'foobar': 13
}

function csv(freqList) {
  this.output = '';
  for (var key in freqList) {
    this.output += key + freqList[key].toString() + '\n';
  }
  console.log(output);
  return this.output;
};

console.log(csv(freqList));
