<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

include('library/Config.php');

class DateConverter 
{

    public function convertAll()
    {
        $heatingEntries = $this->loadAllEntries();

        foreach ($heatingEntries as $entry)
        {
            $id = $entry["id"];
            $dateLocal = $entry['readingTsLocal'];
            $dateUtc = $entry['readingTsUtc'];

            $this->updateEntry($id, $dateLocal, $dateUtc);
        }
        
    }

    private function updateEntry($id, $dateLocal, $dateUtc)
    {
        echo "Updating {$id} from " . $dateLocal->format("Y-m-d H:i:s") . " to " . $dateUtc->format('Y-m-d H:i:s') . "<br>";

        $mysqli = DateConverter::connectDb();

        $sql = "UPDATE meter_reading SET meter_reading.reading_ts_utc = ? WHERE meter_reading.id = ?";

        $dateStr = $dateUtc->format('Y-m-d H:i:s');

        $stmt = $mysqli->prepare($sql);
        if ($stmt === false)
            throw new Exception("prepare() failed: " . $mysqli->error);
        
        $bp = $stmt->bind_param("ss", $dateStr, $id);
            
        if ($bp === false)
            throw new Exception("bind_param() failed: " . $stmt->error);

        $res = $stmt->execute();
        
        if ($res === false)
            throw new Exception("excute() failed: " . $stmt->error);
    }

    private function loadAllEntries()
    {
        $mysqli = DateConverter::connectDb();

        $sql = "SELECT id, reading_ts FROM meter_reading ORDER BY reading_ts";

        $stmt = $mysqli->prepare($sql);
        if ($stmt === false)
            throw new Exception("prepare() failed: " . $mysqli->error);

        $res = $stmt->execute();
        
        if ($res === false)
            throw new Exception("excute() failed: " . $stmt->error);
        
        $stmt->bind_result($id, $ts);

        $heatingEntries = array();

        $indx = 0;
        
        while ($stmt->fetch())
        {
            $heatingEntry = array();
            $heatingEntry['id'] = $id;

            $readingTsLocal = new DateTime($ts, new DateTimeZone("Europe/Copenhagen"));
            
            $readingTsUtc = clone $readingTsLocal;

            // Ignore dates where hour, minute and second is 0.
            if ($readingTsLocal->format("His") != "000000")
            {
                $readingTsUtc->setTimezone(new DateTimeZone('UTC'));
            }
            
            // echo $id . ": " 
            // ."Local: " . $readingTsLocal->format('Y-m-d H:i:sP') 
            // ." UTC: " . $readingTsUtc->format('Y-m-d H:i:sP') 
            // ." Format: " . $readingTsLocal->format("His") . '<br>';

            $heatingEntry['readingTsLocal'] = $readingTsLocal;
            $heatingEntry['readingTsUtc'] = $readingTsUtc;

            // $heatingEntry['readingTsRaw'] = $ts;
            // $heatingEntry['readingTs'] = new DateTime($ts, new DateTimeZone("Europe/Copenhagen"));
            // $dkTime = $heatingEntry['readingTs'] = new DateTime($ts, new DateTimeZone("Europe/Copenhagen"));
            // $dkTime->setTimezone(new DateTimeZone('UTC'));
            // $heatingEntry['readingTsUtc'] = $dkTime;

            $heatingEntries[$indx++] = $heatingEntry;
        }

        return $heatingEntries;
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

$converter = new DateConverter();

$converter->convertAll();