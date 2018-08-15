import React, {Component} from 'react';
import './App.css';
import Home from './Home/Home.js';
import Library from './Library/Library.js';
import Download from './Download/Download.js';
import Tutorial from './Tutorial/Tutorial.js';
import featured from './DevelopmentTestFiles/featured.json';
import library from './DevelopmentTestFiles/library.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentID: 1,
      contentData:featured
    };
    this.setContent = this.setContent.bind(this);
  }

  setContent(currentContent){
    var currentContentData={};
    if(currentContent==1){
      currentContentData=featured;
    }
    if(currentContent==2){
      currentContentData=library;
    }
    this.setState({
      contentID:currentContent,
      contentData:currentContentData
    });

  }

  render() {
    return (<div id="complete_container">
      <header>
          <h1 id="app_title">Coursera Downloader</h1>
      </header>
      <div className="container auto_height" id="app_container">
        <div className="row auto_height" style={{margin:'0px'}}>
        <div id="app_sidebar" className="col-md-3">
          <button className="app_sidebar_button" onClick={() => this.setContent(1)}>
            <span className="glyphicon glyphicon-home"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Destacados</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.setContent(2)}>
            <span className="glyphicon glyphicon-time"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Por Revisar</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.setContent(3)}>
            <span className="glyphicon glyphicon-ok"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Revisados</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.setContent(4)}>
            <span className="glyphicon glyphicon-download-alt"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Decargar</span>
          </button>

          <button className="app_sidebar_button" onClick={() => this.setContent(5)}>
            <span className="glyphicon glyphicon-book"></span>
            <span className="app_sidebar_button_text">&nbsp; &nbsp; Tutorial</span>
          </button>
        </div>

        <div id="app_main_content" className="col-md-9 auto_height">
          {this.state.contentID==1 ? <Home data={this.state.contentData}></Home> : <span></span>}
          {this.state.contentID==2 ? <span>Por revisar &nbsp; <Library root={true} data={this.state.contentData}></Library></span> : <span></span>}
          {this.state.contentID==3 ? <Library data={this.state.contentData}></Library> : <span></span>}
          {this.state.contentID==4 ? <Download></Download> : <span></span>}
          {this.state.contentID==5 ? <Tutorial></Tutorial> : <span></span>}
        </div>
      </div>
      </div>
    </div>);
  }
}

export default App;
