<?php

// $my_date = DateTime::createFromFormat(DateTime::ATOM, $readingTsStr, new DateTimeZone("UTC"));

$my_date = DateTime::createFromFormat(DateTime::ATOM, "2017-04-22T22:19:10Z");


$my_date->setTimezone(new DateTimeZone('Europe/Copenhagen'));

echo($my_date->format(DateTime::ATOM) . '<br>');

$my_date->setTimezone(new DateTimeZone('UTC'));

echo($my_date->format(DateTime::ATOM) . '<br>');