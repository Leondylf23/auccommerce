/*
 Navicat Premium Data Transfer

 Source Server         : locallaptop
 Source Server Type    : MySQL
 Source Server Version : 80200
 Source Host           : localhost:3306
 Source Schema         : orderin_aja_db

 Target Server Type    : MySQL
 Target Server Version : 80200
 File Encoding         : 65001

 Date: 13/02/2024 11:50:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for SequelizeMeta
-- ----------------------------
DROP TABLE IF EXISTS `SequelizeMeta`;
CREATE TABLE `SequelizeMeta`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of SequelizeMeta
-- ----------------------------
INSERT INTO `SequelizeMeta` VALUES ('20240200033230-create-user.js');
INSERT INTO `SequelizeMeta` VALUES ('20240201024112-create-products.js');
INSERT INTO `SequelizeMeta` VALUES ('20240201026912-create-order.js');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `transactionCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'WAITING',
  `paymentMethod` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `totalPayment` decimal(10, 2) NULL DEFAULT NULL,
  `businessUserId` int NOT NULL,
  `isActive` tinyint(1) NULL DEFAULT 1,
  `createdBy` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `productId`(`productId` ASC) USING BTREE,
  INDEX `businessUserId`(`businessUserId` ASC) USING BTREE,
  INDEX `createdBy`(`createdBy` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`businessUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `imageUrl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `isActive` tinyint(1) NULL DEFAULT 1,
  `createdBy` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `createdBy`(`createdBy` ASC) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (100, 'Kwwi', 50132.42, 'The reason why a great man is great is that he resolves to be a great man. All journeys have secret destinations of which the traveler is unaware. In other words, Navicat provides the ability for data in different databases and/or schemas to be kept up-to', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2011-05-07 19:43:35', '2021-10-24 16:17:35');
INSERT INTO `products` VALUES (101, 'Pluots air', 24299.73, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis. Success consists of going from failure to failure without loss of enthusiasm. You cannot save people, you can just love them. The Synchronize to Database function w', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2024-01-26 17:57:14', '2020-08-09 03:41:50');
INSERT INTO `products` VALUES (102, 'ultra-Raspberry', 46056.33, 'Optimism is the one quality more associated with success and happiness than any other. A man is not old until regrets take the place of dreams.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2000-02-25 12:55:19', '2008-07-03 03:25:32');
INSERT INTO `products` VALUES (103, 'Mango', 51751.24, 'Optimism is the one quality more associated with success and happiness than any other. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2014-07-22 04:30:13', '2016-07-24 18:17:44');
INSERT INTO `products` VALUES (104, 'xOrange', 91640.56, 'Genius is an infinite capacity for taking pains. Creativity is intelligence having fun. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. All the Navicat Cloud objects are located under different pr', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2007-02-11 18:59:53', '2003-01-09 22:15:38');
INSERT INTO `products` VALUES (105, 'ambi-Rhspberry', 5360.79, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. The On Startup feature allows you to control what tabs appear when you launch Navicat. I may not have gone where I intended to go, but I think I have ended up ', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2022-01-13 04:38:03', '2006-09-22 07:56:16');
INSERT INTO `products` VALUES (106, 'Raspberry plus', 25101.80, 'Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2022-01-15 05:42:33', '2013-09-26 19:56:50');
INSERT INTO `products` VALUES (107, 'Pluots', 42598.39, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. A comfort zone is a beautiful place, but nothing ever grows there. With its well-designed Graphical User Interface(GUI), Navicat lets you quickly an', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2023-05-21 20:44:56', '2001-06-18 18:41:59');
INSERT INTO `products` VALUES (108, 'Kiwi', 59112.03, 'Navicat 15 has added support for the system-wide dark mode. A man is not old until regrets take the place of dreams. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membersh', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2014-12-29 07:37:31', '2018-08-09 10:20:32');
INSERT INTO `products` VALUES (109, 'Strawberry core', 80255.10, 'Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. In the middle of winter I at last discovered that there was in me an invincible s', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2020-02-17 00:00:42', '2002-12-07 20:41:25');
INSERT INTO `products` VALUES (110, 'Raspberry', 59561.51, 'You will succeed because most people are lazy. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP.', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2019-02-05 02:23:08', '2002-11-03 10:39:09');
INSERT INTO `products` VALUES (111, 'Raspberry', 13980.71, 'You will succeed because most people are lazy. If you wait, all that happens is you get older. The Synchronize to Database function will give you a full picture of all database differences. Instead of wondering when your next vacation is, maybe you should', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2002-07-20 02:40:13', '2003-09-09 08:59:29');
INSERT INTO `products` VALUES (112, 'xrape elite', 38353.60, 'After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target. To successfully establish a new connection to local/remote server - no matter via SSL, SSH or HTTP, set the database login information in', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2020-01-01 00:48:41', '2000-01-19 06:26:08');
INSERT INTO `products` VALUES (113, 'omni-Orange', 38816.28, 'I will greet this day with love in my heart. After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2016-04-23 19:25:53', '2018-01-11 11:19:36');
INSERT INTO `products` VALUES (114, 'Apple premium', 31658.23, 'You will succeed because most people are lazy. The reason why a great man is great is that he resolves to be a great man. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an exte', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2001-01-16 12:09:29', '2011-06-05 15:20:39');
INSERT INTO `products` VALUES (115, 'ultra-Pluots', 98265.49, 'Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2002-09-28 01:15:34', '2005-10-24 07:00:29');
INSERT INTO `products` VALUES (116, 'Cherry elite', 44449.70, 'Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication.', 'https://d2kwwar9pcd0an.cloudfront.net/eeeb752fdc1a9ba1a94068571257fd7d.jpeg', 1, 2, '2021-04-26 01:05:22', '2023-12-13 18:44:34');
INSERT INTO `products` VALUES (117, 'Rambuean premium', 86295.64, 'If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Por', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2005-12-21 02:54:09', '2001-11-10 18:00:42');
INSERT INTO `products` VALUES (118, 'Mango elite', 73504.93, 'Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2006-12-04 14:22:21', '2015-04-20 18:21:43');
INSERT INTO `products` VALUES (119, 'xaaspberry', 53336.43, 'Flexible settings enable you to set up a custom key for comparison and synchronization. In a Telnet session, all communications, including username and password, are transmitted in plain-text, allowing anyone to listen-in on your session and steal passwor', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2016-09-06 12:04:28', '2020-07-22 15:27:28');
INSERT INTO `products` VALUES (120, 'Apple', 87491.83, 'Success consists of going from failure to failure without loss of enthusiasm. I destroy my enemies when I make them my friends. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login informatio', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2006-08-14 13:32:16', '2017-10-15 19:17:51');
INSERT INTO `products` VALUES (121, 'Grlpe', 59275.76, 'Instead of wondering when your next vacation is, maybe you should set up a life you don’t need to escape from. Actually it is just in an idea when feel oneself can achieve and cannot achieve. Such sessions are also susceptible to session hijacking, wher', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2019-07-30 00:42:08', '2006-08-28 11:22:35');
INSERT INTO `products` VALUES (122, 'Raspberry se', 66310.41, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat', 'https://d2kwwar9pcd0an.cloudfront.net/eeeb752fdc1a9ba1a94068571257fd7d.jpeg', 1, 2, '2004-06-09 09:10:25', '2011-04-13 06:24:28');
INSERT INTO `products` VALUES (123, 'Chenry', 58893.18, 'To successfully establish a new connection to local/remote server - no matter via SSL, SSH or HTTP, set the database login information in the General tab. The reason why a great man is great is that he resolves to be a great man. The Navigation pane emplo', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2014-07-14 07:38:45', '2017-03-17 04:55:17');
INSERT INTO `products` VALUES (124, 'vpple premium', 71503.69, 'Remember that failure is an event, not a person. To start working with your server in Navicat, you should first establish a connection or several connections using the Connection window.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2004-04-05 04:09:46', '2021-07-04 06:31:04');
INSERT INTO `products` VALUES (125, 'Kgwi', 90065.74, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up m', 'https://d2kwwar9pcd0an.cloudfront.net/eeeb752fdc1a9ba1a94068571257fd7d.jpeg', 1, 2, '2022-11-05 12:38:34', '2003-09-02 12:25:10');
INSERT INTO `products` VALUES (126, 'Apphe', 46305.11, 'Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. In the middle of winter I at last discovered that there was in ', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2007-10-16 13:44:21', '2019-04-02 18:55:23');
INSERT INTO `products` VALUES (127, 'Manuo air', 30759.61, 'Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2012-10-06 02:02:27', '2022-01-01 01:05:52');
INSERT INTO `products` VALUES (128, 'Kiwi', 95442.68, 'Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2015-04-18 11:48:44', '2022-12-31 12:56:54');
INSERT INTO `products` VALUES (129, 'urape', 21403.57, 'To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2003-03-13 04:36:07', '2017-08-25 15:42:22');
INSERT INTO `products` VALUES (130, 'Rambutan', 6100.32, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. I will greet this day with love in my heart.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2002-08-26 04:33:38', '2000-08-25 08:53:11');
INSERT INTO `products` VALUES (131, 'Apple', 17713.10, 'The Synchronize to Database function will give you a full picture of all database differences. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2010-01-01 06:35:58', '2011-01-02 00:18:57');
INSERT INTO `products` VALUES (132, 'Strawbeury pro', 74035.84, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does.', 'https://d2kwwar9pcd0an.cloudfront.net/eeeb752fdc1a9ba1a94068571257fd7d.jpeg', 1, 2, '2009-10-29 03:23:16', '2003-08-15 09:56:54');
INSERT INTO `products` VALUES (133, 'Apple', 11300.86, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute commands on a remote server, and move files from one machine to another. After comparing data, the window shows the number of records that will be inserted, updated or', 'https://d2kwwar9pcd0an.cloudfront.net/eeeb752fdc1a9ba1a94068571257fd7d.jpeg', 1, 2, '2012-10-23 10:14:49', '2008-03-31 23:46:39');
INSERT INTO `products` VALUES (134, 'Rambutan pi', 91059.42, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. Sometimes you win, sometimes you learn.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2012-03-12 04:41:00', '2006-03-12 05:09:26');
INSERT INTO `products` VALUES (135, 'Kiji', 23621.62, 'Remember that failure is an event, not a person. A query is used to extract data from the database in a readable format according to the user/s request. Such sessions are also susceptible to session hijacking, where a malicious user takes over your sessio', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2009-05-01 02:00:09', '2007-01-15 18:17:39');
INSERT INTO `products` VALUES (136, 'Orange air', 75910.61, 'You will succeed because most people are lazy. If you wait, all that happens is you get older. Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', 'https://d2kwwar9pcd0an.cloudfront.net/d0e8054699c6c44b0e3467b2259ae012.jpeg', 1, 2, '2008-07-08 00:46:03', '2003-04-18 14:10:08');
INSERT INTO `products` VALUES (137, 'Strawberry plus', 92336.53, 'After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target. All journeys have secret destinations of which the traveler is unaware.', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2017-10-14 09:35:31', '2001-05-01 08:01:33');
INSERT INTO `products` VALUES (138, 'Rambutan', 71009.66, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose th', 'https://d2kwwar9pcd0an.cloudfront.net/8823600fdfa118bad6245f3f56852341.jpeg', 1, 2, '2015-09-03 13:36:51', '2023-06-19 16:15:12');
INSERT INTO `products` VALUES (139, 'Apale plus', 64153.33, 'Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored. To start working with your server in Navicat, you should first establish a connection or several conne', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707712244/image/fkr8uy3qvfyxuep37wqz.png', 1, 2, '2000-01-17 11:03:22', '2008-10-24 20:10:47');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `profileImage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `dob` datetime NULL DEFAULT NULL,
  `role` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `isActive` tinyint(1) NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, 'test@a.a', '$2b$12$V5Z8Mi9xyuZbazDoSwxQm.JQ86Rp60XBtYaYoblr2Ye03j4dncvh6', 'user business 1', 'http://res.cloudinary.com/dwyzuwtel/image/upload/v1707793286/image/snt78n10pxedk0mzbbbq.gif', '2023-09-07 07:00:00', 'business', 1, '2024-02-13 09:39:55', '2024-02-13 10:01:27');

SET FOREIGN_KEY_CHECKS = 1;
