import nodemailer from "nodemailer";
import { IEmailService } from "@/shared/interfaces/IEmailService";

export class NodemailerEmailService implements IEmailService {
	private transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: Number(process.env.MAIL_PORT),
		secure: false,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	});

	async sendResetPasswordEmail(
		email: string,
		otp: string,
		expiresAt: Date
	): Promise<void> {
		await this.transporter.sendMail({
			from: '"Sua App" <no-reply@suaapp.com>',
			to: email,
			subject: "Recuperação de senha",
			html: `
				<p>Você solicitou a recuperação de senha.</p>
				<p>Use o código abaixo:</p>
				<h2>${otp}</h2>
				<p>Este código expira em ${expiresAt.toLocaleTimeString()}.</p>
			`,
		});
	}
}
