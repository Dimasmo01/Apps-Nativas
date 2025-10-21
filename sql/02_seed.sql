insert into aeropuerto (nombre, origen, destino) values ('AEP→MIA', 'AEP', 'MIA');
insert into vuelo (aeropuerto_id, numero_vuelo, fecha, estado, hora_prog_salida, hora_est_salida, puerta) values (1, 'AR1502', '2024-04-25', 'demorado', '15:30', '16:30', '8B');
insert into asiento (vuelo_id, fila, columna) select 1, f, c from generate_series(1,30) f cross join unnest(array['A','B','C','D','E','F']) c;
insert into usuario (username, contraseña, perfil) values ('ana', 'hash_o_temporal', 'pasajero') on conflict do nothing;
insert into pasajero (usuario_id, nombre, apellido, documento, email) values (1, 'Ana', 'Pérez', 'DNI 12345678', 'ana@example.com') on conflict do nothing;
insert into vuelo_pasajero (reserva_id, pasajero_id, vuelo_id) values (98765, 1, 1);
