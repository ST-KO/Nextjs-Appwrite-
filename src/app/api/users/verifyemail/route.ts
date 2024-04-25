import {connect} from '@/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/userModel';


connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        const user = await User.findOne(
            {
                verifiedToken: token, 
                verifiedTokenExpiry: {$gt: Date.now()}
            }
        );

        if(!user){
            return NextResponse.json({error: "Invalid token"}, {status: 400});
        }

        console.log(user);

        user.isVerified = true;
        user.verifiedToken = undefined;
        user.verifiedTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({message: "Email Verified Successfully", success: true});


    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}