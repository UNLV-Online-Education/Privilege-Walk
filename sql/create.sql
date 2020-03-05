CREATE TABLE IF NOT EXISTS dbname.pwalk_institutions(
    `institution_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `first_name` VARCHAR(50),
    `last_name` VARCHAR(50),
    `email` VARCHAR(50),
    PRIMARY KEY (institution_id)
);

CREATE TABLE IF NOT EXISTS dbname.pwalk_walks(
    `walk_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `institution_id` INT UNSIGNED NOT NULL,
    `course_prefix` VARCHAR(10) NOT NULL,
    `course_number` VARCHAR(10) NOT NULL,
    `course_section` VARCHAR(10) NOT NULL,
    `course_semester` INT UNSIGNED NOT NULL,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `hash` VARCHAR(64), 
    PRIMARY KEY (walk_id)
);

CREATE TABLE IF NOT EXISTS dbname.pwalk_statements(
    `statement_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `walk_id` INT UNSIGNED NOT NULL, 
    `position` INT UNSIGNED NOT NULL,
    `prompt` VARCHAR(1000) NOT NULL, 
    `direction` INT NOT NULL,
    PRIMARY KEY (statement_id)
);

CREATE TABLE IF NOT EXISTS dbname.pwalk_users(
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `name` VARCHAR(75) NOT NULL, 
    `walk_id` INT UNSIGNED NOT NULL, 
    `avatar_face` INT UNSIGNED NOT NULL, 
    `avatar_face_color` INT UNSIGNED NOT NULL, 
    `avatar_hair` INT UNSIGNED NOT NULL, 
    `avatar_hair_color` INT UNSIGNED NOT NULL, 
    `avatar_shirt` INT UNSIGNED NOT NULL, 
    `avatar_accessory` INT UNSIGNED NOT NULL, 
    `ip` VARCHAR(16) NOT NULL, 
    `created_date` DATE NOT NULL, 
    `is_finished` BOOLEAN NOT NULL, 
    PRIMARY KEY (user_id) 
);
        
CREATE TABLE IF NOT EXISTS dbname.pwalk_responses(
    `response_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL, 
    `statement_id` INT UNSIGNED NOT NULL, 
    `response` INT NOT NULL, 
    PRIMARY KEY (response_id)
);
