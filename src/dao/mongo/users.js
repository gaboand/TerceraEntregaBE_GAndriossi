import { UserModel } from "./models/user.model.js";

export default class UserDB{

    async getUsers() {
        const users = await UserModel.find();
        return users;}

    async getUserById(id) {
        const user = await UserModel.findById(id);
        return user;    
    }

    async createUser(user) {
        const newUser = new UserModel(user);
        const result = await newUser.save();
        return result;
    }       

    async deleteUser(id, user) {    
        const result = await UserModel.findByIdAndDelete(id);
        return result;        
    }
}