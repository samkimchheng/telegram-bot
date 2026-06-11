import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'dummy_token');

export async function POST(req: NextRequest) {
  try {
    const { employeeCode, telegramId, action, location, method, substituteFor } = await req.json();

    // 1. In a real app we'd insert to DB here.
    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Phnom_Penh' });
    const actionText = action === 'in' ? 'ស្តេមចូល (Check IN)' : 'ស្តេមចេញ (Check OUT)';
    const substituteText = substituteFor ? `\n🔄 ជំនួសឱ្យ (Sub for): ${substituteFor}` : '';
    
    // 2. Send Telegram notifications
    const adminGroupId = process.env.TELEGRAM_CHAT_ID;
    const message = `
🔔 <b>សកម្មភាពវត្តមាន</b>
👤 បុគ្គលិក: ${employeeCode || 'Unknown'}${substituteText}
⏱ ម៉ោង: ${time}
📍 សកម្មភាព: ${actionText}
🔍 វិធីសាស្ត្រ: ${method || 'Unknown'}`;

    if (adminGroupId && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        await bot.telegram.sendMessage(adminGroupId, message, { parse_mode: 'HTML' });
      } catch (err) {
        console.error('Failed to notify admin group', err);
      }
    }

    // 3. DM to employee (if we have their telegramId saved)
    if (telegramId && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        await bot.telegram.sendMessage(telegramId, `✅ ជោគជ័យ! ការកត់ត្រា${actionText}ត្រូវបានបញ្ជាក់នៅម៉ោង ${time}`);
      } catch (err) {
        console.error('Failed to notify employee directly', err);
      }
    }


    return NextResponse.json({ success: true, message: 'Check-in recorded' });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
