<?php
// File: services/WhatsAppService.php

class WhatsAppService {
    private static $token = "TOKEN_API_WHATSAPP_ANDA";
    private static $apiUrl = "https://api.fonnte.com/send"; // Contoh provider

    public static function send($targetNomor, $pesan) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => self::$apiUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => array(
                'target' => $targetNomor,
                'message' => $pesan,
            ),
            CURLOPT_HTTPHEADER => array(
                "Authorization: " . self::$token
            ),
        ));

        $response = curl_exec($curl);
        
        if (curl_errno($curl)) {
            $error_msg = curl_error($curl);
            curl_close($curl);
            return ["status" => false, "error" => $error_msg];
        }
        
        curl_close($curl);
        return json_decode($response, true);
    }
}
?>