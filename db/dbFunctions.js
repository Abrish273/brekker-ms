const docClient = require('./Connection')

const GetOneUserById = async function(user_id){
    var params = {
        TableName: `users-${process.env.envtype}`,
        Key:{
            "_id":user_id,
        }
    };
    return await docClient.get(params).promise()
}

const AddOrUpdateUserById = async function(user_id,notifToken,loggedThru,lastLogin, name, email, phone, signInProvider, notifToken, initialMode){
    var params = {
        TableName: "Tasks_Data",
        Item:{
            "_id":user_id,
            "name":name,
            "email":email,
            "phone":phone,
            "signInProvider":signInProvider,  
            "initialMode":initialMode,
            "notifToken":notifToken,
            "lastLogin":lastLogin,
            "loggedThru":loggedThru
        }
    };
    return await docClient.put(params).promise()
}
const Getall = async function(){
    var params = {
        TableName: "Tasks_Data",
    };
    let scanResults = [];
     let items;

     do {
         items = await docClient.scan(params).promise();
         items.Items.forEach((item) => scanResults.push(item));
         params.ExclusiveStartKey = items.LastEvaluatedKey;
     } while (typeof items.LastEvaluatedKey != "undefined");
     return scanResults
}
const AddOrUpdateOneByEmail_id = async function(Email , id , Day , Task){
    var params = {
        TableName: "Tasks_Data",
        Item:{
            "Email":Email,
            "TaskId":id,
            "Day":Day,
            "Task":Task
        }
    };
    return await docClient.put(params).promise()
}
const DeleteOneByEmail_id = async function(Email , id , Day , Task){
    var params = {
        TableName: "Tasks_Data",
        Key :{
            "Email":Email,
            "TaskId":id,
        }
    };
    return await docClient.delete(params).promise()
}
module.exports = {GetOneUserById, AddOrUpdateUserById, DeleteOneByEmail_id, Getall}