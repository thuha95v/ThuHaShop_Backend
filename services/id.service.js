const uniqid = require('uniqid'); 


const generateId = () => {
  return uniqid()
}

module.exports = { generateId }