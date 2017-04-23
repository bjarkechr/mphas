<?php

class MeterReadingsNewController extends BaseController
{

	private function prepareMeterReadingForResponse($heatingEntry)
    {
        return array(
            'id' => $heatingEntry->id,
            'readingTs' => $heatingEntry->readingTs->format(DateTime::ATOM),
            'heating' => $heatingEntry->heating,
            'water' => $heatingEntry->water);
    }

    public function optionsAction($request)
    {
        $requestResultModel = new RequestResultModel();
        $requestResultModel->handleSuccess(null);
        return $requestResultModel;
    }

    public function getAction($request)
    {        
        // $fromDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/08/2014 00:00:00');
        // $toDate = DateTime::createFromFormat('d/m/Y H:i:s', '01/10/2014 00:00:00');

        $requestResultModel = new RequestResultModel();
        try
        {
            $data = array();

            foreach (MeterReadingNewModel::loadByreadingTs(null, null) as $heatingEntry)
            {
                $viewEntry = $this->prepareMeterReadingForResponse($heatingEntry);

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
            $entry = MeterReadingNewModel::createFromArray($request->parameters);    

            $entry->save();

            $requestResultModel->handleSuccess($this->prepareMeterReadingForResponse($entry));
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

        MeterReadingNewModel::deleteById($entryId);

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