function dateFormat(timestamp) {
  timestampString = timestamp.toString();
  return timestampString.substring(4, 21);
}

module.exports = dateFormat;
