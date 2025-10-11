
const otpEmailFormate = (otp) => {

    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Your OTP</title>
    <style>
      /* Inline-friendly, minimal styles */
      body { margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background:#ffffff; color:#111; }
      .container { width:100%; max-width:600px; margin:24px auto; padding:24px; border:1px solid #e6e6e6; }
      .header { text-align:left; padding-bottom:12px; border-bottom:1px solid #eee; }
      .title { font-size:20px; font-weight:700; margin:0 0 6px; }
      .subtitle { margin:0; font-size:13px; color:#444; }
      .body { padding:22px 0; }
      .otp-box { display:inline-block; padding:18px 26px; font-size:28px; letter-spacing:6px; font-weight:700; border:2px solid #000; background:#fff; }
      .text { margin-top:16px; font-size:14px; color:#222; line-height:1.4; }
      .muted { color:#666; font-size:12px; margin-top:12px; }
      .footer { margin-top:22px; border-top:1px solid #eee; padding-top:12px; font-size:12px; color:#666; }
      .btn { display:inline-block; margin-top:14px; padding:10px 16px; text-decoration:none; border:1px solid #000; color:#000; font-weight:600; font-size:13px; }
      @media (max-width:420px){ .otp-box{ font-size:22px; padding:14px 18px; } .container{ padding:16px; } }
    </style>
  </head>
  <body>
    <div class="container" role="article" aria-label="One time password">
     <img src="cid:brandlogo" alt="Logo" style="width: 80px; margin-bottom: 20px;">
      <div class="header">
        <p class="title">Your One-Time Password</p>
        <p class="subtitle">Use this code to complete your action</p>
      </div>

      <div class="body">
        <div style="margin-bottom:8px; font-size:14px; color:#222;">
          Hello,
        </div>

        <div style="margin:12px 0;">
          <span class="otp-box">${otp}</span>
        </div>

        <div class="text">
          Enter this code where requested. The code is valid for <strong>10 minutes</strong>.
        </div>

        <a class="btn" href="#" onclick="return false;">Verify Now</a>

        <div class="muted">
          If you didn't request this code, you can ignore this email.
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} VIHAAN Classes. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;

    return html;
};


export default otpEmailFormate ;
