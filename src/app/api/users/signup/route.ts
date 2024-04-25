import {connect} from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);

        //Check if user already exists
        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashPassword
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        //Send Verification Email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

        return NextResponse.json(
            {
                message: "User Created Successfully", 
                success: true, 
                savedUser
            });

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}