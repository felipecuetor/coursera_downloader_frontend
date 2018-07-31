import React, {Component} from 'react';

class Tutorial extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div>
      <h2>Tutorial</h2>
      <p>Esta apliación de permite descargar cursos completos de cursera, organizados por tema de la clase.</p>
      <p>Primero debes hacer una petición para descargar un curso. Para eso debes ir a la seccion de descarga. Allí debes proveer el nombre completo del curso que buscas descargar. Al presionar el botón de descarga el sistema te informara si fue aceptada.</p>
      <p>Luego para descargar el curso debes ir a la sección -Libreria-. Allí encontraras un listado de todos los cursos disponibles. Podrás seleccionar el lenguaje de suptitulos preferido, o podrás descargar todos los archivos de un curso. También podrás modificar la organización de los archivos si descubres que un archivo se encuentra en el lugar equivocado.</p>
    </div>);
  }
}

export default Tutorial;
