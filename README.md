# Privilege Walk

Privilege walk is an online activity which provides an anonymous / safe way to explore the different experiences of privilege. The default "Walk" uses questions that relate to cultural, economic, social determiners of privilege. The default questions may be used or they can be customized to address different topics.

## System Requirements

- A PHP enabled web server 5.4.16 (others will work but have not been tested)
- MySQL server 5.6.43 (others will work but have not been tested)

## Installation

1. Place the files in the web root of your php-enabled web server.
2. Prepare the database tables. A starting schema for the database tables which will hold the privilege walk data is in the file `sql/create.sql`. Update the name of the database you will use for the privilege walk tables by replacing the word `dbname` with the name of your database.
3. Configure the db connection by copying the file `includes/connect-dedb.config.example.php` to a new file called `includes/connect-dedb.php`. Fill in the host, username, password, and database name for your mysql server. The database name should match what you entered in the `create.sql` file in step 2.

## Using the Privilege Walk Generator

Access the privilage walk generator by entering the following URL:
`https://www.yourdomain.edu/path/to/privilagewalk/generator/`

The generator lets you decide which questions to include in the privilege walk acitivity or write your own custom questions. Each time you finish using the generator you will get a unique pair of links to give to your participants so they can first complete the questionnaire, then view their responses in context of their classmates.

Each semester you should generate a new link for your class, or for each section of the class, so that the activity will start fresh for the class and not be full of the prior classes answers. You can create as many privilege walks using the generator as you like.
