const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendWelcomeEmail(name, email) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_USER}>`,

      to: email,

      subject: "Bem-vindo ao Smart Spend!",

      html: `

                    <h1>Olá, ${name}!</h1>

                    <p>
                        Seja bem-vindo ao Smart Spend.
                    </p>

                    <p>
                        Seu cadastro foi realizado com sucesso.
                    </p>

                    <p>
                        Agora você já pode utilizar a plataforma.
                    </p>

                `,
    });

    console.log("Email enviado:", info.messageId);
  } catch (error) {
    console.error("ERRO EMAIL:", error);

    throw error;
  }
}

module.exports = {
  sendWelcomeEmail,
};
