-- Usuario inicial para el panel administrativo local.
-- Credenciales iniciales: admin / admin123. Cambiar antes de publicar.
INSERT INTO usuarios (id_empleada, nombre_usuario, correo, hash_contrasena, rol, activo)
SELECT NULL, 'admin', 'admin@samanthabeauty.local', 'pbkdf2_sha256$200000$samantha-admin-2026$TsTSvamSZ6bTWqCFK4be/XRuy+uTic29iXRlE7P5Ex4=', 'administradora', 1
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre_usuario = 'admin');
