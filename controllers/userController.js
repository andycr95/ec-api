const userCtrl = {}
const User = require('../models/user')
const escapeRegex = require('../utils/regex-escape');
const jwt = require('jsonwebtoken');
const { parseJWt } = require('../utils/jwt');


userCtrl.getUsers = async (req, res, next) => {
    const token = req.headers['authorization'].substring(7);
    const decoded =  parseJWt(token)
    if (!token || decoded === null) return res.status(401).json({auth: false,message: 'Unauthorized, token is required'})
    try {
        const searchQuery = req.query.search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const resPerPage = 5; // results per page
        const page = req.query.page || 1; // Page 
        const resp = [];
        const users = await User.find(searchQuery === null || searchQuery === undefined ? {} : {$or: [{name: { $regex : regex} }, {email: { $regex : regex} }, {phoneNumber: { $regex : regex} } ]}).skip((resPerPage * page) - resPerPage).limit(resPerPage).sort({ '_id': -1 });
        const num = await User.countDocuments(searchQuery === null || searchQuery === undefined ? {} : {$or: [{name: { $regex : regex} }, {email: { $regex : regex} }, {phoneNumber: { $regex : regex} } ]});
        for (let i = 0; i < users.length; i++) {
            const u = users[i];
            resp.push({
                _id: u._id,
                name: u.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
                email: u.email,
                typeUser: u.typeUser,
                phoneNumber : u.phoneNumber
            });
        }
        res.status(200).json({
            data: resp,
            total: num,
            limit: resPerPage,
            totalPages: Math.ceil(num / resPerPage),
            page: page
        });
    } catch (error) {
        next(error)
    }
}

userCtrl.getUser = async (req, res, next) => {
    const token = req.headers['authorization'].substring(7);
    const decoded =  parseJWt(token)
    if (!token || decoded === null) return res.status(401).json({auth: false,message: 'Unauthorized, token is required'})
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}

userCtrl.signIn = async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        res.status(400).json({
            auth: false,
            message: 'Not user found'
        });
    } else {
        // Match password´s user
        const match = await user.matchPassword(password);
        if(match) {
            const token = jwt.sign({id: user._id, typeUser: user.typeUser}, 'shhhhh', {
                expiresIn: 60 * 10
            });
            const us = {
                _id: user._id,
                name: user.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
                email: user.email
            }
            res.status(200).json({
                auth: true,
                message: 'User logged',
                user: us,
                token
            });
        } else {
            res.status(400).json({
                auth: false,
                message: 'Incorrect password'
            });
        }
    }
};

userCtrl.createUser = async (req, res, next) => {
    const token = req.headers['authorization'].substring(7);
    const decoded =  parseJWt(token)
    if (!token || decoded === null) return res.status(401).json({auth: false,message: 'Unauthorized, token is required'})
    if (decoded.typeUser !== 'admin') return res.status(401).json({auth: false,message: 'You are unauthorized for this action'})
    const { body: user } = req
    const email = await User.findOne({email: user.email});
    if (email) res.status(409).json({error: 'Bad Request', statusCode: 409, message: 'This email is already in use.', });
    else{
        try {
            const us = new User({
                name : user.name,
                email : user.email,
                password : user.password, 
                typeUser: user.typeUser,
                phoneNumber : user.phoneNumber, 
            });
            us.password = await us.encriptPassword(user.password);
            const resUs = await us.save();
            const okUs = {
                _id: resUs._id,
                name: resUs.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
                email: resUs.email,
                typeUser: resUs.typeUser,
                phoneNumber : resUs.phoneNumber, 
            }
            const token = jwt.sign({id: resUs._id}, 'shhhhh');
            res.status(201).json({
                message: 'User created',
                user: okUs,
                token
            });
        } catch (error) {
            next(error);
        }
    }
}

userCtrl.updateUser = async (req, res, next) => {
    const token = req.headers['authorization'].substring(7);
    const decoded =  parseJWt(token)
    if (!token || decoded === null) return res.status(401).json({auth: false,message: 'Unauthorized, token is required'})
    if (decoded.typeUser !== 'admin') return res.status(401).json({auth: false,message: 'You are unauthorized for this action'})
    const { id } = req.params
    const user = req.body
    const Byid = await User.findById(id);
    if (!Byid) res.status(409).json({error: 'Bad Request', statusCode: 400, message: 'This user does not exist.', });
    else{
        try {
            const resp = await User.findByIdAndUpdate(id, { $set: user }, { new: true })
            const okUs = {
                _id: resp._id,
                name: resp.name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
                email: resp.email,
                typeUser: resp.typeUser,
                phoneNumber : resp.phoneNumber, 
            }
            res.status(200).json({
                user: okUs,
                message: 'User updated'
            })
        } catch (error) {
            next(error);
        }
    }
}

userCtrl.deleteUser = async (req, res) => {
    const token = req.headers['authorization'].substring(7);
    const decoded =  parseJWt(token)
    if (!token || decoded === null) return res.status(401).json({auth: false,message: 'Unauthorized, token is required'})
    if (decoded.typeUser !== 'admin') return res.status(401).json({auth: false,message: 'You are unauthorized for this action'})
    const { id } = req.params
    const Byid = await User.findById(id);
    if (!Byid) res.status(409).json({error: 'Bad Request', statusCode: 400, message: 'This user does not exist.', });
    else{
        try {
            await User.findByIdAndRemove(id)
            res.status(200).json({
                message: 'User deleted'
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = userCtrl