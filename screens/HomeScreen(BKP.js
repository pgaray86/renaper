import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet,  Text,   TouchableHighlight,  Image, ActivityIndicator,
  TouchableOpacity ,   StatusBar,} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { Camera, Permissions } from 'expo';


export default class App extends Component {
  constructor(props) {
    super(props);
    let source = null;
    this.state = {
      //VARIABLES
      dni: '',
      sexo: '',
      operationId: '',
      //API REST
      jsonData: '' ,
      dataResponse: '',
      //CAMARA
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
    
}

async componentDidMount() {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  this.setState({ hasCameraPermission: status === 'granted' });
}
  onLogin() {
    const { dni, sexo } = this.state;            

    var url = 'https://renaper.dnm.gob.ar/';    
    var data = {
    number: dni,
gender: sexo,
ipAddress: '192.168.1.1',
applicationVersion: '1.0.0',
browserFingerprintData: 'eyJmaW5nZXJwcmludCI6IjcwZjFmY2JhZmRkOWFhMjIzZGVhOWViOTQwYjNjZTAyIiwiZmluZ2VycHJpbnRJbmZvIjp7Imxhbmd1YWdlIjoiZXMtQVIiLCJjb2xvckRlcHRoIjoyNCwidGltZXpvbmVPZmZzZXQiOjE4MCwiaGFzU2Vzc2lvblN0b3JhZ2UiOnRydWUsImhhc0xvY2FsU3RvcmFnZSI6dHJ1ZSwiaGFzSW5kZXhlZERiIjp0cnVlLCJoYXNBZGRCZWhhdmlvciI6ZmFsc2UsImhhc09wZW5EYXRhYmFzZSI6dHJ1ZSwibmF2aWdhdG9yQ3B1Q2xhc3MiOiJuYXZpZ2F0b3JDcHVDbGFzczogdW5rbm93biIsIm5hdmlnYXRvclBsYXRmb3JtIjoibmF2aWdhdG9yUGxhdGZvcm06IFdpbjMyIiwiZG9Ob3RUcmFjayI6ImRvTm90VHJhY2s6IHVua25vd24iLCJwbHVnaW5zIjoiQ2hyb21lIFBERiBQbHVnaW46OlBvcnRhYmxlIERvY3VtZW50IEZvcm1hdDo6YXBwbGljYXRpb24veC1nb29nbGUtY2hyb21lLXBkZn5wZGY7Q2hyb21lIFBERiBWaWV3ZXI6Ojo6YXBwbGljYXRpb24vcGRmfnBkZjtOYXRpdmUgQ2xpZW50Ojo6OmFwcGxpY2F0aW9uL3gtbmFjbH4sYXBwbGljYXRpb24veC1wbmFjbH4iLCJoYXNBZEJsb2NrIjpmYWxzZSwiaGFzTGllZExhbmd1YWdlcyI6ZmFsc2UsImhhc0xpZWRSZXNvbHV0aW9uIjpmYWxzZSwiaGFzTGllZE9zIjpmYWxzZSwiZm9udHMiOiJBRE9CRSBDQVNMT04gUFJPO0FET0JFIEdBUkFNT05EIFBSTztBZ2VuY3kgRkI7QWxnZXJpYW47QXJpYWw7QXJpYWwgQmxhY2s7QXJpYWwgTmFycm93O0Jhc2tlcnZpbGxlIE9sZCBGYWNlO0JhdWhhdXMgOTM7QmVsbCBNVDtCZXJsaW4gU2FucyBGQjtCZXJuYXJkIE1UIENvbmRlbnNlZDtCbGFja2FkZGVyIElUQztCb2RvbmkgNzI7Qm9kb25pIDcyIE9sZHN0eWxlO0JvZG9uaSA3MiBTbWFsbGNhcHM7Qm9kb25pIE1UO0JvZG9uaSBNVCBCbGFjaztCb2RvbmkgTVQgQ29uZGVuc2VkO0Jvb2sgQW50aXF1YTtCb29rbWFuIE9sZCBTdHlsZTtCb29rc2hlbGYgU3ltYm9sIDc7QnJhZGxleSBIYW5kIElUQztCcm9hZHdheTtCcnVzaCBTY3JpcHQgTVQ7Q2FsaWJyaTtDYWxpZm9ybmlhbiBGQjtDYWxpc3RvIE1UO0NhbWJyaWE7Q2FtYnJpYSBNYXRoO0NhbmRhcmE7Q2FzdGVsbGFyO0NlbnRhdXI7Q2VudHVyeTtDZW50dXJ5IEdvdGhpYztDZW50dXJ5IFNjaG9vbGJvb2s7Q2hpbGxlcjtDb2xvbm5hIE1UO0NvbWljIFNhbnMgTVM7Q29uc29sYXM7Q29uc3RhbnRpYTtDb29wZXIgQmxhY2s7Q29wcGVycGxhdGUgR290aGljO0NvcHBlcnBsYXRlIEdvdGhpYyBMaWdodDtDb3JiZWw7Q291cmllcjtDb3VyaWVyIE5ldztDdXJseiBNVDtFYnJpbWE7RWR3YXJkaWFuIFNjcmlwdCBJVEM7RWxlcGhhbnQ7RW5nbGlzaCAxMTEgVml2YWNlIEJUO0VuZ3JhdmVycyBNVDtGZWxpeCBUaXRsaW5nO0Zvb3RsaWdodCBNVCBMaWdodDtGb3J0ZTtGcmFua2xpbiBHb3RoaWM7RnJhbmtsaW4gR290aGljIEJvb2s7RnJhbmtsaW4gR290aGljIEhlYXZ5O0ZyYW5rbGluIEdvdGhpYyBNZWRpdW07RnJlZXN0eWxlIFNjcmlwdDtGcmVuY2ggU2NyaXB0IE1UO0Z1dHVyYTtGdXR1cmEgQmsgQlQ7RnV0dXJhIEx0IEJUO0Z1dHVyYSBNZCBCVDtHYWJyaW9sYTtHYXJhbW9uZDtHZW9yZ2lhO0dlb1NsYWIgNzAzIEx0IEJUO0dlb1NsYWIgNzAzIFhCZCBCVDtHaWdpO0dpbGwgU2FucyBNVDtHaWxsIFNhbnMgTVQgQ29uZGVuc2VkO0dvdWR5IE9sZCBTdHlsZTtHb3VkeSBTdG91dDtIYWV0dGVuc2Nod2VpbGVyO0hhcnJpbmd0b247SGVsdmV0aWNhO0hpZ2ggVG93ZXIgVGV4dDtIdW1hbnN0IDUyMSBDbiBCVDtJbXBhY3Q7SW1wcmludCBNVCBTaGFkb3c7SW5mb3JtYWwgUm9tYW47Sm9rZXJtYW47SnVpY2UgSVRDO0tyaXN0ZW4gSVRDO0t1bnN0bGVyIFNjcmlwdDtMdWNpZGEgQnJpZ2h0O0x1Y2lkYSBDYWxsaWdyYXBoeTtMdWNpZGEgQ29uc29sZTtMdWNpZGEgRmF4O0x1Y2lkYSBIYW5kd3JpdGluZztMdWNpZGEgU2FucztMdWNpZGEgU2FucyBUeXBld3JpdGVyO0x1Y2lkYSBTYW5zIFVuaWNvZGU7TWFnbmV0bztNYWlhbmRyYSBHRDtNYWxndW4gR290aGljO01hcmxldHQ7TWF0dXJhIE1UIFNjcmlwdCBDYXBpdGFscztNaWNyb3NvZnQgSGltYWxheWE7TWljcm9zb2Z0IEpoZW5nSGVpO01pY3Jvc29mdCBOZXcgVGFpIEx1ZTtNaWNyb3NvZnQgUGhhZ3NQYTtNaWNyb3NvZnQgU2FucyBTZXJpZjtNaWNyb3NvZnQgVGFpIExlO01pY3Jvc29mdCBZYUhlaTtNaWNyb3NvZnQgWWkgQmFpdGk7TWluZ0xpVV9IS1NDUy1FeHRCO01pbmdMaVUtRXh0QjtNaW5pb24gUHJvO01pc3RyYWw7TW9kZXJuIE5vLiAyMDtNb25nb2xpYW4gQmFpdGk7TW9ub3R5cGUgQ29yc2l2YTtNUyBHb3RoaWM7TVMgT3V0bG9vaztNUyBQR290aGljO01TIFJlZmVyZW5jZSBTYW5zIFNlcmlmO01TIFJlZmVyZW5jZSBTcGVjaWFsdHk7TVMgU2FucyBTZXJpZjtNUyBTZXJpZjtNUyBVSSBHb3RoaWM7TVYgQm9saTtNWVJJQUQgUFJPO05pYWdhcmEgRW5ncmF2ZWQ7TmlhZ2FyYSBTb2xpZDtOU2ltU3VuO09sZCBFbmdsaXNoIFRleHQgTVQ7T255eDtQYWxhY2UgU2NyaXB0IE1UO1BhbGF0aW5vIExpbm90eXBlO1BhcHlydXM7UGFyY2htZW50O1BlcnBldHVhO1BlcnBldHVhIFRpdGxpbmcgTVQ7UGxheWJpbGw7UE1pbmdMaVUtRXh0QjtQb29yIFJpY2hhcmQ7UHJpc3RpbmE7UmF2aWU7Um9ja3dlbGw7Um9ja3dlbGwgQ29uZGVuc2VkO1NlZ29lIFByaW50O1NlZ29lIFNjcmlwdDtTZWdvZSBVSTtTZWdvZSBVSSBMaWdodDtTZWdvZSBVSSBTZW1pYm9sZDtTZWdvZSBVSSBTeW1ib2w7U2hvd2NhcmQgR290aGljO1NpbVN1bjtTaW1TdW4tRXh0QjtTbmFwIElUQztTdGVuY2lsO1N5bGZhZW47VGFob21hO1RlbXB1cyBTYW5zIElUQztUaW1lcztUaW1lcyBOZXcgUm9tYW47VFJBSkFOIFBSTztUcmVidWNoZXQgTVM7VHcgQ2VuIE1UO1R3IENlbiBNVCBDb25kZW5zZWQ7VW5pdmVycyBDRSA1NSBNZWRpdW07VmVyZGFuYTtWaW5lciBIYW5kIElUQztWaXZhbGRpO1ZsYWRpbWlyIFNjcmlwdDtXaWRlIExhdGluO1dpbmdkaW5ncztXaW5nZGluZ3MgMjtXaW5nZGluZ3MgMztaV0Fkb2JlRiIsImNyY0NhbnZhcyI6IjAyMDc0YjBkIiwiY3JjV2ViR2wiOiIzNWJjZjhiNCIsInNjcmVlblJlc29sdXRpb25JbmZvIjp7InNjcmVlbkhlaWdodCI6MTA4MCwic2NyZWVuV2lkdGgiOjE5MjAsImF2YWlsYWJsZUhlaWdodCI6MTA0MCwiYXZhaWxhYmxlV2lkdGgiOjE5MjB9fSwic3lzdGVtSW5mbyI6eyJ1YSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS82OS4wLjM0OTcuMTAwIFNhZmFyaS81MzcuMzYiLCJicm93c2VyIjp7Im5hbWUiOiJDaHJvbWUiLCJ2ZXJzaW9uIjoiNjkuMC4zNDk3LjEwMCIsIm1ham9yIjoiNjkifSwiZW5naW5lIjp7InZlcnNpb24iOiI1MzcuMzYiLCJuYW1lIjoiV2ViS2l0In0sIm9zIjp7Im5hbWUiOiJXaW5kb3dzIiwidmVyc2lvbiI6IjEwIn0sImRldmljZSI6e30sImNwdSI6eyJhcmNoaXRlY3R1cmUiOiJhbWQ2NCJ9fX0='}
    fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:{
        'Content-Type': 'application/json',
        'apikey':'885b75b2-73e9-4ab4-98bb-45e0e0ad4bc8',
        'url':'http://onboarding.renaper.prod.vusecurity.com:8080/vu-onboarding-rest/onboarding/newOperation',
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => this.setState({ dataResponse: response }));
    this.state.sexo= this.state.dataResponse.sexo;
    this.state.operationId= this.state.dataResponse.operationId;
    
  }
  
  render() {
   let radio_props = [
      {label: 'Femenino', value: 'F' },
      {label: 'Masculino', value: 'M' }
   ];      
   if (this.state.operationId == '') {
    return (                
      <View style={styles.container}>         
      
              
        <TextInput
        value={this.state.dni}
        onChangeText={(dni) => this.setState({ dni })}
        placeholder={'DNI'}
        style={styles.input}
      />
      <RadioForm
        radio_props={radio_props}
        initial={null}
        onPress={(value) => {this.setState({sexo:value})}}
      />        
       <Button
        title={'Aceptar'}
        style={styles.input}
        onPress={this.onLogin.bind(this)}
      />                
    
      </View>   
      

    );
  } else {
    
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity  onPress={this._onPressButton}>
            
    
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log("pantalla!!!")
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                      
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});