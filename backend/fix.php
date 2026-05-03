<?php
$f = 'database/seeders/DatabaseSeeder.php';
$content = file_get_contents($f);
$content = preg_replace_callback('/\'image_url\' => \'(.*?)\'/', function($m) {
    return '\'image_url\' => \'' . str_replace('\'', '\\\'', $m[1]) . '\'';
}, $content);
file_put_contents($f, $content);
