
const nodemailer = require("nodemailer");
export const nodemailerService = {
async send(confirmationCode:string, emailToSend:string){
try {
    const transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: "robersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.comrobersargsyan2023@gmail.com",
            user: "robersargsyan2023@gmail.com",
            pass: "vqcubthqzapwnboe",
        },
    });

    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <robersargsyan2023@gmail.com>', // sender address
        to: emailToSend, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `Hello world?`, // plain text body
        html: ` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>
`, // html body
    });
    return true
}catch (err:any){
    console.error('Ошибка в отправке писем: ',err.body.responseCode)
    return false
}

}
}