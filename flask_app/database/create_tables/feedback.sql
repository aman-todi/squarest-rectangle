CREATE TABLE IF NOT EXISTS `feedback` (
`comment_id`           int(11)       NOT NULL  AUTO_INCREMENT	COMMENT 'the primary key / unique identifier for each comment.',
`name`                 varchar(100)  NOT NULL					COMMENT 'the commentators name',
`email`                varchar(256)  NOT NULL					COMMENT 'the commentators email',
`comment`              varchar(500)  NOT NULL					COMMENT 'The text of the comment',
PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Feedback for my website";