const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db');

const cricketer=sequelize.define('cricketer',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    runs: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    century: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fifties: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    wickets: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    photo_link: {
        type: DataTypes.STRING,
        allowNull: true
    },

    date_of_birth: {
        type: DataTypes.DATEONLY, 
        allowNull: true
    },
    birthplace: {
        type: DataTypes.STRING,
        allowNull: true
    },
    career: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    matches: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    average: {
        type: DataTypes.FLOAT(5, 2), 
        defaultValue: 0.0
    }
});

module.exports=cricketer;