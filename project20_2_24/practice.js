const listOfDicts = [
  { key1: 'value1', key2: 'value2', key3: 'value3','data':'data1' }
];

// console.log(listOfDicts);



// const list1 = [1, 2, 3, 4, 5, 32, 12, 12, 32, 43, 53, 31, 9];

// listOfDicts.map(i => console.log(i));


const values = listOfDicts.map(dict=>dict.data);
console.log(values.join(""))