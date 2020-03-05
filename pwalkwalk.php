<?php
// COURSE TABLE 
// SET: check exisitance and insert into table and returns hash
// 		expects:	course_prefix, course_number, course_section, course_semester
// 		returns:	 =======================
// 					|{						|
// 					|	"exist": 0 or 1,	|
// 					|	"walk_id": #,  	|
// 					|	"hash": "hash" 		|
// 					|}						|
// 					=======================
// 
// GET: check existance and gets course information
// 		expects:	hashURL
// 		returns:	 =======================
// 					|{						|
// 					|	"exist": 0 or 1,	|     
//                  |   "walk_id": #  		|
// 					|}						|
// 					 =======================
// 
// ###################################################################### 
	// DATABASE
	require_once "includes/connect-dedb.php";
	$mysqliDB	= new mysqli($host,$user,$pass,$dedb);
	if ($mysqliDB->connect_errno) {
		echo "There was an error setting up the Privilege Walk activity, please notify your instructor.";
		exit;
	}
	// ACCESS TYPE
	if(!isset($_POST['msg'])) die('ERROR = no msg');
	$msg = $_POST['msg'];
	// VARIABLES
	$result = "";
	// SET
	if ($msg==="set"){
        // SETTINGS
        $secret_key = 'bananas';
        $secret_iv = 'apples';
        $encrypt_method = "AES-256-CBC";
        $key = hash( 'sha256', $secret_key );
		$iv = substr( hash( 'sha256', $secret_iv ), 0, 16 );
		// VARIABLES
		if(!isset($_POST['institution'])) die('ERROR = no institution');
        if(!isset($_POST['prefix'])) die('ERROR = no prefix');
		if(!isset($_POST['number'])) die('ERROR = no number');
		if(!isset($_POST['section'])) die('ERROR = no section');
		if(!isset($_POST['semester'])) die('ERROR = no semester');
		$name = $_POST['institution'];
		$course_prefix = $_POST['prefix'];
		$course_number = $_POST['number'];
		$course_section = $_POST['section'];
		$course_semester = $_POST['semester'];
		// SANITIZING
		$name = $mysqliDB->real_escape_string($name);
		$course_prefix = $mysqliDB->real_escape_string($course_prefix);
		$course_number = $mysqliDB->real_escape_string($course_number);
		$course_section = $mysqliDB->real_escape_string($course_section);
		$course_semester = $mysqliDB->real_escape_string($course_semester);
		if(strlen($name) > 100 || strlen($name) == 0 ) die('ERROR = name length');
		if(strlen($course_prefix) > 10 || strlen($name) == 0) die('ERROR = prefix length');
		if(strlen($course_number) > 10 || strlen($course_prefix) == 0) die('ERROR = number length');
		if(strlen($course_section) > 10 || strlen($course_section) == 0) die('ERROR = section length');
		if(strlen($course_semester) > 4 || strlen($course_semester) == 0) die('ERROR = strm length');
		if(!ctype_digit($course_semester)) die('ERROR=no course_semester');
		//
		$getInstitution = $mysqliDB->prepare("SELECT institution_id FROM pwalk_institutions WHERE `name`=?");
		$getInstitution->bind_param('s', $name);
		$getInstitution->execute();
		$getInstitution->store_result();
		$getInstitution->bind_result($institution_id);
		if($getInstitution->num_rows==0){
			$insertInstitution = $mysqliDB->prepare("INSERT INTO pwalk_institutions (`name`) VALUES (?)");
			$insertInstitution->bind_param('s', $name);
			$insertInstitution->execute();
			$institution_id=$mysqliDB->insert_id;
			$insertInstitution->close();
		}
		else{
			$getInstitution->fetch();
		}
		$getInstitution->free_result();
		$getInstitution->close();
		$insertCourse = $mysqliDB->prepare("INSERT INTO pwalk_walks (institution_id,course_prefix,course_number,course_section,course_semester) VALUES (?,?,?,?,?)");
		$insertCourse->bind_param('isssi', $institution_id, $course_prefix, $course_number, $course_section, $course_semester);
		$insertCourse->execute();
		$walk_id=$mysqliDB->insert_id;
		$hash = base64_encode( openssl_encrypt( $walk_id, $encrypt_method, $key, 0, $iv ) );
		$updateDB = $mysqliDB->prepare("UPDATE pwalk_walks SET hash=? WHERE walk_id=?");
        $updateDB->bind_param('si', $hash, $walk_id);
        $updateDB->execute();
        $updateDB->close();
		$insertCourse->close();
		$result='{"walk_id":'.$walk_id.',"hash":"'.$hash.'","message":"course created"}';
	}
	// GET
	if($msg==="get"){
		// VARIABLE
		if(!isset($_POST['hash'])) die('ERROR = no hash');
		$hash = $_POST['hash'];
		if(strlen($hash) > 64 || strlen($hash) == 0) die('ERROR = hash length');
		// SANITIZE
		$hash = preg_replace('/\s+/', '', $hash);
		if ( !preg_match("/^[a-zA-Z0-9]+[a-zA-Z0-9]+([a-zA-Z0-9]|=|==)$/", $hash )) $result='{"exists":0,"message":"course does not exists"}';
		else{
			// Check existance
			$getWalk = $mysqliDB->prepare("SELECT walk_id FROM pwalk_walks WHERE hash=?");
			$getWalk->bind_param('s', $hash);
			$getWalk->execute();
			$getWalk->store_result();
			$getWalk->bind_result($walk_id);
			if ($getWalk->num_rows==1) {
				$getWalk->fetch();
				$result='{"exists":1,"walk_id": "'.$walk_id.'"}';
			} 
			else{
				$result='{"exists":0,"message":"course does not exists"}';
			}
			$getWalk->free_result();
			$getWalk->close();
		}
	}
	echo $result;
?>