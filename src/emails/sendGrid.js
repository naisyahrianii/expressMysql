const sgMail = require('@sendgrid/mail')
const sgAPIKey = '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'

sgMail.setApiKey(sgAPIKey)

const sendVerify = (username, name, email) => {
    sgMail.send({
        to: email,
        from: 'aimma.riani@gmail.com',
        subject: 'test kirim email',
        html: `<h1><a href='http://localhost:2010/verify?username=${username}'>Klik untuk verifikasi</a></h1>`
    })
}
 
module.exports = {
    sendVerify
}