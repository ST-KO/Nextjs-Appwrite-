import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email, emailType, userId}: any) =>{
    try{
        //Create a hashed token
        const hashToken = await bcryptjs.hash(userId.toString(), 10);

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, 
                {
                    verifiedToken: hashToken, 
                    verifiedTokenExpiry: Date.now() + 3600000,
                }
            );
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {
                    forgotPasswordToken: hashToken, 
                    forgotPasswordTokenExpiry: Date.now() + 3600000,
                }
            );
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "205617d1775d74",
              pass: "215773c872794e"
            }
          });

        const mailOptions = {
            from: 'siko@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: 
            `
                <p>
                    Click 
                    <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}">
                    here
                    </a> 
                    to ${emailType === 'VERIFY' ? "verify your email" : "reset your password"}
                    or copy and paste the link below in your browser. 
                    <br />
                    ${process.env.DOMAIN}/verifyemail?token=${hashToken}
                </p>
            `
        }

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;
    }catch(err: any){
        throw new Error(err.message);
    }
};   