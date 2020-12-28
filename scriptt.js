const d = document;
const $table = d.querySelector('.crud-table');
const $form = d.querySelector('.crud-form');
const $title = d.querySelector('.crud-title');
const $template = d.getElementById('crud-template').content;

const $fragment = d.createDocumentFragment();
const obtenerTodo = async () => {
	try {
		const res = await fetch('http://localhost:5555/discos');
		const json = await res.json();
		console.log(json);
		if (!res.ok) throw { status: res.status, statusText: res.statusText };
		json.forEach((el) => {
			$template.querySelector('.template-name').innerHTML = el.nombre;
			$template.querySelector('.template-artist').innerHTML = el.artista;

			$template.querySelector('.template-edit').dataset.id = el.id;
			$template.querySelector('.template-edit').dataset.name = el.nombre;
			$template.querySelector('.template-edit').dataset.artist = el.artista;

			$template.querySelector('.template-delete').dataset.id = el.id;
			let $clonDelTemplate = d.importNode($template, true);
			$fragment.appendChild($clonDelTemplate);
		});
		$table.querySelector('tbody').appendChild($fragment);
	} catch (err) {
		let message = err.statusText || 'Ocurrió un error';
		$table.insertAdjacentHTML(
			'afterend',
			`<p><b>Error ${err.status}: ${message}</b></p>`
		);
	}
};

d.addEventListener('DOMContentLoaded', obtenerTodo);

d.addEventListener('submit', async (e) => {
	if (e.target === $form) {
		e.preventDefault();
	}
	// si el input con name="id" no tiene nada en valor hace el create
	if (!$form.id.value) {
		// CREATE-POST
		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					// el valor de los inputs
					nombre: e.target.nombre.value,
					artista: e.target.artista.value,
				}),
			};
			const res = await fetch('http://localhost:5555/discos', options);

			if (!res.ok) throw { status: res.status, statusText: res.statusText };
			location.reload();
		} catch (err) {
			let message = err.statusText || 'Ocurrió un error';
			$form.insertAdjacentHTML(
				'afterend',
				`<p><b>Error ${err.status}: ${message}</b></p>`
			);
		}
	} else {
		// UPDATE-PUT
		try {
			const options = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					// el valor de los inputs
					nombre: e.target.nombre.value,
					artista: e.target.artista.value,
				}),
			};
			const res = await fetch(
				// el input con name="id" en su valor
				`http://localhost:5555/discos/${e.target.id.value}`,
				options
			);

			if (!res.ok) throw { status: res.status, statusText: res.statusText };
			location.reload();
		} catch (err) {
			let message = err.statusText || 'Ocurrió un error';
			$form.insertAdjacentHTML(
				'afterend',
				`<p><b>Error ${err.status}: ${message}</b></p>`
			);
		}
	}
});
d.addEventListener('click', async (e) => {
	if (e.target.matches('.template-edit')) {
		$title.textContent = 'Editar Disco';
		// a los inputs les pongo los que tiene en sus data atributos puesto anteioriomente
		$form.nombre.value = e.target.dataset.name;
		$form.artista.value = e.target.dataset.artist;
		$form.id.value = e.target.dataset.id;
	}
	if (e.target.matches('.template-delete')) {
		let isDelete = confirm(
			`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`
		);

		if (isDelete) {
			//Delete - DELETE
			try {
				let options = {
						method: 'DELETE',
						headers: {
							'Content-type': 'application/json; charset=utf-8',
						},
					},
					res = await fetch(
						`http://localhost:5555/discos/${e.target.dataset.id}`,
						options
					);

				if (!res.ok) throw { status: res.status, statusText: res.statusText };

				location.reload();
			} catch (err) {
				let message = err.statusText || 'Ocurrió un error';
				alert(`Error ${err.status}: ${message}`);
			}
		}
	}
});
