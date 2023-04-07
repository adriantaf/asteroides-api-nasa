'use strict';

const btnBuscar = document.querySelector('#btn-buscar');
const sectionResultado = document.querySelector('#section-resultados');
const nodeListSectionResultado = sectionResultado.childNodes.length;
const apiKey = 'dgtxueScFtSEm7995ymTf4JXw5HxiHmE88hlVMd2';

function buscar() {
	let inputFecha = document.querySelector('#date-fecha');
	let fechaSeleccionada = inputFecha.value;

	if (fechaSeleccionada) {
		let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${fechaSeleccionada}&end_date=${fechaSeleccionada}&api_key=${apiKey}`;

		if (sectionResultado.childNodes.length > nodeListSectionResultado) {
			let cards = sectionResultado.querySelectorAll('.card-asteroide');

			cards.forEach(el => {
				sectionResultado.removeChild(el);
			});
		}
		
		fetch(url)
		.then(response => response.json())
		.then(json => mostrarData(json, fechaSeleccionada))
		.catch(err => console.log('Solicitud fallida', err));
	}
}

function mostrarData(json, fechaSeleccionada) {
	const plantillaCard = document.querySelector('#template-card').content;
	let dataAsteroides = json.near_earth_objects[`${fechaSeleccionada}`];
	let lengthArrayDataAsteroides = dataAsteroides.length;

	dataAsteroides.forEach((ele, i) => {
		let fechaDelElemento = ele.close_approach_data[0].close_approach_date;

		if (fechaDelElemento === fechaSeleccionada) {
			let clonCard = document.importNode(plantillaCard, true);
			let fragmento = document.createDocumentFragment();
			
			fragmento.appendChild(clonCard);

			fragmento.querySelector('#nombre').textContent = ele.name;
			fragmento.querySelector('#fecha').textContent = fechaDelElemento;
			fragmento.querySelector('#cuerpo-que-orbita').textContent = ele.close_approach_data[0].orbiting_body;
			fragmento.querySelector('#velocidad-km-h').textContent = ele.close_approach_data[0].relative_velocity.kilometers_per_hour;
			fragmento.querySelector('#velocidad-km-s').textContent = ele.close_approach_data[0].relative_velocity.kilometers_per_second;
			fragmento.querySelector('#diametro-mayor').textContent = `${ele.estimated_diameter.kilometers.estimated_diameter_max} Km`;
			fragmento.querySelector('#diametro-menor').textContent = `${ele.estimated_diameter.kilometers.estimated_diameter_min} Km`;
			fragmento.querySelector('#es-peligroso').textContent = ele.is_potentially_hazardous_asteroid ? 'Si' : 'No';
			fragmento.querySelector('#num-indicador').textContent = i + 1;
			fragmento.querySelector('#num-limite').textContent = lengthArrayDataAsteroides;

			sectionResultado.appendChild(fragmento);
			if (ele.is_potentially_hazardous_asteroid) {
				sectionResultado.querySelectorAll('.card-asteroide')[i].classList.add('peligroso');
			}
		}
	});
}

btnBuscar.addEventListener('click', buscar);