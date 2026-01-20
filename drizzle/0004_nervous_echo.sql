ALTER TABLE `instructors` MODIFY COLUMN `name` varchar(100);--> statement-breakpoint
ALTER TABLE `instructors` ADD `nameKo` varchar(100);--> statement-breakpoint
ALTER TABLE `instructors` ADD `nameZh` varchar(100);--> statement-breakpoint
ALTER TABLE `instructors` ADD `nameEn` varchar(100);--> statement-breakpoint
ALTER TABLE `instructors` ADD `titleKo` varchar(200);--> statement-breakpoint
ALTER TABLE `instructors` ADD `titleZh` varchar(200);--> statement-breakpoint
ALTER TABLE `instructors` ADD `titleEn` varchar(200);--> statement-breakpoint
ALTER TABLE `instructors` ADD `bioKo` text;--> statement-breakpoint
ALTER TABLE `instructors` ADD `bioZh` text;--> statement-breakpoint
ALTER TABLE `instructors` ADD `bioEn` text;--> statement-breakpoint
ALTER TABLE `instructors` ADD `expertiseKo` text;--> statement-breakpoint
ALTER TABLE `instructors` ADD `expertiseZh` text;--> statement-breakpoint
ALTER TABLE `instructors` ADD `expertiseEn` text;