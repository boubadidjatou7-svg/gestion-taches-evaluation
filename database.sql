-- Base de données pour l'application de gestion de tâches
--
-- SET NAMES force l'encodage de LA SESSION D'IMPORT en utf8mb4, quel que soit
-- le charset par défaut du client mysql (souvent latin1 sous Windows). Sans
-- cette ligne, les caractères accentués (ex: "Terminé") peuvent être corrompus
-- pendant l'import même si les tables ci-dessous sont bien déclarées en utf8mb4.
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS gestion_taches CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Si la base existait déjà avec un autre charset (ex: créée avant ce script),
-- ALTER DATABASE corrige son charset par défaut pour les futures tables.
ALTER DATABASE gestion_taches CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_taches;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('En attente', 'En cours', 'Terminé') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'En attente',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
