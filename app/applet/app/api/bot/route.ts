import { Telegraf } from 'telegraf';
import { NextRequest, NextResponse } from 'next/server';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'dummy_token');

bot.start((ctx) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-b3fikevfcqqe3ksacgl6h5-882327469314.asia-east1.run.app';
  ctx.reply('Welcome to SecureAttend! Open the app below to check in.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Open App', web_app: { url: appUrl } }]
      ]
    }
  });
});

bot.command('link', async (ctx) => {
  const text = ctx.message.text;
  const match = text.match(/\/link\s+(.+)/);
  if (!match) {
    return ctx.reply('Please provide an Employee ID. Example: /link EMP-001');
  }
  const employeeId = match[1].trim().toUpperCase();
  const telegramId = ctx.from.id.toString();

  // In a real app we'd update the database here:
  // await db.query('UPDATE employees SET telegram_id = $1 WHERE employee_code = $2', [telegramId, employeeId]);
  
  ctx.reply(`Successfully linked your Telegram account to Employee ID: ${employeeId}`);
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Bot webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
