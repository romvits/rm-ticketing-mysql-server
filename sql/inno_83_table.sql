USE ticketing_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `innoTable`;
CREATE TABLE `innoTable` (
	`TableID`				varchar(32) NOT NULL COMMENT 'unique id of the table',

	`TableLocationID`       varchar(32) NULL COMMENT 'unique id of the location that table belongs to if NULL this table belongs to a event',
	`TableEventID`          varchar(32) NULL COMMENT 'unique id of the event that table belongs to',
	`TableFloorID`			varchar(32) NOT NULL COMMENT 'unique id of the floor that table belongs to',
	`TableRoomID`			varchar(32) NOT NULL COMMENT 'unique id of the room that table belongs to',

	`TableNumber`			int(6) NULL COMMENT 'number',
	`TableName`				varchar(100) NULL COMMENT 'name internal description',
	`TableLabel` 			varchar(100) NULL COMMENT 'label can be tokenized (eg §§TABLE or §§LOUGE)',
	`TableSettings`			json NULL COMMENT 'settings for this table (could be a canvas or svg object)',

	FOREIGN KEY Table_LocationID (`TableLocationID`) REFERENCES innoLocation(`LocationID`),
	FOREIGN KEY Table_EventID (`TableEventID`) REFERENCES innoEvent(`EventID`),
	FOREIGN KEY Table_FloorID (`TableFloorID`) REFERENCES innoFloor(`FloorID`),
	FOREIGN KEY Table_RoomID (`TableRoomID`) REFERENCES innoRoom(`RoomID`),
	PRIMARY KEY (`TableID`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

SET FOREIGN_KEY_CHECKS = 1;
