import React, {Component} from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div>
      {this.props.data.content.map((key, course) =>
        <p className="clickable">{key}-{course}</p>
      )}

    </div>);
  }
}

export default Home;
