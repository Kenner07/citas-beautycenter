-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: citas_flash
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `citas_flash`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `citas_flash` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `citas_flash`;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auditoria` (
  `id_auditoria` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) unsigned DEFAULT NULL,
  `entidad` varchar(60) NOT NULL,
  `id_registro` varchar(80) NOT NULL,
  `accion` enum('crear','actualizar','cancelar','eliminacion_logica','inicio_sesion','otro') NOT NULL DEFAULT 'otro',
  `detalle` text DEFAULT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_auditoria`),
  KEY `fk_auditoria_usuario` (`id_usuario`),
  KEY `idx_auditoria_entidad_registro` (`entidad`,`id_registro`),
  KEY `idx_auditoria_fecha` (`fecha_hora`),
  CONSTRAINT `fk_auditoria_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (3,NULL,'cita','3','crear','Reserva creada desde el portal público','2026-11-02 13:35:47');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `citas` (
  `id_cita` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_cliente` int(10) unsigned NOT NULL,
  `id_empleada` int(10) unsigned NOT NULL,
  `id_servicio` int(10) unsigned NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `duracion_minutos` smallint(5) unsigned NOT NULL,
  `estado` enum('pendiente','confirmada','completada','cancelada','no_asistio') NOT NULL DEFAULT 'pendiente',
  `precio_acordado` decimal(10,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_usuario_creacion` int(10) unsigned DEFAULT NULL,
  `google_event_id` varchar(255) DEFAULT NULL,
  `estado_sincronizacion` enum('no_aplica','pendiente','sincronizada','error') NOT NULL DEFAULT 'pendiente',
  `mensaje_error_sincronizacion` text DEFAULT NULL,
  `eliminado_en` datetime DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_cita`),
  UNIQUE KEY `uq_cita_inicio_empleada` (`id_empleada`,`fecha`,`hora_inicio`),
  KEY `fk_citas_servicio` (`id_servicio`),
  KEY `fk_citas_usuario` (`id_usuario_creacion`),
  KEY `idx_citas_fecha_estado` (`fecha`,`estado`),
  KEY `idx_citas_empleada_fecha_hora` (`id_empleada`,`fecha`,`hora_inicio`),
  KEY `idx_citas_cliente_fecha` (`id_cliente`,`fecha`),
  KEY `idx_citas_google_event` (`google_event_id`),
  KEY `idx_citas_estado_fecha` (`estado`,`fecha`),
  CONSTRAINT `fk_citas_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `fk_citas_empleada` FOREIGN KEY (`id_empleada`) REFERENCES `empleadas` (`id_empleada`),
  CONSTRAINT `fk_citas_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`),
  CONSTRAINT `fk_citas_usuario` FOREIGN KEY (`id_usuario_creacion`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `chk_cita_duracion` CHECK (`duracion_minutos` > 0),
  CONSTRAINT `chk_cita_precio` CHECK (`precio_acordado` is null or `precio_acordado` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (3,3,1,1,'2026-11-04','09:00:00',45,'confirmada',NULL,NULL,NULL,NULL,'pendiente',NULL,NULL,'2026-11-02 13:35:47','2026-11-02 13:35:47');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id_cliente` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `telefono` varchar(30) NOT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `uq_clientes_telefono` (`telefono`),
  KEY `idx_clientes_nombre` (`apellido`,`nombre`),
  KEY `idx_clientes_telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (3,'Pamela Anderson',NULL,'13213223231','pamelaanderson@gmail.com',NULL,1,'2026-11-02 13:35:47','2026-11-02 13:35:47');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleadas`
--

DROP TABLE IF EXISTS `empleadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empleadas` (
  `id_empleada` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_salon` int(10) unsigned NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `especialidad` varchar(80) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_empleada`),
  KEY `idx_empleadas_salon_activo` (`id_salon`,`activo`),
  CONSTRAINT `fk_empleadas_salon` FOREIGN KEY (`id_salon`) REFERENCES `salon` (`id_salon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleadas`
--

LOCK TABLES `empleadas` WRITE;
/*!40000 ALTER TABLE `empleadas` DISABLE KEYS */;
INSERT INTO `empleadas` VALUES (1,1,'Yise',NULL,'Uñas',NULL,NULL,1,'2026-10-12 16:16:52'),(2,1,'Yisela',NULL,'Uñas',NULL,NULL,1,'2026-10-12 16:16:52'),(3,1,'Sofia',NULL,'Peluquería',NULL,NULL,1,'2026-10-12 16:16:52');
/*!40000 ALTER TABLE `empleadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleadas_servicios`
--

DROP TABLE IF EXISTS `empleadas_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empleadas_servicios` (
  `id_empleada` int(10) unsigned NOT NULL,
  `id_servicio` int(10) unsigned NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_empleada`,`id_servicio`),
  KEY `fk_es_servicio` (`id_servicio`),
  CONSTRAINT `fk_es_empleada` FOREIGN KEY (`id_empleada`) REFERENCES `empleadas` (`id_empleada`),
  CONSTRAINT `fk_es_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleadas_servicios`
--

LOCK TABLES `empleadas_servicios` WRITE;
/*!40000 ALTER TABLE `empleadas_servicios` DISABLE KEYS */;
INSERT INTO `empleadas_servicios` VALUES (1,1,1),(1,2,1),(1,3,1),(2,1,1),(2,2,1),(2,3,1),(3,4,1),(3,5,1),(3,6,1);
/*!40000 ALTER TABLE `empleadas_servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_empleadas`
--

DROP TABLE IF EXISTS `horarios_empleadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horarios_empleadas` (
  `id_horario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_empleada` int(10) unsigned NOT NULL,
  `dia_semana` tinyint(3) unsigned NOT NULL,
  `hora_inicio` time NOT NULL DEFAULT '09:00:00',
  `hora_fin` time NOT NULL DEFAULT '20:00:00',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_horario`),
  UNIQUE KEY `uq_empleada_dia` (`id_empleada`,`dia_semana`),
  CONSTRAINT `fk_horarios_empleada` FOREIGN KEY (`id_empleada`) REFERENCES `empleadas` (`id_empleada`),
  CONSTRAINT `chk_horario_dia` CHECK (`dia_semana` between 1 and 7),
  CONSTRAINT `chk_horario_rango` CHECK (`hora_inicio` < `hora_fin`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_empleadas`
--

LOCK TABLES `horarios_empleadas` WRITE;
/*!40000 ALTER TABLE `horarios_empleadas` DISABLE KEYS */;
INSERT INTO `horarios_empleadas` VALUES (1,1,1,'09:00:00','20:00:00',1),(2,2,1,'09:00:00','20:00:00',1),(3,3,1,'09:00:00','20:00:00',1),(4,1,2,'09:00:00','20:00:00',1),(5,2,2,'09:00:00','20:00:00',1),(6,3,2,'09:00:00','20:00:00',1),(7,1,3,'09:00:00','20:00:00',1),(8,2,3,'09:00:00','20:00:00',1),(9,3,3,'09:00:00','20:00:00',1),(10,1,4,'09:00:00','20:00:00',1),(11,2,4,'09:00:00','20:00:00',1),(12,3,4,'09:00:00','20:00:00',1),(13,1,5,'09:00:00','20:00:00',1),(14,2,5,'09:00:00','20:00:00',1),(15,3,5,'09:00:00','20:00:00',1),(16,1,6,'09:00:00','20:00:00',1),(17,2,6,'09:00:00','20:00:00',1),(18,3,6,'09:00:00','20:00:00',1),(19,1,7,'09:00:00','20:00:00',0),(20,2,7,'09:00:00','20:00:00',0),(21,3,7,'09:00:00','20:00:00',0);
/*!40000 ALTER TABLE `horarios_empleadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salon`
--

DROP TABLE IF EXISTS `salon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `salon` (
  `id_salon` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `zona_horaria` varchar(60) NOT NULL DEFAULT 'America/Bogota',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_salon`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salon`
--

LOCK TABLES `salon` WRITE;
/*!40000 ALTER TABLE `salon` DISABLE KEYS */;
INSERT INTO `salon` VALUES (1,'Samantha Beauty Center',NULL,NULL,'America/Bogota',1,'2026-10-12 16:16:52');
/*!40000 ALTER TABLE `salon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicios` (
  `id_servicio` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` enum('unas','peluqueria','otro') NOT NULL DEFAULT 'otro',
  `duracion_minutos` smallint(5) unsigned NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_servicio`),
  UNIQUE KEY `nombre` (`nombre`),
  CONSTRAINT `chk_servicio_duracion` CHECK (`duracion_minutos` > 0),
  CONSTRAINT `chk_servicio_precio` CHECK (`precio` is null or `precio` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Manicure','Servicio de cuidado de uñas','unas',45,NULL,1,'2026-10-12 16:16:52'),(2,'Pedicure','Servicio de cuidado de pies y uñas','unas',60,NULL,1,'2026-10-12 16:16:52'),(3,'Manicure y pedicure','Servicio combinado de uñas','unas',90,NULL,1,'2026-10-12 16:16:52'),(4,'Corte de cabello','Corte de cabello','peluqueria',45,NULL,1,'2026-10-12 16:16:52'),(5,'Cepillado','Peinado y cepillado','peluqueria',45,NULL,1,'2026-10-12 16:16:52'),(6,'Tinte','Aplicación de tinte','peluqueria',120,NULL,1,'2026-10-12 16:16:52');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_empleada` int(10) unsigned DEFAULT NULL,
  `nombre_usuario` varchar(80) NOT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `hash_contrasena` varchar(255) NOT NULL,
  `rol` enum('administradora','empleada') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `ultimo_acceso` datetime DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_usuarios_empleada` (`id_empleada`),
  CONSTRAINT `fk_usuarios_empleada` FOREIGN KEY (`id_empleada`) REFERENCES `empleadas` (`id_empleada`),
  CONSTRAINT `chk_usuario_rol_empleada` CHECK (`rol` <> 'empleada' or `id_empleada` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,NULL,'admin','admin@samanthabeauty.local','pbkdf2_sha256$200000$samantha-admin-2026$TsTSvamSZ6bTWqCFK4be/XRuy+uTic29iXRlE7P5Ex4=','administradora',1,NULL,'2026-11-02 13:40:21');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'citas_flash'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-02  9:23:25
