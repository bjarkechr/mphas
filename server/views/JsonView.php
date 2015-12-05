<?php

class JsonView extends ApiView {
	public function render($requestResult) {
        header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json; charset=utf8');

		if ($requestResult->isSuccess === true)

            header($_SERVER["SERVER_PROTOCOL"]." 200 OK"); 
		else
			header($_SERVER["SERVER_PROTOCOL"]." 500 Internal Server Error"); 

		echo(")]}',\n");
		echo json_encode($requestResult->resultData);
		return true;
	}
}