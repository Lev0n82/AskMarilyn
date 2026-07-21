ALTER TABLE `widgets` ADD `aiProvider` enum('manus','ollama','vllm','openai_compatible') DEFAULT 'manus' NOT NULL;--> statement-breakpoint
ALTER TABLE `widgets` ADD `aiApiBaseUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `widgets` ADD `aiApiKey` varchar(512);--> statement-breakpoint
ALTER TABLE `widgets` ADD `aiModel` varchar(128);--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceEnabled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceActivationMode` enum('with_overlay','separate_toggle','always_visible') DEFAULT 'separate_toggle';--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceIdleOpacity` int DEFAULT 30;--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceActiveOpacity` int DEFAULT 90;--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceScope` enum('accessibility','chat','both') DEFAULT 'both';--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceLanguageMode` enum('auto_detect','pre_selected','user_chosen') DEFAULT 'auto_detect';--> statement-breakpoint
ALTER TABLE `widgets` ADD `voiceLanguages` json;--> statement-breakpoint
ALTER TABLE `widgets` ADD `voicePosition` enum('top_left','top_right','bottom_left','bottom_right','center') DEFAULT 'bottom_left';