<?php

class HeatingEntryModel
{

	//Properties
	public $id;
	public $heating;
	public $water;
	public $entryDate;

	function __construct()
	{
		$this->heating = 0;
		$this->water = 0;
		
	}

	public function save()
	{
		$mysqli = HeatingEntryModel::connectDb();

		//If property $id is null, this is a new entry that needs to be inserted.
		if (is_null($this->id))
		{

			$sql = 'INSERT INTO heating_entry (entry_date, heating, water) VALUES (?, ?, ?)';

			$stmt = $mysqli->prepare($sql);

			if ($stmt === false)
				throw new Exception("prepare() failed: " . $mysqli->error);

			$bp = $stmt->bind_param("sdd", $this->entryDate, $this->heating, $this->water);

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
		if (!array_key_exists('entryDate', $array) || !array_key_exists('heating', $array) || !array_key_exists('water', $array))
			throw new Exception("Invalid data given in createFromArray.");

		$entryDateArr = $array['entryDate'];

		if (!is_array($entryDateArr))
			throw new Exception("Invalid entryDate - not an array.");

		if (!array_key_exists('year', $entryDateArr)
			|| !array_key_exists('month', $entryDateArr)
			|| !array_key_exists('day', $entryDateArr)
			|| !array_key_exists('hour', $entryDateArr)
			|| !array_key_exists('minute', $entryDateArr)
			|| !array_key_exists('second', $entryDateArr))
			throw new Exception("Invalid entryDate - not all required keys given.");

		$entry = new HeatingEntryModel();

		$entry->entryDate = $entryDateArr['year'] .'-'
		.$entryDateArr['month'] .'-'
		.$entryDateArr['day'] .' '
		.$entryDateArr['hour'] .':'
		.$entryDateArr['minute'] .':'
		.$entryDateArr['second'];

		$entry->heating = $array['heating'];
		$entry->water = $array['water'];

		return $entry;
	}

	public static function loadByEntryDate($fromDate, $toDate)
	{
		$mysqli = HeatingEntryModel::connectDb();

		$heatingEntries = array();

		$sql = "SELECT * FROM heating_entry";
		$fromDateStr = '';
		$toDateStr = '';
		
		if (!is_null($fromDate) && !is_null($toDate))
		{
			$sql .= " WHERE entry_date BETWEEN ? AND ?";
			$fromDateStr = $fromDate->format('Y-m-d H:i:s');
			$toDateStr = $toDate->format('Y-m-d H:i:s');
		}
		elseif (!is_null($fromDate)) 
		{
			$sql .= " WHERE entry_date >= ?";
			$fromDateStr = $fromDate->format('Y-m-d H:i:s');
		}
		elseif (!is_null($toDate)) 
		{
			$sql .= " WHERE entry_date <= ?";
			$toDateStr = $toDate->format('Y-m-d H:i:s');
		}

		$sql .= " ORDER BY entry_date";
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
			$heatingEntry = new HeatingEntryModel();
			$heatingEntry->id = $row["id"];
			$heatingEntry->heating = $row["heating"];
			$heatingEntry->water = $row["water"];
			$heatingEntry->entryDate = $row["entry_date"];

			$heatingEntries[$indx++] = $heatingEntry;
		}

		$stmt->close();

		return $heatingEntries;
	}

	public static function loadById($id)
	{
		return new HeatingEntryModel();
	}

	public static function deleteById($id)
	{
		$mysqli = HeatingEntryModel::connectDb();

		$sql = 'DELETE FROM heating_entry WHERE id = ?';

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