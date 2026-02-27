<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TelegramController extends Controller
{
    public function webhook(Request $request)
    {
        $data = $request->all();

        if (!isset($data['message'])) {
            return response()->json(['status' => 'no message']);
        }

        $chatId = $data['message']['chat']['id'];
        $text   = $data['message']['text'] ?? null;

        // Expecting: /start 5
        if ($text && str_starts_with($text, '/start')) {

            $parts = explode(' ', $text);

            if (count($parts) == 2) {

                $userId = $parts[1];
                $user   = User::find($userId);

                if ($user) {
                    $user->telegram_chat_id = $chatId;
                    $user->save();

                    // Confirm to user
                    $this->sendMessage(
                        $chatId,
                        "✅ Telegram connected successfully!\n\nGo to your dashboard:\nhttps://pgmarket.online/dashboard"
                    );
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Send message to specific user
     */
    public function sendTest($userId)
    {
        $user = User::findOrFail($userId);

        if (!$user->telegram_chat_id) {
            return response()->json([
                'error' => 'User has not connected Telegram yet'
            ]);
        }

        $response = $this->sendMessage(
            $user->telegram_chat_id,
            "🔥 Test message from Laravel"
        );

        return $response;
    }
    public function notify_disable()
    {
        $user = User::findOrFail(Auth::user()->id);

        if (!$user->telegram_chat_id) {
            return response()->json([
                'error' => 'User has not connected Telegram yet'
            ]);
        }

        $user->update([
            'telegram_chat_id' => null,
        ]);
        return redirect()->back();
    }

    /**
     * Telegram Send Message Helper
     */
    private function sendMessage($chatId, $message)
    {
        return Http::post(
            "https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN') . "/sendMessage",
            [
                'chat_id' => $chatId,
                'text'    => $message,
            ]
        )->json();
    }
}
