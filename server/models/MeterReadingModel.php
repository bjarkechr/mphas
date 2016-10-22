<?php

class MeterReadingModel
{
    
    //Properties
    public $id;
    public $heating;
    public $water;
    public $readingTs;
    
    function __construct()
    {
        $this->heating = 0;
        $this->water = 0;
        
    }
    
    public function save()
    {
        $mysqli = MeterReadingModel::connectDb();
        
        //If property $id is null, this is a new entry that needs to be inserted.
        if (is_null($this->id))
        {
            
            $sql = 'INSERT INTO meter_reading (reading_ts, heating, water) VALUES (?, ?, ?)';
            
            $stmt = $mysqli->prepare($sql);
            
            if ($stmt === false)
                throw new Exception("prepare() failed: " . $mysqli->error);
            
            $bp = $stmt->bind_param("sdd", $this->readingTs, $this->heating, $this->water);
            
            if ($bp === false)
                throw new Exception("bind_param() failed: " . $stmt->error);
            
            $res = $stmt->execute();
            
            if ($res === false)
                throw new Exception("execute() failed: " . $stmt->error);
            
            $stmt->close();
        }
    }
    
    public static function createFromArray($array)
    {
        if (!array_key_exists('readingTs', $array) || !array_key_exists('heating', $array) || !array_key_exists('water', $array))
            throw new Exception("Invalid data given in createFromArray.");
        
        $readingTsArr = $array['readingTs'];
        
        if (!is_array($readingTsArr))
            throw new Exception("Invalid readingTs - not an array.");
        
        if (!array_key_exists('year', $readingTsArr)
            || !array_key_exists('month', $readingTsArr)
        || !array_key_exists('day', $readingTsArr)
        || !array_key_exists('hour', $readingTsArr)
        || !array_key_exists('minute', $readingTsArr)
        || !array_key_exists('second', $readingTsArr))
        throw new Exception("Invalid readingTs - not all required keys given.");
        
        $entry = new MeterReadingModel();
        
        $entry->readingTs = $readingTsArr['year'] .'-'
        .$readingTsArr['month'] .'-'
        .$readingTsArr['day'] .' '
        .$readingTsArr['hour'] .':'
        .$readingTsArr['minute'] .':'
        .$readingTsArr['second'];
        
        $entry->heating = $array['heating'];
        $entry->water = $array['water'];
        
        return $entry;
    }
    
    public static function loadByreadingTs($fromDate, $toDate)
    {
        $mysqli = MeterReadingModel::connectDb();
        
        $heatingEntries = array();
        
        $sql = "SELECT id, reading_ts, heating, water FROM meter_reading";
        $fromDateStr = '';
        $toDateStr = '';
        
        if (!is_null($fromDate) && !is_null($toDate))
        {
            $sql .= " WHERE reading_ts BETWEEN ? AND ?";
            $fromDateStr = $fromDate->format('Y-m-d H:i:s');
            $toDateStr = $toDate->format('Y-m-d H:i:s');
        }
        elseif (!is_null($fromDate))
        {
            $sql .= " WHERE reading_ts >= ?";
            $fromDateStr = $fromDate->format('Y-m-d H:i:s');
        }
        elseif (!is_null($toDate))
        {
            $sql .= " WHERE reading_ts <= ?";
            $toDateStr = $toDate->format('Y-m-d H:i:s');
        }
        
        $sql .= " ORDER BY reading_ts";
        $stmt = $mysqli->prepare($sql);
        
        if ($stmt === false)
            throw new Exception("prepare() failed: " . $mysqli->error);
        
        
        if (!is_null($fromDate) && !is_null($toDate))
        {
            $bp = $stmt->bind_param("ss", $fromDateStr, $toDateStr);
            
            if ($bp === false)
                throw new Exception("bind_param() failed: " . $stmt->error);
        }
        elseif (!is_null($fromDate))
        {
            $bp = $stmt->bind_param("s", $fromDateStr);
            
            if ($bp === false)
                throw new Exception("bind_param() failed: " . $stmt->error);
        }
        elseif (!is_null($toDate))
        {
            $bp = $stmt->bind_param("s", $toDateStr);
            
            if ($bp === false)
                throw new Exception("bind_param() failed: " . $stmt->error);
        }
        
        $res = $stmt->execute();
        
        if ($res === false)
            throw new Exception("excute() failed: " . $stmt->error);
        
        $stmt->bind_result($id, $ts, $heating, $water);
        
        $indx = 0;
        
        while ($stmt->fetch())
        {
            $heatingEntry = new MeterReadingModel();
            $heatingEntry->id = $id;
            $heatingEntry->heating = $heating;
            $heatingEntry->water = $water;
            $heatingEntry->readingTs = $ts;
            
            $heatingEntries[$indx++] = $heatingEntry;
        }
        
        $stmt->close();
        
        return $heatingEntries;
    }
    
    public static function loadById($id)
    {
        return new MeterReadingModel();
    }
    
    public static function deleteById($id)
    {
        $mysqli = MeterReadingModel::connectDb();
        
        $sql = 'DELETE FROM meter_reading WHERE id = ?';
        
        $stmt = $mysqli->prepare($sql);
        
        if ($stmt === false)
            throw new Exception("prepare() failed: " . $mysqli->error);
        
        $bp = $stmt->bind_param("i", $id);
        
        if ($bp === false)
            throw new Exception("bind_param() failed: " . $stmt->error);
        
        $res = $stmt->execute();
        
        if ($res === false)
            throw new Exception("execute() failed: " . $stmt->error);
        
        $stmt->close();
    }
    
    private static function connectDb()
    {
        $mysqli = new mysqli(Config::get("db_host"), Config::get("db_username"), Config::get("db_password"), Config::get("db_db_name"));
        
        if ($mysqli->connect_errno) {
            throw new Exception("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
        }
        
        return $mysqli;
    }
}