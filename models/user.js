var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
//CHANGE TO YOUR DATABASE INFO!
var sequelize = new Sequelize('postgres://postgres:12345@localhost:5432/auth-system');

// User Model Schema
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
    //Async convert user password to encrypted hash
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },   
});

//Create class based validpassword function
//Sequelize prototype
User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
      };

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('TABLE CREATED! force==false'))
    .catch(error => console.log('ERROR: ', error));

// export User model for use in other files.
module.exports = User;