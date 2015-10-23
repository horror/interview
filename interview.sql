-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Сен 11 2015 г., 12:22
-- Версия сервера: 5.5.44-0ubuntu0.14.04.1
-- Версия PHP: 5.5.9-1ubuntu4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `interview`
--

-- --------------------------------------------------------

--
-- Структура таблицы `i_answers`
--

CREATE TABLE IF NOT EXISTS `i_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `type` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=97 ;

--
-- Дамп данных таблицы `i_answers`
--

INSERT INTO `i_answers` (`id`, `question_id`, `content`, `type`) VALUES
(1, 5, 'уровень качества обслуживания', 0),
(2, 5, 'ассортимент товаров', 0),
(3, 5, 'скорость обслуживания, простота процедур оформления покупки', 0),
(4, 5, 'качество работы службы доставки', 0),
(5, 5, 'профессиональная компетентность консультантов', 0),
(6, 5, 'качество приобретенного товара', 0),
(7, 5, 'ценовая политика (стоимость товаров и услуг)', 0),
(15, 6, 'не нравится качество обслуживания', 0),
(16, 6, 'маленький ассортимент  ', 0),
(17, 6, 'низкая скорость обслуживания, долгое оформление покупки', 0),
(18, 6, 'низкий уровень работы службы доставки', 0),
(19, 6, 'слабое знание о товарах сотрудниками магазина', 0),
(20, 6, 'некачественный товар', 0),
(21, 6, 'высокие цены', 0),
(24, 8, 'не нравится качество обслуживания', 0),
(25, 8, 'ограниченный ассортимент товаров ', 0),
(26, 8, 'низкая скорость обслуживания и оформления покупок', 0),
(27, 8, 'некачественный товар', 0),
(28, 8, 'слабая подготовленность персонала магазина', 0),
(29, 8, 'низкая скорость и качество работы службы доставки', 0),
(30, 8, 'высокие цены', 0),
(31, 9, 'сотрудник плохо ориентировался и/или ничего не смог рассказать о товаре', 0),
(32, 9, 'сотрудник не понял или не пытался понять, что Вам нужно', 0),
(33, 9, 'сотрудник не захотел или не смог решить Ваш вопрос', 0),
(34, 9, 'сотрудник предложил выбрать товар самостоятельно', 0),
(35, 9, 'сотрудник был невнимателен или не слушал Вас', 0),
(36, 9, 'сотрудник не смог подобрать нужную модель товара', 0),
(37, 10, 'ограниченный выбор техники', 0),
(38, 10, 'полностью не устраивает', 0),
(39, 10, 'нужного товара не оказалось в наличии', 0),
(40, 10, 'не весь ассортимент представлен в торговом зале', 0),
(41, 10, 'мало сопутствующего товара', 0),
(42, 11, 'не позвонили перед доставкой за 1 час', 0),
(43, 11, 'не занесли в квартиру/бросили в подъезде/на этаже', 0),
(44, 11, 'запросили дополнительную плату', 0),
(45, 11, 'нахамили/нагрубили', 0),
(46, 11, 'повредили товар при транспортировке', 0),
(47, 11, 'отказались проверить технику на целостность', 0),
(48, 11, 'привезли позже/раньше установленного срока', 0),
(49, 16, 'сложно находить нужную информацию', 0),
(50, 16, 'сложный процесс оформления покупки', 0),
(51, 16, 'не нравится дизайн', 0),
(52, 16, 'нет возможности отследить покупку', 0),
(53, 16, 'некачественные фотографии товаров', 0),
(54, 16, 'мало описания товара', 0),
(55, 16, 'неудобство отображения функции сравнения', 0),
(56, 16, 'недостоверная информация о товаре', 0),
(57, 16, 'несоответствие товара его описанию', 0),
(58, 17, 'долго ждал оформления и выдачи товара', 0),
(59, 17, 'перепутали заказ', 0),
(60, 17, 'отказались дать дополнительную консультацию по товару', 0),
(61, 17, 'предложили отказаться от интернет-покупки и выкупить товар в розничном магазине', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `i_interview`
--

CREATE TABLE IF NOT EXISTS `i_interview` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `answer` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Структура таблицы `i_interview_meta`
--

CREATE TABLE IF NOT EXISTS `i_interview_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `client` varchar(110) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `shop` int(3) DEFAULT NULL,
  `client_phone` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `order_no` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `calling_date` date DEFAULT NULL,
  `answers_type` int(1) NOT NULL DEFAULT '0',
  `question_categories` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Структура таблицы `i_interview_scores`
--

CREATE TABLE IF NOT EXISTS `i_interview_scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `meta_id` int(11) NOT NULL,
  `score` int(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `i_questions`
--

CREATE TABLE IF NOT EXISTS `i_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `category` int(2) NOT NULL DEFAULT '0',
  `ordinal` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Дамп данных таблицы `i_questions`
--

INSERT INTO `i_questions` (`id`, `content`, `category`, `ordinal`) VALUES
(1, 'Добрый день, Client?', 0, 1),
(3, 'Вас приветствует компания Company. Меня зовут User. \nМы проводим опрос о качестве обслуживания в магазинах нашей сети. Скажите, пожалуйста, у Вас есть возможность ответить на несколько вопросов? Это займет не более 2 минут.', 0, 2),
(4, 'Скажите, пожалуйста, Вы посещали наш магазин на предыдущей (этой) неделе?', 0, 3),
(5, 'Подскажите, компания Company соответствует Вашим ожиданиям?', 0, 4),
(6, 'Готовы ли Вы рекомендовать магазины Company своим друзьям и знакомым?', 0, 5),
(8, 'Если в будущем у Вас возникнет необходимость в приобретении новой техники, какова вероятность того, что Вы обратитесь именно в магазины «Спектр Техники»?', 0, 6),
(9, 'Как бы Вы оценили  качество полученной консультации у сотрудников, которые Вас обслуживали?', 0, 7),
(10, 'Подскажите, Вас устраивает товарный ассортимент в магазинах Company?', 0, 8),
(11, 'Подскажите, пожалуйста, нет ли у Вас замечаний к службе доставки?', 1, 9),
(14, 'Добрый день, Client?', 2, 10),
(15, 'Вас приветствует компания Company. Меня зовут User. \r\nМы проводим опрос о качестве обслуживания в магазинах нашей сети. Скажите, пожалуйста, у Вас есть возможность ответить на несколько вопросов? Это займет не более 1 минуты.', 2, 11),
(16, 'Подскажите, удобен ли Вам Интернет-магазин Company?', 2, 12),
(17, 'Довольны ли Вы работой сотрудников при получении Интернет-заказа в пункте выдачи? ', 2, 13);

-- --------------------------------------------------------

--
-- Структура таблицы `i_users`
--

CREATE TABLE IF NOT EXISTS `i_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `role` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `i_users`
--

INSERT INTO `i_users` (`id`, `name`, `password`) VALUES
(1, '123', 'ce15d3ba2ad41976afbe0ab8931f5b24');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
