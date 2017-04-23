<?php

class MeterReadingNewModel
{
    
    //Properties
    public $id;
    public $heating;
    public $water;
    public $readingTs;

    //Constants
    const MYSQL_DATE_FORMAT = 'Y-m-d H:i:s';
    
    function __construct()
    {
        $this->heating = 0;
        $this->water = 0;
    }

    public function save()
    {
        $mysqli = MeterReadingNewModel::connectDb();
        
        //If property $id is null, this is a new entry that needs to be inserted.
        if (is_null($this->id))
        {
            $sql = 'INSERT INTO meter_reading (reading_ts, heating, water) VALUES (?, ?, ?)';
            
            $stmt = $mysqli->prepare($sql);
            
            if ($stmt === false)
                throw new Exception("prepare() failed: " . $mysqli->error);

            $readingTsStr = $this->readingTs->format(self::MYSQL_DATE_FORMAT);
            
            $bp = $stmt->bind_param("sdd", $readingTsStr, $this->heating, $this->water);
            
            if ($bp === false)
                throw new Exception("bind_param() failed: " . $stmt->error);
            
            $res = $stmt->execute();
            
            if ($res === false)
                throw new Exception("execute() failed: " . $stmt->error);
            
            // Save newly created ID of reading.
            $this->id = $mysqli->insert_id;

            $stmt->close();
        }
    }
    
    public static function createFromArray($array)
    {
        if (!array_key_exists('readingTs', $array) || !array_key_exists('heating', $array) || !array_key_exists('water', $array))
            throw new Exception("Invalid data given in createFromArray.");
        
        $readingTsStr = $array['readingTs'];

        // Convert string representation of date to actual php date.
        $readingTs = DateTime::createFromFormat(DateTime::ATOM, $readingTsStr);
        $readingTs->setTimezone(new DateTimeZone('UTC'));
        
        $entry = new MeterReadingNewModel();
        
        $entry->readingTs = $readingTs;
        $entry->heating = $array['heating'];
        $entry->water = $array['water'];
        
        return $entry;
    }
    
    public static function loadByreadingTs($fromDate, $toDate)
    {
        $mysqli = MeterReadingNewModel::connectDb();
        
        $heatingEntries = array();
        
        $sql = "SELECT id, reading_ts, heating, water FROM meter_reading";
        $fromDateStr = '';
        $toDateStr = '';
        
        if (!is_null($fromDate) && !is_null($toDate))
        {
            $sql .= " WHERE reading_ts BETWEEN ? AND ?";
            $fromDateStr = $fromDate->format(self::MYSQL_DATE_FORMAT);
            $toDateStr = $toDate->format(self::MYSQL_DATE_FORMAT);
        }
        elseif (!is_null($fromDate))
        {
            $sql .= " WHERE reading_ts >= ?";
            $fromDateStr = $fromDate->format(self::MYSQL_DATE_FORMAT);
        }
        elseif (!is_null($toDate))
        {
            $sql .= " WHERE reading_ts <= ?";
            $toDateStr = $toDate->format(self::MYSQL_DATE_FORMAT);
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
            $heatingEntry = new MeterReadingNewModel();
            $heatingEntry->id = $id;
            $heatingEntry->heating = $heating;
            $heatingEntry->water = $water;
            $heatingEntry->readingTs = DateTime::createFromFormat(self::MYSQL_DATE_FORMAT, $ts, new DateTimeZone("UTC"));
            
            $heatingEntries[$indx++] = $heatingEntry;
        }
        
        $stmt->close();
        
        return $heatingEntries;
    }
    
    public static function deleteById($id)
    {
        $mysqli = MeterReadingNewModel::connectDb();
        
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