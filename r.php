<?php
//Connecting to Redis server on localhost
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

echo "<br>Connection to server sucessfully";

//check whether server is running or not
echo "<br>Server is running: " . $redis->ping();


//set the data in redis string
//$redis->set("tutorial-name", "Redis tutorial");

// Get the stored data and print it
echo "<br>Stored string in redis :: " . $redis->get("tutorial");


//store data in redis list
//$redis->lpush("tutorial-list", "Redis");
//$redis->lpush("tutorial-list", "Mongodb");
//$redis->lpush("tutorial-list", "Mysql");

// Get the stored data and print it
$arList = $redis->lrange("tutorial-list", 0 ,5);

echo "<br><br>Stored string in redis::<br> ";
print_r($arList);

// Get the stored keys and print it
$arList = $redis->keys("*");

echo "<br><br>Stored keys in redis:<br> ";
print_r($arList);