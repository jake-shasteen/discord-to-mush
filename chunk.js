"use strict";

const chunk = (string, chunkSize = 1000) => {
  let index = 0;
  const chunks = [];
  while (index < string.length) {
    chunks.push(string.substring(index, index + chunkSize));
    index += chunkSize;
  }
  return chunks;
};

module.exports = chunk;
