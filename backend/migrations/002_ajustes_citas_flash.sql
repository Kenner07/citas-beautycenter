-- Ajustes alineados con el modelo de dominio y requisitos de Citas Flash.
-- No elimina registros ni cambia las empleadas o servicios existentes.

ALTER TABLE clientes
  ADD UNIQUE KEY uq_clientes_telefono (telefono);

ALTER TABLE citas
  ADD UNIQUE KEY uq_cita_inicio_empleada (id_empleada, fecha, hora_inicio),
  ADD KEY idx_citas_estado_fecha (estado, fecha);

-- Domingo queda representado explícitamente como cerrado (activo = 0).
INSERT INTO horarios_empleadas (id_empleada, dia_semana, hora_inicio, hora_fin, activo)
SELECT e.id_empleada, 7, '09:00:00', '20:00:00', 0
FROM empleadas e
WHERE NOT EXISTS (
  SELECT 1
  FROM horarios_empleadas h
  WHERE h.id_empleada = e.id_empleada AND h.dia_semana = 7
);
