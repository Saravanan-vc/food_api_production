const mailoptions = (email,code) => ({
    from: 'v.saravanan.c@gmail.com',
    to: email,
    subject: "forget password email",
    text: `code:${code}`,
    html: `<p>Your reset code is: <b>${code}</b></p>`
});

module.exports = mailoptions;