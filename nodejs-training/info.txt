const express = require('express');
const router = express.Router();
const fs = require('fs') ;
const filePath = 'C:/Users/Aditi/Desktop/NodeJs Training/data.json';

// sends all user data 
router.get('/users', (req, res, next) => {
    try{
        let data = getUserData();
        res.send(data) ;
    }catch(error){
        res.status(404).send(error) ;
    }
})

// finds the user with corresponding id orelse returns user not found
router.get('/user', (req, res, next) => {
    try{
        let data = getUserData() ;
        selectedUser = data.find( user => user.name === String(req.body.name));
        if(selectedUser){
            res.status(200).send(selectedUser) ;
        }else{
            throw new Error('User Not Found') ;
        }
    }catch(error){
        res.status(404).send(error) ;
    }
})

// updates the user with new data  
router.put('/user/:id', (req, res, next) => {
    try{
        const id = req.params.id ;
        const dataToUpdate = req.body ;
        const data = getUserData() ;
        const selectedUser = data.find(user => user.id === Number(id))
        if(selectedUser){
            updatedData = data.filter(user => user.id !== Number(id)) ;
            updatedData.push(dataToUpdate) ;
            saveUserData(updatedData) ;
            res.status(200).send({msg : "User updated in Json"})
        }else{
            throw new Error('User Not Found') ;
        }
    }catch(error){
        res.status(404).send(error) ;
    }
})

// deletes an existing user
router.delete('/user/:id', (req, res, next) => {
    try{
        const id = req.params.id ;
        const data = getUserData() ;
        const userToDelete = data.find(user => user.id === Number(id))
        if(userToDelete){
            updatedData = data.filter(user => user.id !== Number(id))
            saveUserData(updatedData);
            res.status(200).send({ msg : "User Deleted"})
        }else{
            throw new Error('User Not Found') ;
        }
    }catch(error){
        res.status(404).send(error) ;
    }
})

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data, null, 2) //converting the js object into json string
    fs.writeFileSync(filePath, stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync(filePath)
    return JSON.parse(jsonData)    
}

module.exports = router ;