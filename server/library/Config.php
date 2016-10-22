<?php

class Config
{
	protected static $config = array();

    private function __construct() {} // make this private so we can't instanciate

    public static function set($key, $val)
    {
    	self::$config[$key] = $val;
    }

    public static function get($key)
    {
    	return self::$config[$key];
    }
}

Config::set("db_host", "localhost");
Config::set("db_db_name", "bjarbckn_mphas");
Config::set("db_username", "bjarbckn_mphas");
Config::set("db_password", "mphas4Life");