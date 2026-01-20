CREATE TABLE `contentItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionId` int NOT NULL,
	`iconName` varchar(50) NOT NULL,
	`titleKo` varchar(200) NOT NULL,
	`titleZh` varchar(200) NOT NULL,
	`titleEn` varchar(200) NOT NULL,
	`contentKo` text NOT NULL,
	`contentZh` text NOT NULL,
	`contentEn` text NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentSections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionType` enum('personal','corporate') NOT NULL,
	`titleKo` varchar(200) NOT NULL,
	`titleZh` varchar(200) NOT NULL,
	`titleEn` varchar(200) NOT NULL,
	`descriptionKo` text NOT NULL,
	`descriptionZh` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentSections_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentSections_sectionType_unique` UNIQUE(`sectionType`)
);
