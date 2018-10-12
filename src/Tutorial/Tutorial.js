import React, {Component} from 'react';

class Tutorial extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div>
      <h2>Tutorial</h2>
      <p>This webapp seeks to facilitate the compilation of data downloaded from coursera.</p>
      <p>In the "Courses" section, you can see a list of all available courses. Those that are red need to be revised, and those that are green have already been organized and appropriately tagged. Here you can view the courses metadata, files, and lessons. You can relocate files and reorganize the lessons. You can also tag the lessons with specific caracteristics.</p>
      <p>In the "Download" section, you can petition the server to download and analyze a course. It automatically add to the course list.</p>
      <br/>
      <p>This app was created in The University of the Andes. For support contact Felipe Cueto at <a href="f.cueto10@uniandes.edu.co">f.cueto10@uniandes.edu.co</a>.</p>
    </div>);
  }
}

export default Tutorial;
