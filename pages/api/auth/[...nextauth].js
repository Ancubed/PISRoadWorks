import * as bcrypt from 'bcrypt'

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from '../../../lib/mongoose';
import UserModel from '../../../models/User';

async function getUser(credentials) {
    if (!credentials 
        || !credentials.username 
        || !credentials.password) throw new Error('Email или пароль не переданы');
    await dbConnect();
    let user = await UserModel.findOne({
        email: credentials.username
    });
    return user && await bcrypt.compare(credentials.password, user.password) 
    ? {
        id: user._id.toString(),
        name: user.name,
        company: user.company,
        role: user.role
    } 
    : null;
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Email", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    let user = await getUser(credentials);
                    if (!user) throw new Error('Неверный email или пароль.');
                    return user;
                }
                catch (err) {
                    console.error(err);
                    return null
                }
            }
        })
    ],
    secret: process.env.jwtSecret,
});