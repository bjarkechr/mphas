<?php

class RequestResultModel
{

	//Properties
	public $isSuccess;
	public $resultData;

	function __construct()
	{
		$this->isSuccess = true;
		$this->resultData = '';
	}

	public function handleException($exception)
	{
		$this->isSuccess = false;

		$this->resultData = array(
			'message' => 'Exception occured: ' . $exception->getMessage(),
			'file' => $exception->getFile(),
			'line' => $exception->getLine(),
			'trace' => $exception->getTraceAsString()
			);
	}

	public function handleSuccess($data)
	{
		$this->isSuccess = true;
		$this->resultData = $data;
	}
}