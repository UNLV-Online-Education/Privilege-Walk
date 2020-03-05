<?php
// USER TABLE 
// SET: check exisitance and insert into table and returns hash
// 		expects:	msg, name, walk_id, avatar_face, avatar_face_color, avatar_hair, avatar_hair_color, avatar_shirt, avatar_accessory
// 		returns:	 ===========================
// 					|{						    |
//                  |	"exist": 0 or 1,	    |
//                  |   "user_id":#,            |
//                  |   "statement_id":#,       |
//                  |   "is_finished": 0 or 1   |
//                  |}                          |
//                   ===========================
// 
// GET: will check if the ip address of the user is already in the database
//      expects:    msg, walk_id, name
//      returns:     =======================================
//                  |{  "student":[{                        |
//                  |       "user_id":#,                    |
//                  |       "name":"xxx",                   |
//                  |       "avatar_face":#,                |
//                  |       "avatar_face_color":#,          |
//                  |       "avatar_hair":#,                |
//                  |       "avatar_hair_color":#,          |
//                  |       "avatar_shirt":#,               |
//                  |       "avatar_accessory":#,           |
//                  |       "response":[-1 or 0 or 1, ... ] |
//                  |    },                                 |
//                  |    {                                  |
//                  |       ...                             |
//                  |    }]                                 |
//                  |}							            |
//                   ======================================= 
// 
// ###################################################################### 
	// DATABASE
	require_once "includes/connect-dedb.php";
	$mysqliDB	= new mysqli($host,$user,$pass,$dedb);
	if ($mysqliDB->connect_errno) {
		echo "There was an error setting up the Privilege Walk activity, please notify your instructor.";
		exit;
    }
    // VARIABLES
    if(!isset($_POST['msg'])) die('ERROR = no msg');
    if(!isset($_POST['walk_id'])) die('ERROR=no walk_id');
    $msg = $_POST['msg'];
    $walk_id = $_POST['walk_id'];
    if(!ctype_digit($walk_id)) die('ERROR=no walk_id');
    $result 	= "";
    // SETTING
    if($msg==='set'){
        if(!isset($_POST['name'])) die('ERROR=no name');
        if(!isset($_POST['avatar_face'])) die('ERROR=no avatar_face');
        if(!isset($_POST['avatar_face_color'])) die('ERROR=no avatar_face_color');
        if(!isset($_POST['avatar_hair'])) die('ERROR=no avatar_hair');
        if(!isset($_POST['avatar_hair_color'])) die('ERROR=no avatar_hair_color');
        if(!isset($_POST['avatar_shirt'])) die('ERROR=no avatar_shirt');
        if(!isset($_POST['avatar_accessory'])) die('ERROR=no avatar_accessory');
        $name = $mysqliDB->real_escape_string($_POST['name']);
        if(strlen($name) > 100 || strlen($name) == 0 ) die('ERROR = name length');
        $avatar_face = $_POST['avatar_face'];
        $avatar_face_color = $_POST['avatar_face_color'];
        $avatar_hair = $_POST['avatar_hair'];
        $avatar_hair_color = $_POST['avatar_hair_color'];
        $avatar_shirt = $_POST['avatar_shirt'];
        $avatar_accessory = $_POST['avatar_accessory'];
        $todaysDate = date("Y-m-d");
        $ip = $_SERVER['REMOTE_ADDR'];
        // SANITIZING
        $avatar_face = preg_replace('/\s+/', '', $avatar_face);
        $avatar_face_color = preg_replace('/\s+/', '', $avatar_face_color);
        $avatar_hair = preg_replace('/\s+/', '', $avatar_hair);
        $avatar_hair_color = preg_replace('/\s+/', '', $avatar_hair_color);
        $avatar_shirt = preg_replace('/\s+/', '', $avatar_shirt);
        $avatar_accessory = preg_replace('/\s+/', '', $avatar_accessory);
        if(!ctype_digit($avatar_face)) die('ERROR= incorrect avatar_face');
        if(!ctype_digit($avatar_face_color)) die('ERROR= incorrect avatar_face_color');
        if(!ctype_digit($avatar_hair)) die('ERROR= incorrect avatar_hair');
        if(!ctype_digit($avatar_hair_color)) die('ERROR= incorrect avatar_hair_color');
        if(!ctype_digit($avatar_shirt)) die('ERROR= incorrect avatar_shirt');
        if(!ctype_digit($avatar_accessory)) die('ERROR= incorrect avatar_accessory');
        $getUser = $mysqliDB->prepare("SELECT `user_id` FROM pwalk_users WHERE `name`=? AND walk_id=?");
        $getUser->bind_param('si', $name, $walk_id);
        $getUser->execute();
        $getUser->store_result();
        if ($getUser->num_rows==1) {
            $getUser->bind_result($user_id);
            $getUser->fetch();
            $result = '{"exist":1,"user_id":"'.$user_id.'"}';
        }
        else{
            $is_finished = 0;
            $insertUser2DB = $mysqliDB->prepare("INSERT INTO pwalk_users (`name`,walk_id,avatar_face,avatar_face_color,avatar_hair,avatar_hair_color,avatar_shirt,avatar_accessory,ip,created_date,is_finished) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            $insertUser2DB->bind_param('siiiiiiissi',$name,$walk_id,$avatar_face,$avatar_face_color,$avatar_hair,$avatar_hair_color,$avatar_shirt,$avatar_accessory,$ip,$todaysDate,$is_finished);
            $insertUser2DB->execute();
            $insertUser2DB->store_result();
            $user_id = $mysqliDB->insert_id;
            $statement_id = 0;
            $result = '{"exist":0, "user_id":'.$user_id.',"statement_id":'.$statement_id.', "is_finished":0}';
            $insertUser2DB->free_result();
            $insertUser2DB->close();
        }
        $getUser->free_result();
        $getUser->close();
    }
    // GETTING
    else if($msg==='get') {
        if(!isset($_POST['name'])) die('ERROR=no name');
        $name = $mysqliDB->real_escape_string($_POST['name']);
        $is_finished = 1;
        $getAUser = $mysqliDB->prepare("SELECT * FROM pwalk_users WHERE walk_id=? AND `name`=? AND is_finished=?");
        $getAUser->bind_param('isi', $walk_id, $name, $is_finished);
        $getAUser->execute();
        $getAUser->store_result();
        if($getAUser->num_rows==0){
            $result='{"exist":0,"students":[]}';
        }
        else{
            $result='{"exist":1,';
            $result=$result.'"students":[';
            $getUsers = $mysqliDB->prepare("SELECT u.user_id, u.name, u.avatar_face, u.avatar_face_color, u.avatar_hair, u.avatar_hair_color, u.avatar_shirt, u.avatar_accessory, r.statement_id, r.response FROM pwalk_users u JOIN pwalk_responses r WHERE u.user_id = r.user_id AND u.walk_id=? AND u.is_finished=? ORDER BY u.user_id, r.statement_id");
            $getUsers->bind_param('ii', $walk_id, $is_finished);
            $getUsers->execute();
            $getUsers->bind_result($user_id,$name,$avatar_face,$avatar_face_color,$avatar_hair,$avatar_hair_color,$avatar_shirt,$avatar_accessory, $statement_id, $response);
            $temp="";
            $aUserID=null;
            while($getUsers->fetch()){
                if($aUserID != $user_id){
                    if($aUserID != null){
                        $temp = substr($temp,0,strlen($temp)-1).']},';
                    }
                    $aUserID = $user_id;
                    $temp = $temp.'{"user_id":"'.$user_id.'","name":"'.$name.'","avatar_face":"'.$avatar_face.'","avatar_face_color":"'.$avatar_face_color.'","avatar_hair":"'.$avatar_hair.'","avatar_hair_color":"'.$avatar_hair_color.'","avatar_shirt":"'.$avatar_shirt.'","avatar_accessory":"'.$avatar_accessory.'","response":[';
                }
                $temp=$temp.$response.',';
            }
            $temp = substr($temp,0,strlen($temp)-1).']}';
            $result=$result.$temp.']}';
            $getUsers->close();
        }
        $getAUser->free_result();
        $getAUser->close();
    }
    echo $result;
?>