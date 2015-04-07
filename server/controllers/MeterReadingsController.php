<?php

class MeterReadingsController extends BaseController
{

	public function getAction($request)
	{
		
		$fromDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/08/2014 00:00:00');
		$toDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/10/2014 00:00:00');

		$requestResultModel = new RequestResultModel();
		try
		{
			$data = array();
			foreach (MeterReadingModel::loadByreadingTs(null, null) as $heatingEntry)
			{
				$readingTsTime = DateTime::createFromFormat('Y-m-d H:i:s', $heatingEntry->readingTs);

				$readingTsArr = array(
					'year' => $readingTsTime->format('Y'),
					'month' => $readingTsTime->format('m'),
					'day' => $readingTsTime->format('d'),
					'hour' => $readingTsTime->format('H'),
					'minute' => $readingTsTime->format('i'),
					'second' => $readingTsTime->format('s'));

				$viewEntry = array(
					'id' => $heatingEntry->id,
					'readingTs' => $readingTsArr,
					'heating' => $heatingEntry->heating,
					'water' => $heatingEntry->water);

				$data[] = $viewEntry;
			}

			$requestResultModel->handleSuccess($data);
		}
		catch (Exception $exception)
		{
			$requestResultModel->handleException($exception);
		}

		return $requestResultModel;
	}

	public function postAction($request)
	{
		$requestResultModel = new RequestResultModel();

		try
		{
			$entry = MeterReadingModel::createFromArray($request->parameters);	

			$entry->save();

			$requestResultModel->handleSuccess(null);
		}
		catch(Exception $exception)
		{
			$requestResultModel->handleException($exception);
		}
		
		return $requestResultModel;
	}

	public function deleteAction($request)
	{
		$requestResultModel = new RequestResultModel();

		if(!isset($request->url_elements[2])) {
            throw new Exception('No entryId given to delete.');
        }

		$entryId = (int)$request->url_elements[2];

		MeterReadingModel::deleteById($entryId);

		try
		{
			

			$requestResultModel->handleSuccess(null);
		}
		catch(Exception $exception)
		{
			$requestResultModel->handleException($exception);
		}
		
		return $requestResultModel;
	}
}