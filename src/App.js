import React, {Component} from 'react';
import './App.css';
import './bootstrap-grid.min.css';
import Home from './Home/Home.js';
import LibraryContainer from './LibraryContainer/LibraryContainer.js';
import Download from './Download/Download.js';
import Tutorial from './Tutorial/Tutorial.js';
import Courses from './Courses/Courses.js';
import featured from './DevelopmentTestFiles/featured.json';
import library from './DevelopmentTestFiles/library.json';
import Loading from './Loading/Loading.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentID: 5,
      contentData:featured
    };
    this.setContent = this.setContent.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
  }

  componentWillMount() {
  }

  setContent(currentContent){
    var currentContentData={};
    if(currentContent==1){
      currentContentData=featured;
      //currentContentData=this.state.featured;
    }
    if(currentContent==2){
      currentContentData=featured;
      //currentContentData=this.state.pending;
    }
    if(currentContent==3){
      currentContentData=featured;
      //currentContentData=this.state.ready;
    }
    if(currentContent==4){
      currentContentData=this.state.directory_tree_json;
    }
    this.setState({
      contentID:currentContent,
      contentData:currentContentData
    });

  }

  changeSelection(currentContent) {
    this.setState({
      contentID: 6
    } );
    setTimeout( function(){this.setContent(currentContent);}.bind(this), 100);
  }

  render() {
    return (<div id="complete_container">
      <header>
          <h1 id="app_title">Coursera Compiler</h1>
          <img id="uniandes_logo" src={require('./uniandes_logo.png')} />
      </header>
      <div className="container auto_height" id="app_container">
        <div className="row auto_height" style={{margin:'0px'}}>
        <div id="app_sidebar" className="col-md-3">
          <button className="app_sidebar_button" onClick={() => this.changeSelection(1)}>
            <span className="glyphicon glyphicon-home"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Home</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.changeSelection(2)}>
            <span className="glyphicon glyphicon-ok"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Courses</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.changeSelection(4)}>
            <span className="glyphicon glyphicon-download-alt"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Download</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.changeSelection(5)}>
            <span className="glyphicon glyphicon-book"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Tutorial</span>
          </button>
        </div>

        <div id="app_main_content" className="col-md-9 auto_height">
          {this.state.contentID==1 && <Home data={this.state.contentData}></Home>}
          {this.state.contentID==2 && <Courses></Courses>}

          {this.state.contentID==4 && <Download></Download>}
          {this.state.contentID==5 && <Tutorial></Tutorial>}
          {this.state.contentID==6 && <Loading></Loading>}
        </div>
      </div>
      </div>
    </div>);
  }
}

export default App;

/**

<button className="app_sidebar_button" onClick={() => this.changeSelection(3)}>
  <span className="glyphicon glyphicon-file"></span>
  <span className="app_sidebar_button_text">&nbsp; &nbsp; All Files</span>
</button>


{this.state.contentID==3 && <LibraryContainer></LibraryContainer>}

*/
