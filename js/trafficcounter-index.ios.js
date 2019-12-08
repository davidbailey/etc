import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Share,
} from 'react-native';


export default class TrafficCounter extends Component {
  constructor(props) { 
    super(props); 
    this.state = { type:'Pedestrian', origin:'North', counts:[], 
    initialPosition: 'unknown',
    lastPosition: 'unknown',
    }
  }

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  typecolor = (x) => {
    if (this.state.type == x) {
      return 'hotpink';
    } else {
      return 'blue';
    }
  }

  origincolor = (x) => {
    if (this.state.origin == x) {
      return 'hotpink';
    } else {
      return 'blue';
     }
   }

  onTypeButtonPress = (x) => {
    this.setState({type:x});
  };

  onOriginButtonPress = (x) => {
    this.setState({origin:x});
  };

  onDestinationButtonPress = (x) => {
    var counts = this.state.counts
    counts.push(Date() + "," + this.state.type + "," + this.state.origin + "," + x + "," + this.state.lastPosition);
    this.setState({ counts: counts});
  };

  share = () => {
    Share.share({
      message: this.state.counts.join('\n')
    });
  }

  undo = () => {
    var counts = this.state.counts
    counts.pop();
    this.setState({ counts: counts});
  };

  clear = () => { this.setState({counts: []})};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Traffic Counter
        </Text>
	<View style={styles.buttons}>
	  <Button title="Pedestrian" color={this.typecolor('Pedestrian')} onPress={() => this.onTypeButtonPress('Pedestrian')} />
	  <Button title="Bicycle" color={this.typecolor('Bicycle')} onPress={() => this.onTypeButtonPress('Bicycle')} />
	  <Button title="Car" color={this.typecolor('Car')} onPress={() => this.onTypeButtonPress('Car')} />
	  <Button title="Truck" color={this.typecolor('Truck')} onPress={() => this.onTypeButtonPress('Truck')} />
	  <Button title="Bus" color={this.typecolor('Bus')} onPress={() => this.onTypeButtonPress('Bus')} />
        </View>
	<View style={styles.buttons}>
	  <Text style={styles.welcome}>
	    Origin
	  </Text>
	  <Button title="North" color={this.origincolor('North')} onPress={() => this.onOriginButtonPress('North')} />
	  <Button title="South" color={this.origincolor('South')} onPress={() => this.onOriginButtonPress('South')} />
	  <Button title="West" color={this.origincolor('West')} onPress={() => this.onOriginButtonPress('West')} />
	  <Button title="East" color={this.origincolor('East')} onPress={() => this.onOriginButtonPress('East')} />
	</View>
	<View style={styles.buttons}>
	  <Text style={styles.welcome}>
	    Destination 
	  </Text>
	  <Button title="North" onPress={() => this.onDestinationButtonPress('North')} />
	  <Button title="South" onPress={() => this.onDestinationButtonPress('South')} />
	  <Button title="West" onPress={() => this.onDestinationButtonPress('West')} />
	  <Button title="East" onPress={() => this.onDestinationButtonPress('East')} />
	</View>
        <Text style={styles.welcome}>
          {this.state.counts.length.toString()}
        </Text>
	  <Button title="Export Results" onPress={() => this.share()} />
	  <Button title="Undo Last Count" onPress={() => this.undo()} />
	  <Button title="Clear Results" onPress={() => this.clear()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('TrafficCounter', () => TrafficCounter);
