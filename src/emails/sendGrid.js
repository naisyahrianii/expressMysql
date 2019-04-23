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