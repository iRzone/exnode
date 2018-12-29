var Sequelize = require('sequelize');
var sequelize = require('../lib/db');
// const Corp = require('./Corp');
// const Agent = require('./Agent');
const Model = sequelize.define('corpuser', {
    id:{
        type: Sequelize.INTEGER,  
        allowNull: false,  
        autoIncrement: true,  
        primaryKey: true
    },
    depId: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    userName: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    mobile: {
        type: Sequelize.STRING(30),
    },
    sex: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        allowNull: false,
    },
    duty: {
        type: Sequelize.STRING(30),
    },
    loginFlag: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        allowNull: false,
    },
    loginName: {
        type: Sequelize.STRING(30),
    },
    loginPwd: {
        type: Sequelize.STRING(60),
    },
    role: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
        allowNull: false,
    },
    openId:{
        type: Sequelize.STRING(30),
    },
    lastTime:{
        type: Sequelize.DATE,
    },
     agentId:{
      type: Sequelize.STRING(30),
  },    
}, {
    freezeTableName: true,
    tableName: 'sys_corp_user',
    timestamps: true,
    paranoid: true,
});

// Model.belongsTo(Corp)
// Model.belongsTo(Agent)
module.exports = Model