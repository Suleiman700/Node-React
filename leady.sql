-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 13, 2024 at 11:57 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leady`
--
CREATE DATABASE IF NOT EXISTS `leady` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `leady`;

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` mediumint UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `platform` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `active` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `campaigns`
--

INSERT INTO `campaigns` (`id`, `user_id`, `name`, `token`, `description`, `platform`, `active`, `created_at`, `updated_at`) VALUES
(60, 1, 'Buy Tesla', '10125d523d4q00012i0c', '', 'Facebook', '1', '2024-12-13 03:39:33', '2024-12-13 03:39:33'),
(61, 1, 'فحص اتعاب بالدوله', '5u0s6c2g636400013n5c', '', 'Facebook', '1', '2024-12-13 13:56:29', '2024-12-13 13:56:29');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
CREATE TABLE IF NOT EXISTS `leads` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` mediumint UNSIGNED DEFAULT NULL,
  `campaign_id` mediumint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `user_id`, `campaign_id`, `data`, `created_at`, `updated_at`) VALUES
(6, 1, 60, '{\"form\":{\"formId\":\"contact-form\",\"submissionTime\":\"2024-12-13T01:51:30.000Z\"},\"submissionData\":{\"fields\":[{\"fieldName\":\"name\",\"value\":\"Test User\"},{\"fieldName\":\"email\",\"value\":\"test@example.com\"},{\"fieldName\":\"message\",\"value\":\"This is a test submission\"}]}}', '2024-12-13 11:39:50', '2024-12-13 13:39:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `active` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `active`) VALUES
(1, 'Suleiman', 'soleman630@gmail.com', '$2a$12$Yy3HJ9Q6mnLUlSOXvVJmQ.wG7zY86D5M38xzwWJoLjpYrubcS16su', '1'),
(2, 'test', 'soleman630@gmail.com', '$2a$12$Yy3HJ9Q6mnLUlSOXvVJmQ.wG7zY86D5M38xzwWJoLjpYrubcS16su', '1');

-- --------------------------------------------------------

--
-- Table structure for table `user_campaign_platforms`
--

DROP TABLE IF EXISTS `user_campaign_platforms`;
CREATE TABLE IF NOT EXISTS `user_campaign_platforms` (
  `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` mediumint UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `favicon_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` varchar(1) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_campaign_platforms`
--

INSERT INTO `user_campaign_platforms` (`id`, `user_id`, `name`, `favicon_url`, `active`, `created_at`, `updated_at`) VALUES
(14, 1, 'Snapchat', 'https://snapchat.com/favicon.ico', '1', '2024-12-13 13:55:02', '2024-12-13 13:55:02'),
(15, 1, 'Facebook', 'https://facebook.com/favicon.ico', '1', '2024-12-13 13:55:59', '2024-12-13 13:55:59');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `user_campaign_platforms`
--
ALTER TABLE `user_campaign_platforms`
  ADD CONSTRAINT `user_campaign_platforms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
