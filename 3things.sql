-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Värd: localhost
-- Tid vid skapande: 26 sep 2017 kl 01:13
-- Serverversion: 5.5.55-0+deb8u1
-- PHP-version: 5.6.30-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databas: `3things`
--

DELIMITER $$
--
-- Funktioner
--
CREATE DEFINER=`root`@`localhost` FUNCTION `getUserId`(username VARCHAR(64)) RETURNS int(11)
BEGIN
DECLARE uid INT;
SELECT id INTO uid FROM users WHERE name = username LIMIT 1;
IF uid IS NOT NULL THEN
  RETURN uid;
ELSE
  INSERT INTO users(name) VALUES(username);
  RETURN LAST_INSERT_ID();
END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellstruktur `occasions`
--

CREATE TABLE IF NOT EXISTS `occasions` (
`id` tinyint(3) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `occasions`
--

INSERT INTO `occasions` (`id`, `name`, `date`) VALUES
(1, 'Malmö-resa', '2017-09-30');

-- --------------------------------------------------------

--
-- Tabellstruktur `secrets`
--

CREATE TABLE IF NOT EXISTS `secrets` (
`id` smallint(5) unsigned NOT NULL,
  `occasion_id` tinyint(3) unsigned NOT NULL,
  `user_id` tinyint(3) unsigned NOT NULL,
  `secret` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` tinyint(3) unsigned NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `occasions`
--
ALTER TABLE `occasions`
 ADD PRIMARY KEY (`id`);

--
-- Index för tabell `secrets`
--
ALTER TABLE `secrets`
 ADD PRIMARY KEY (`id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `occasions`
--
ALTER TABLE `occasions`
MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT för tabell `secrets`
--
ALTER TABLE `secrets`
MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
