import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	type AutorizacionFila,
	type EquipoFila,
	type JugadorFila,
	aEquiposPublicos,
} from './vista-publica.ts';

const INSCRIPCION = '2026-11-26';

function equipo(cambios: Partial<EquipoFila> = {}): EquipoFila {
	return {
		id: 'e1',
		categoria: 'juvenil-senior',
		nombre: 'Prova · Equip',
		estado: 'confirmado',
		origen: 'web',
		...cambios,
	};
}

function jugador(cambios: Partial<JugadorFila> = {}): JugadorFila {
	return {
		id: 'j1',
		equipoId: 'e1',
		nombre: 'Laia',
		apellidos: 'Ferrer Soler',
		fechaNacimiento: '2012-03-01',
		fechaInscripcion: INSCRIPCION,
		dorsal: null,
		esCapitan: false,
		origen: 'web',
		...cambios,
	};
}

function autorizacion(jugadorId: string, recibida = true): AutorizacionFila {
	return { jugadorId, recibida, forma: 'firma_digital' };
}

/** Nombres públicos de un equipo con un solo jugador, con el interruptor de FR-041 encendido. */
function nombresPublicos(jugadores: JugadorFila[], autorizaciones: AutorizacionFila[] = []): string[] {
	const [resultado] = aEquiposPublicos([equipo()], jugadores, autorizaciones, true);
	return resultado.jugadores.map((publico) => publico.nombrePublico);
}

describe('aEquiposPublicos · los once casos de contracts/vista-publica.md', () => {
	const casos: {
		titulo: string;
		jugador: Partial<JugadorFila>;
		autorizado: boolean;
		esperado: string | null;
	}[] = [
		{ titulo: 'menor con nombre y dos apellidos', jugador: {}, autorizado: true, esperado: 'Laia' },
		{
			titulo: 'menor con nombre compuesto sale con la primera palabra',
			jugador: { nombre: ' Maria José ', apellidos: 'Pérez', fechaNacimiento: '2013-05-10' },
			autorizado: true,
			esperado: 'Maria',
		},
		{
			titulo: 'adulto sale con nombre y primer apellido',
			jugador: { nombre: 'Marc', apellidos: 'García Ruiz', fechaNacimiento: '2000-01-15' },
			autorizado: false,
			esperado: 'Marc García',
		},
		{
			titulo: 'adulto con tildes y mayúsculas tal como las escribió',
			jugador: { nombre: 'Àlex', apellidos: 'Íñiguez', fechaNacimiento: '1999-07-07' },
			autorizado: false,
			esperado: 'Àlex Íñiguez',
		},
		{
			titulo: 'adulto con partículas en el primer apellido',
			jugador: { nombre: 'Ana María', apellidos: 'de la Fuente Soler', fechaNacimiento: '1990-03-03' },
			autorizado: false,
			esperado: 'Ana de la Fuente',
		},
		{
			titulo: 'adulto con "i" entre apellidos',
			jugador: { nombre: 'Jordi', apellidos: 'Ferrer i Soler', fechaNacimiento: '1992-06-06' },
			autorizado: false,
			esperado: 'Jordi Ferrer',
		},
		{
			titulo: 'a un día de cumplir 18 años sigue siendo menor',
			jugador: { nombre: 'Pau', apellidos: 'Mira', fechaNacimiento: '2008-11-27' },
			autorizado: true,
			esperado: 'Pau',
		},
		{
			titulo: 'el día que cumple 18 años ya es adulto',
			jugador: { nombre: 'Pau', apellidos: 'Mira', fechaNacimiento: '2008-11-26' },
			autorizado: false,
			esperado: 'Pau Mira',
		},
		{
			titulo: 'sin fecha de nacimiento se trata como menor',
			jugador: { nombre: 'Joan', apellidos: 'Vidal', fechaNacimiento: null },
			autorizado: true,
			esperado: 'Joan',
		},
		{
			titulo: 'menor con autorización no recibida no sale',
			jugador: { nombre: 'Nil', apellidos: 'Sanz', fechaNacimiento: '2012-02-02' },
			autorizado: false,
			esperado: null,
		},
		{
			titulo: 'adulto sin apellidos sale solo con el nombre',
			jugador: { nombre: 'Sara', apellidos: '', fechaNacimiento: '1995-04-04' },
			autorizado: false,
			esperado: 'Sara',
		},
	];

	for (const caso of casos) {
		it(caso.titulo, () => {
			const fila = jugador(caso.jugador);
			const autorizaciones = caso.autorizado ? [autorizacion(fila.id)] : [];
			const esperado = caso.esperado === null ? [] : [caso.esperado];
			assert.deepEqual(nombresPublicos([fila], autorizaciones), esperado);
		});
	}
});

describe('aEquiposPublicos · nombre público', () => {
	it('un menor autorizado no enseña nunca los apellidos', () => {
		const [resultado] = aEquiposPublicos([equipo()], [jugador()], [autorizacion('j1')], true);
		assert.doesNotMatch(JSON.stringify(resultado), /Ferrer|Soler/);
	});

	it('quita los espacios de los extremos y los repetidos', () => {
		const fila = jugador({ nombre: '  Marc   Antoni ', apellidos: '  García   Ruiz ', fechaNacimiento: '1990-01-01' });
		assert.deepEqual(nombresPublicos([fila]), ['Marc García']);
	});

	it('reconoce las partículas "del", "dels", "las", "los" y "d\'" (sin mirar mayúsculas)', () => {
		const adulto = (apellidos: string) => jugador({ nombre: 'Eva', apellidos, fechaNacimiento: '1990-01-01' });
		assert.deepEqual(nombresPublicos([adulto('del Río Pérez')]), ['Eva del Río']);
		assert.deepEqual(nombresPublicos([adulto('dels Pins Mas')]), ['Eva dels Pins']);
		assert.deepEqual(nombresPublicos([adulto('De Los Santos Gil')]), ['Eva De Los Santos']);
		assert.deepEqual(nombresPublicos([adulto('las Heras Mora')]), ['Eva las Heras']);
		assert.deepEqual(nombresPublicos([adulto("d'Alcoi Pons")]), ["Eva d'Alcoi"]);
	});

	it('un jugador sin nombre no sale (no se enseña una fila vacía)', () => {
		assert.deepEqual(nombresPublicos([jugador({ nombre: '   ' })], [autorizacion('j1')]), []);
	});
});

describe('aEquiposPublicos · mayoría de edad en la fecha de inscripción', () => {
	it('cuenta la edad el día de la inscripción, no el de hoy', () => {
		// Hoy tendría más de 18 años, pero cuando se inscribió era menor.
		const fila = jugador({ fechaNacimiento: '2008-12-01', fechaInscripcion: '2026-11-26' });
		assert.deepEqual(nombresPublicos([fila], [autorizacion('j1')]), ['Laia']);
	});

	it('nacido un 29 de febrero cumple 18 el 1 de marzo en un año sin bisiesto', () => {
		const vispera = jugador({ nombre: 'Leo', apellidos: 'Roca', fechaNacimiento: '2008-02-29', fechaInscripcion: '2026-02-28' });
		const dia = jugador({ nombre: 'Leo', apellidos: 'Roca', fechaNacimiento: '2008-02-29', fechaInscripcion: '2026-03-01' });
		assert.deepEqual(nombresPublicos([vispera], [autorizacion('j1')]), ['Leo']);
		assert.deepEqual(nombresPublicos([dia]), ['Leo Roca']);
	});

	it('con una marca temporal completa usa el día de Madrid', () => {
		// 23:30 UTC del 25/11 ya es 26/11 en Madrid: el día que cumple 18 años.
		const fila = jugador({ nombre: 'Pau', apellidos: 'Mira', fechaNacimiento: '2008-11-26', fechaInscripcion: '2026-11-25T23:30:00Z' });
		assert.deepEqual(nombresPublicos([fila]), ['Pau Mira']);
	});
});

describe('aEquiposPublicos · autorización del tutor (FR-024)', () => {
	it('una autorización no recibida no vale', () => {
		assert.deepEqual(nombresPublicos([jugador()], [autorizacion('j1', false)]), []);
	});

	it('la autorización de otro jugador no vale', () => {
		assert.deepEqual(nombresPublicos([jugador()], [autorizacion('otro')]), []);
	});

	it('basta con una autorización recibida aunque haya otra sin recibir', () => {
		assert.deepEqual(nombresPublicos([jugador()], [autorizacion('j1', false), autorizacion('j1', true)]), ['Laia']);
	});

	it('vale cualquier forma: casilla web, firma digital o papel', () => {
		for (const forma of ['casilla_web', 'firma_digital', 'papel'] as const) {
			const fila: AutorizacionFila = { jugadorId: 'j1', recibida: true, forma };
			assert.deepEqual(nombresPublicos([jugador()], [fila]), ['Laia'], forma);
		}
	});
});

describe('aEquiposPublicos · qué equipos salen', () => {
	it('solo salen los confirmados', () => {
		const equipos = [
			equipo({ id: 'a', nombre: 'Prova · A', estado: 'confirmado' }),
			equipo({ id: 'b', nombre: 'Prova · B', estado: 'pendiente' }),
			equipo({ id: 'c', nombre: 'Prova · C', estado: 'espera' }),
		];
		const resultado = aEquiposPublicos(equipos, [], [], true);
		assert.deepEqual(resultado.map((publico) => publico.nombre), ['Prova · A']);
	});

	it('un confirmado sin jugadores visibles sale con la lista vacía: ocupa plaza', () => {
		const resultado = aEquiposPublicos([equipo()], [jugador()], [], true);
		assert.equal(resultado.length, 1);
		assert.deepEqual(resultado[0].jugadores, []);
		assert.equal(resultado[0].jugadoresOcultos, false);
	});

	it('los jugadores de un equipo no se mezclan con los de otro', () => {
		const equipos = [equipo({ id: 'a', nombre: 'A' }), equipo({ id: 'b', nombre: 'B' })];
		const jugadores = [
			jugador({ id: 'j1', equipoId: 'a', nombre: 'Marc', fechaNacimiento: '1990-01-01', apellidos: 'Roca' }),
			jugador({ id: 'j2', equipoId: 'b', nombre: 'Eva', fechaNacimiento: '1990-01-01', apellidos: 'Mas' }),
		];
		const [a, b] = aEquiposPublicos(equipos, jugadores, [], true);
		assert.deepEqual(a.jugadores.map((j) => j.nombrePublico), ['Marc Roca']);
		assert.deepEqual(b.jugadores.map((j) => j.nombrePublico), ['Eva Mas']);
	});
});

describe('aEquiposPublicos · interruptor jugadores_forms_publicables (FR-041)', () => {
	const equipoForms = equipo({ id: 'f', nombre: 'Prova · Forms', origen: 'forms' });
	const jugadorForms = jugador({
		id: 'jf',
		equipoId: 'f',
		nombre: 'Marc',
		apellidos: 'Roca',
		fechaNacimiento: '1990-01-01',
		origen: 'forms',
	});

	it('apagado: un equipo del Forms sale sin jugadores y marcado como ocultos', () => {
		const [resultado] = aEquiposPublicos([equipoForms], [jugadorForms], [], false);
		assert.equal(resultado.jugadoresOcultos, true);
		assert.deepEqual(resultado.jugadores, []);
		assert.doesNotMatch(JSON.stringify(resultado), /Marc|Roca/);
	});

	it('apagado: el equipo del Forms sigue contando como confirmado', () => {
		assert.equal(aEquiposPublicos([equipoForms], [jugadorForms], [], false).length, 1);
	});

	it('encendido: los jugadores del Forms salen con las reglas de siempre', () => {
		const [resultado] = aEquiposPublicos([equipoForms], [jugadorForms], [], true);
		assert.equal(resultado.jugadoresOcultos, false);
		assert.deepEqual(resultado.jugadores.map((j) => j.nombrePublico), ['Marc Roca']);
	});

	it('apagado: en un equipo de la web no sale ningún jugador del Forms, pero sí los de la web', () => {
		const deLaWeb = jugador({ id: 'jw', equipoId: 'e1', nombre: 'Eva', apellidos: 'Mas', fechaNacimiento: '1990-01-01' });
		const delForms = jugador({ id: 'jf2', equipoId: 'e1', nombre: 'Pere', apellidos: 'Gil', fechaNacimiento: '1990-01-01', origen: 'forms' });
		const [resultado] = aEquiposPublicos([equipo()], [deLaWeb, delForms], [], false);
		assert.equal(resultado.jugadoresOcultos, false);
		assert.deepEqual(resultado.jugadores.map((j) => j.nombrePublico), ['Eva Mas']);
	});

	it('apagado: un equipo de la web no se ve afectado', () => {
		const [resultado] = aEquiposPublicos([equipo()], [jugador()], [autorizacion('j1')], false);
		assert.deepEqual(resultado.jugadores.map((j) => j.nombrePublico), ['Laia']);
	});
});

describe('aEquiposPublicos · orden y forma', () => {
	it('los equipos van por orden alfabético del nombre', () => {
		const equipos = [
			equipo({ id: 'a', nombre: 'Prova · Zebres' }),
			equipo({ id: 'b', nombre: 'Prova · Àguiles' }),
			equipo({ id: 'c', nombre: 'Prova · Falcons' }),
		];
		const resultado = aEquiposPublicos(equipos, [], [], true);
		assert.deepEqual(resultado.map((publico) => publico.nombre), ['Prova · Àguiles', 'Prova · Falcons', 'Prova · Zebres']);
	});

	it('los jugadores van con el capitán primero y después por orden alfabético', () => {
		const adulto = (id: string, nombre: string, esCapitan = false) =>
			jugador({ id, nombre, apellidos: 'Roca', fechaNacimiento: '1990-01-01', esCapitan });
		const jugadores = [adulto('1', 'Pau'), adulto('2', 'Àlex'), adulto('3', 'Marc', true), adulto('4', 'Eva')];
		const [resultado] = aEquiposPublicos([equipo()], jugadores, [], true);
		assert.deepEqual(
			resultado.jugadores.map((j) => j.nombrePublico),
			['Marc Roca', 'Àlex Roca', 'Eva Roca', 'Pau Roca'],
		);
		assert.equal(resultado.jugadores[0].esCapitan, true);
	});

	it('el dorsal pasa tal cual y puede faltar', () => {
		const jugadores = [
			jugador({ id: '1', nombre: 'Marc', apellidos: 'Roca', fechaNacimiento: '1990-01-01', dorsal: 10 }),
			jugador({ id: '2', nombre: 'Eva', apellidos: 'Mas', fechaNacimiento: '1990-01-01', dorsal: null }),
		];
		const [resultado] = aEquiposPublicos([equipo()], jugadores, [], true);
		assert.deepEqual(resultado.jugadores.map((j) => j.dorsal), [null, 10]);
	});

	it('solo devuelve los campos públicos (SC-003, FR-026)', () => {
		const [resultado] = aEquiposPublicos([equipo({ origen: 'forms' })], [jugador({ dorsal: 7, esCapitan: true })], [autorizacion('j1')], true);
		assert.deepEqual(Object.keys(resultado).sort(), ['categoria', 'jugadores', 'jugadoresOcultos', 'nombre']);
		assert.deepEqual(Object.keys(resultado.jugadores[0]).sort(), ['dorsal', 'esCapitan', 'nombrePublico']);
	});
});
