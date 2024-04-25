import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { error } from 'console';
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        //Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400});
        }

        //Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json({error: "Invalid Password"}, {status: 400});
        }

        //Create Token data
        const tokenData =  {
            id: user._id,
            username: user.username,
            email: user.email
        }

        //Create Token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"});
        
        const response = NextResponse.json({message: "Login Successfully", success: true});
        response.cookies.set("token", token, {httpOnly: true});

        return response;

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500})
    }
}