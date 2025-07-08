import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();
  const { name, email, phone, date, time, message } = body;

  const adminHtml = `
    <h2>Nuova Prenotazione</h2>
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefono:</strong> ${phone}</p>
    <p><strong>Data:</strong> ${date}</p>
    <p><strong>Orario:</strong> ${time}</p>
    <p><strong>Messaggio:</strong> ${message || '-'}</p>
    <a href="https://marestelle.com/login" style="display:inline-block;margin-top:16px;padding:12px 20px;background:#2563eb;color:white;border-radius:8px;text-decoration:none;">Accedi per gestire la prenotazione</a>
  `;

  const clientHtml = `
    <h2>Grazie per la tua prenotazione, ${name}!</h2>
    <p>Abbiamo ricevuto la tua richiesta per il ${date} (${time}).</p>
    <p>Ti contatteremo a breve per confermare la disponibilità.</p>
    <p>— Lo staff di Marestelle</p>
  `;

  try {
    // Send to admin
    await resend.emails.send({
      from: 'Prenotazioni Marestelle <noreply@marestelle.com>',
      to: ['info@marestelle.com'],
      subject: `📩 Nuova prenotazione da ${name}`,
      html: adminHtml,
    });

    // Send to client
    await resend.emails.send({
      from: 'Marestelle <noreply@marestelle.com>',
      to: [email],
      subject: 'Abbiamo ricevuto la tua prenotazione',
      html: clientHtml,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
