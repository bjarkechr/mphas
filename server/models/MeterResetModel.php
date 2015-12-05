<?php

class MeterResetModel
{

	//Properties
	public $id;
	public $heatingReset;
    public $heatingValueReset;
	public $waterReset;
    public $waterValueReset;
	public $resetTs;

	function __construct()
	{
		$this->heatingReset = 0;
		$this->heatingValueReset = 0;
		$this->waterReset = 0;
		$this->waterValueReset = 0;		
	}

	public function save()
	{
		$mysqli = MeterResetModel::connectDb();

		//If property $id is null, this is a new entry that needs to be inserted.
		if (is_null($this->id))
		{

			$sql = 'INSERT INTO meter_reset (reset_ts, heating_reset, heating_value_reset, water_reset, water_value_reset) VALUES (?, ?, ?, ?, ?)';

			$stmt = $mysqli->prepare($sql);

			if ($stmt === false)
				throw new Exception("prepare() failed: " . $mysqli->error);

			$bp = $stmt->bind_param("sdd", $this->resetTs, $this->heatingReset, $this->heatingValueReset, $this->waterReset, $this->waterValueReset);

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
		if (!array_key_exists('resetTs', $array) || !array_key_exists('heatingReset', $array) 
            || !array_key_exists('heatingValueReset', $array) || !array_key_exists('waterReset', $array) 
            || !array_key_exists('waterValueReset', $array))
			throw new Exception("Invalid data given in createFromArray.");

		$resetTsArr = $array['resetTs'];

		if (!is_array($resetTsArr))
			throw new Exception("Invalid resetTs - not an array.");

		if (!array_key_exists('year', $resetTsArr)
			|| !array_key_exists('month', $resetTsArr)
			|| !array_key_exists('day', $resetTsArr)
			|| !array_key_exists('hour', $resetTsArr)
			|| !array_key_exists('minute', $resetTsArr)
			|| !array_key_exists('second', $resetTsArr))
			throw new Exception("Invalid resetTs - not all required keys given.");

		$entry = new MeterResetModel();

		$entry->resetTs = $resetTsArr['year'] .'-'
		.$resetTsArr['month'] .'-'
		.$resetTsArr['day'] .' '
		.$resetTsArr['hour'] .':'
		.$resetTsArr['minute'] .':'
		.$resetTsArr['second'];

		$entry->heatingReset = $array['heatingReset'];
        $entry->heatingValueReset = $array['heatingValueReset'];
		$entry->waterReset = $array['waterReset'];
        $entry->waterValueReset = $array['waterValueReset'];

		return $entry;
	}

	public static function loadByResetTs($fromDate, $toDate)
	{
		$mysqli = MeterResetModel::connectDb();

		$resetEntries = array();

		$sql = "SELECT * FROM meter_reset";
		$fromDateStr = '';
		$toDateStr = '';
		
		if (!is_null($fromDate) && !is_null($toDate))
		{
			$sql .= " WHERE reset_ts BETWEEN ? AND ?";
			$fromDateStr = $fromDate->format('Y-m-d H:i:s');
			$toDateStr = $toDate->format('Y-m-d H:i:s');
		}
		elseif (!is_null($fromDate)) 
		{
			$sql .= " WHERE reset_ts >= ?";
			$fromDateStr = $fromDate->format('Y-m-d H:i:s');
		}
		elseif (!is_null($toDate)) 
		{
			$sql .= " WHERE reset_ts <= ?";
			$toDateStr = $toDate->format('Y-m-d H:i:s');
		}

		$sql .= " ORDER BY reset_ts";
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

		$result = $stmt->get_result();

		$indx = 0;

		while ($row = $result->fetch_assoc()) {
			$resetEntry = new MeterReadingModel();
			$resetEntry->id = $row["id"];
			$resetEntry->heatingReset = $row["heating_reset"];
            $resetEntry->heatingValueReset = $row["heating_value_reset"];
			$resetEntry->waterReset = $row["water_reset"];
            $resetEntry->waterValueReset = $row["water_value_reset"];
			$resetEntry->resetTs = $row["reset_ts"];

			$resetEntries[$indx++] = $resetEntry;
		}

		$stmt->close();

		return $resetEntries;
	}

	public static function deleteById($id)
	{
		$mysqli = MeterResetModel::connectDb();

		$sql = 'DELETE FROM meter_reset WHERE id = ?';

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