<?php
declare(strict_types=1);

$recipient = 'tyson@ctecreative.com';
$redirectPath = 'contact.php';

session_start();

function redirect_with_status(string $status, array $fields = []): void
{
    global $redirectPath;

    $query = ['status' => $status];
    foreach ($fields as $key => $value) {
        $query[$key] = $value;
    }

    header('Location: ' . $redirectPath . '?' . http_build_query($query));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $redirectPath);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$honeypot = trim((string) ($_POST['company'] ?? ''));
$requestedRedirect = trim((string) ($_POST['redirect'] ?? ''));

if ($requestedRedirect !== '') {
    $redirectPath = basename($requestedRedirect);
}

if ($honeypot !== '') {
    redirect_with_status('success');
}

$formValues = [
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
];

if ($name === '' || $subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['contact_values'] = $formValues;
    redirect_with_status('invalid');
}

$safeName = preg_replace('/[\r\n]+/', ' ', $name) ?? $name;
$safeSubject = preg_replace('/[\r\n]+/', ' ', $subject) ?? $subject;
$safeEmail = filter_var($email, FILTER_SANITIZE_EMAIL) ?: $email;

$mailSubject = 'PODTrackerPRO Contact: ' . $safeSubject;
$mailBody = "New contact form submission\n\n"
    . "Name: {$safeName}\n"
    . "Email: {$safeEmail}\n"
    . "Subject: {$safeSubject}\n\n"
    . "Message:\n{$message}\n";

$headers = [
    'From: PODTrackerPRO <no-reply@podtrackerpro.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($recipient, $mailSubject, $mailBody, implode("\r\n", $headers));

if (!$sent) {
    $_SESSION['contact_values'] = $formValues;
    redirect_with_status('error');
}

unset($_SESSION['contact_values']);

redirect_with_status('success');
