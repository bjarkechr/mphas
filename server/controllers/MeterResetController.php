<?php

class MeterResetController extends BaseController
{

	public function getAction($request)
	{
		
		$fromDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/08/2014 00:00:00');
		$toDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/10/2014 00:00:00');

		$requestResultModel = new RequestResultModel();
		try
		{
			$data = array();
			foreach (MeterResetModel::loadByResetTs(null, null) as $resetEntry)
			{
				$resetTsTime = DateTime::createFromFormat('Y-m-d H:i:s', $resetEntry->resetTs);

				$resetTsArr = array(
					'year' => $resetTsTime->format('Y'),
					'month' => $resetTsTime->format('m'),
					'day' => $resetTsTime->format('d'),
					'hour' => $resetTsTime->format('H'),
					'minute' => $resetTsTime->format('i'),
					'second' => $resetTsTime->format('s'));

				$viewEntry = array(
					'id' => $resetEntry->id,
					'resetTs' => $resetTsArr,
					'heatingReset' => $resetEntry->heatingReset,
                    'heatingValueReset' => $resetEntry->heatingValueReset,
					'waterReset' => $resetEntry->waterReset,
                    'waterValueReset' => $resetEntry->waterValueReset);

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
			$entry = MeterResetModel::createFromArray($request->parameters);	

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

		MeterResetModel::deleteById($entryId);

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