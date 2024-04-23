import sgMail from '@sendgrid/mail';

const { SENDGRID_API_KEY } = process.env;


sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {

    const email = { ...data, from: "igorpilaev27@gmail.com" }
    await sgMail.send(email).then(() => console.log("Success")).catch(e => console.log(e.message))
    return true
}