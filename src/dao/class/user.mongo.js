import usersModel from "../models/users.model.js";
import mongoose from "mongoose";

export default class User {
    constructor (){};

    getUsers= async()=>{
        return await usersModel.find()
    }

    getUserById = async(id)=>{
        try {
            return await usersModel.findOne({_id:new mongoose.Types.ObjectId(id)})
        } catch (error) {
            return {error:'No hay usuario para ese ID'}
        }
    }

    createUser = async(user)=>{
        return await usersModel.create(user)
    }

    updateUser = async (idParam, userUpdate)=>{
        try {
            await usersModel.updateOne({_id: new mongoose.Types.ObjectId(idParam)}, userUpdate)
            return {status:200, message:'Success', userUpdate}
        } catch (error) {
            return {error:'No existe usuario'}
        }
        
    }

    deleteUser = async(id)=>{
        try {
            await usersModel.deleteOne({_id: new mongoose.Types.ObjectId(id)})
            return {status:'Success', message:'Usuario eliminado'}
        } catch (error) {
            return {error:'No existe usuario'}
        } 
        
    }
}