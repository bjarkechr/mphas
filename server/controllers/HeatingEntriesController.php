<?php

class HeatingEntriesController extends BaseController
{

	public function getAction($request)
	{
		
		$fromDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/08/2014 00:00:00');
		$toDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/10/2014 00:00:00');

		$requestResultModel = new RequestResultModel();
		try
		{
			$data = array();
			foreach (HeatingEntryModel::loadByEntryDate(null, null) as $heatingEntry)
			{
				$entryDateTime = DateTime::createFromFormat('Y-m-d H:i:s', $heatingEntry->entryDate);

				$entryDateArr = array(
					'year' => $entryDateTime->format('Y'),
					'month' => $entryDateTime->format('m'),
					'day' => $entryDateTime->format('d'),
					'hour' => $entryDateTime->format('H'),
					'minute' => $entryDateTime->format('i'),
					'second' => $entryDateTime->format('s'));

				$viewEntry = array(
					'id' => $heatingEntry->id,
					'entryDate' => $entryDateArr,
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
			$entry = HeatingEntryModel::createFromArray($request->parameters);	

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

		HeatingEntryModel::deleteById($entryId);

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