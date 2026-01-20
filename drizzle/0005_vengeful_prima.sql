CREATE TABLE `aiTrendSection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleKo` text,
	`titleZh` text,
	`titleEn` text,
	`subtitleKo` text,
	`subtitleZh` text,
	`subtitleEn` text,
	`linkUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiTrendSection_id` PRIMARY KEY(`id`)
);
