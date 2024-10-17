<?php
// Carregar o .env
require 'vendor/autoload.php'; // Ajuste o caminho conforme necessário

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$secretKey = $_ENV['SECRET_KEY'];

// Verifique se a chave secreta foi fornecida
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $key = $_SERVER['HTTP_X_SECRET_KEY'] ?? '';

    if ($key !== $secretKey) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }

    // Chame o seu script de deploy
    $output = shell_exec('bash /home/airsof45/deploy.sh 2>&1');
    echo json_encode(['output' => $output]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
