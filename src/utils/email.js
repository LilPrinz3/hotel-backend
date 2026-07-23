import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendBookingConfirmationEmail = async (booking) => {
  try {

    await resend.emails.send({
      from: "Hotel Booking <onboarding@resend.dev>",
      to: booking.email,
      subject: "Booking Confirmation",
      html: `
        <h2>Booking Confirmed</h2>

        <p>Hello ${booking.name},</p>

        <p>Your booking for 
        <strong>${booking.roomName}</strong> has been confirmed.</p>

        <p>
        Check-in: ${booking.checkIn}
        </p>

        <p>
        Check-out: ${booking.checkOut}
        </p>

        <p>
        Thank you for choosing our hotel.
        </p>
      `,
    });


    await resend.emails.send({
      from: "Hotel Booking <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "New Booking Received",
      html: `
        <h2>New Booking Received</h2>

        <p>
        Guest: ${booking.name}
        </p>

        <p>
        Email: ${booking.email}
        </p>

        <p>
        Room: ${booking.roomName}
        </p>

        <p>
        Check-in: ${booking.checkIn}
        </p>

        <p>
        Check-out: ${booking.checkOut}
        </p>
      `,
    });


    console.log("Booking emails sent");

  } catch(error){
    console.log("Booking email error:", error.message);
  }
};



export const sendCancellationEmail = async (booking) => {

  try {

    await resend.emails.send({
      from: "Hotel Booking <onboarding@resend.dev>",
      to: booking.email,
      subject: "Booking Cancelled",
      html: `
        <h2>Booking Cancelled</h2>

        <p>Hello ${booking.name},</p>

        <p>
        We are sorry to inform you that your booking for 
        <strong>${booking.roomName}</strong> has been cancelled.
        </p>

        <p>
        This cancellation was due to technical issues.
        </p>

        <p>
        We will process your refund or contact you with
        available alternative dates.
        </p>

        <p>
        Thank you for your understanding.
        </p>
      `,
    });


    await resend.emails.send({
      from: "Hotel Booking <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "Booking Cancellation",
      html: `
        <h2>Booking Cancelled</h2>

        <p>
        ${booking.name} cancelled booking.
        </p>

        <p>
        Room: ${booking.roomName}
        </p>

        <p>
        Email: ${booking.email}
        </p>
      `,
    });


    console.log("Cancellation emails sent");

  } catch(error){
    console.log("Cancellation email error:", error.message);
  }

};