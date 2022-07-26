exports.userCreateMailTemplate = (data) =>{
    var mailBody = "";
    mailBody += '<div style="background-color:#000; margin-bottom:150px;">';
    mailBody += '<div style="margin-top:150px;">';
    mailBody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
    mailBody += 'Olá {name},';
    mailBody += '</p>';
    mailBody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
    mailBody += 'Sua conta foi criada com sucesso!';
    mailBody += '</p>';
    mailBody += '<p style="color:#fff;margin-top:50px;">';
    mailBody += 'Seu login é o seu email: {email}';
    mailBody += '</p>';
    mailBody += '<p style="color:#fff;margin-top:50px;">';
    mailBody += 'Sexo: {gender}';
    mailBody += '</p>';
    mailBody += '</div>';
    mailBody += '</div>';
    mailBody = mailBody.replace('{name}', data.name);
    mailBody = mailBody.replace('{email}', data.email);
    mailBody = mailBody.replace('{gender}', data.gender);   
    
    return mailBody;
}


