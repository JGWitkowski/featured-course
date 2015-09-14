var mongoose = require('mongoose'),
    Schema = mongoose.Schema();

var courseModel = {
  name: {
    type: String
  },
  difficulty: {
    type: String
  },
  hole: {
    type: String
  }
};

module.exports = mongoose.model('Course', courseModel);